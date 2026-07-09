import { prisma } from '$lib/server/prisma';

type ValidateAppointmentInput = {
	date: Date;
	time: string;
	appointmentIdToIgnore?: string;
};

function toUtcNoonDate(date: Date) {
	return new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0, 0)
	);
}

export async function getBusinessScheduleForDate(date: Date) {
	const dayOfWeek = date.getUTCDay();

	return prisma.businessSchedule.findUnique({
		where: {
			dayOfWeek
		}
	});
}

export async function getHolidayForDate(date: Date) {
	return prisma.holiday.findFirst({
		where: {
			date: toUtcNoonDate(date),
			isEnabled: true
		}
	});
}

export async function getEnabledHolidays() {
	return prisma.holiday.findMany({
		where: {
			isEnabled: true
		},
		orderBy: {
			date: 'asc'
		}
	});
}

function isTimeInsideRange(time: string, start: string | null, end: string | null) {
	if (!start || !end) {
		return false;
	}

	return time >= start && time <= end;
}

export async function validateAppointmentSchedule({
	date,
	time,
	appointmentIdToIgnore
}: ValidateAppointmentInput) {
	const holiday = await getHolidayForDate(date);

	if (holiday) {
		return {
			ok: false,
			message: `No se pueden tomar turnos el día seleccionado porque está marcado como feriado o día bloqueado: ${holiday.name}.`
		};
	}

	const schedule = await getBusinessScheduleForDate(date);

	if (!schedule || !schedule.isEnabled) {
		return {
			ok: false,
			message: 'El día seleccionado no está habilitado para tomar turnos.'
		};
	}

	const isInsideMorning = isTimeInsideRange(time, schedule.morningStart, schedule.morningEnd);
	const isInsideAfternoon = isTimeInsideRange(time, schedule.afternoonStart, schedule.afternoonEnd);

	if (!isInsideMorning && !isInsideAfternoon) {
		return {
			ok: false,
			message: `El horario seleccionado no está dentro del horario laboral configurado para ${schedule.dayName}.`
		};
	}

	const startOfDay = new Date(date);
	startOfDay.setUTCHours(0, 0, 0, 0);

	const endOfDay = new Date(date);
	endOfDay.setUTCHours(23, 59, 59, 999);

	const appointmentsCount = await prisma.appointment.count({
		where: {
			date: {
				gte: startOfDay,
				lte: endOfDay
			},
			status: {
				not: 'CANCELADO'
			},
			...(appointmentIdToIgnore
				? {
						id: {
							not: appointmentIdToIgnore
						}
					}
				: {})
		}
	});

	if (appointmentsCount >= schedule.maxAppointments) {
		return {
			ok: false,
			message: `Ya se alcanzó el máximo de ${schedule.maxAppointments} turnos para ${schedule.dayName}.`
		};
	}

	return {
		ok: true,
		message: 'Horario disponible.'
	};
}

export async function getEnabledBusinessSchedules() {
	return prisma.businessSchedule.findMany({
		where: {
			isEnabled: true
		},
		orderBy: {
			dayOfWeek: 'asc'
		}
	});
}
