import { AppointmentStatus } from '@prisma/client';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

const MAX_APPOINTMENTS_PER_DAY = 4;

function getMonday(date: Date): Date {
	const result = new Date(date);
	const day = result.getUTCDay();
	const diff = day === 0 ? -6 : 1 - day;

	result.setUTCDate(result.getUTCDate() + diff);
	result.setUTCHours(0, 0, 0, 0);

	return result;
}

function addDays(date: Date, days: number): Date {
	const result = new Date(date);
	result.setUTCDate(result.getUTCDate() + days);

	return result;
}

function toInputDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}

function parseWeekParam(week: string | null): Date {
	if (!week) {
		return new Date();
	}

	const parsedDate = new Date(`${week}T12:00:00.000Z`);

	if (Number.isNaN(parsedDate.getTime())) {
		return new Date();
	}

	return parsedDate;
}

export const load: PageServerLoad = async ({ url }) => {
	const weekParam = url.searchParams.get('week');
	const statusParam = url.searchParams.get('status')?.trim() ?? '';

	const selectedDate = parseWeekParam(weekParam);
	const startOfWeek = getMonday(selectedDate);
	const endOfWeek = addDays(startOfWeek, 6);

	const validStatuses = Object.values(AppointmentStatus);
	const selectedStatus = validStatuses.includes(statusParam as AppointmentStatus)
		? (statusParam as AppointmentStatus)
		: '';

	const appointments = await prisma.appointment.findMany({
		where: {
			date: {
				gte: startOfWeek,
				lt: endOfWeek
			},
			...(selectedStatus
				? {
						status: selectedStatus
					}
				: {})
		},
		include: {
			client: true,
			attachments: true
		},
		orderBy: [
			{
				date: 'asc'
			},
			{
				time: 'asc'
			}
		]
	});

	const weekDays = Array.from({ length: 6 }, (_, index) => {
		const date = addDays(startOfWeek, index);

		const dayAppointments = appointments.filter((appointment) => {
			return toInputDate(appointment.date) === toInputDate(date);
		});

		return {
			date,
			dateKey: toInputDate(date),
			appointments: dayAppointments,
			totalAppointments: dayAppointments.length,
			availableSlots: Math.max(0, MAX_APPOINTMENTS_PER_DAY - dayAppointments.length),
			isFull: dayAppointments.length >= MAX_APPOINTMENTS_PER_DAY
		};
	});

	const previousWeek = toInputDate(addDays(startOfWeek, -7));
	const nextWeek = toInputDate(addDays(startOfWeek, 7));
	const currentWeek = toInputDate(getMonday(new Date()));

	return {
		appointments,
		weekDays,
		selectedStatus,
		week: {
			start: startOfWeek,
			end: addDays(startOfWeek, 5),
			previousWeek,
			nextWeek,
			currentWeek
		},
		maxAppointmentsPerDay: MAX_APPOINTMENTS_PER_DAY
	};
};