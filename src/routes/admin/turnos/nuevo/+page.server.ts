import { fail, redirect } from '@sveltejs/kit';
import { EquipmentType, VisitReason, AppointmentStatus } from '@prisma/client';
import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

const allowedTimes = new Set(['08:30', '10:00', '15:00', '16:30', '18:00']);

type FormValues = {
	fullName: string;
	phone: string;
	address: string;
	neighborhood: string;
	equipmentType: string;
	visitReason: string;
	problemDescription: string;
	date: string;
	time: string;
	status: string;
};

function normalizePhone(phone: string): string {
	return phone.replace(/[^\d+]/g, '');
}

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const values: FormValues = {
			fullName: String(formData.get('fullName') ?? '').trim(),
			phone: String(formData.get('phone') ?? '').trim(),
			address: String(formData.get('address') ?? '').trim(),
			neighborhood: String(formData.get('neighborhood') ?? '').trim(),
			equipmentType: String(formData.get('equipmentType') ?? '').trim(),
			visitReason: String(formData.get('visitReason') ?? '').trim(),
			problemDescription: String(formData.get('problemDescription') ?? '').trim(),
			date: String(formData.get('date') ?? '').trim(),
			time: String(formData.get('time') ?? '').trim(),
			status: String(formData.get('status') ?? 'PENDIENTE').trim()
		};

		if (
			!values.fullName ||
			!values.phone ||
			!values.address ||
			!values.equipmentType ||
			!values.visitReason ||
			!values.problemDescription ||
			!values.date ||
			!values.time ||
			!values.status
		) {
			return fail(400, {
				success: false,
				message: 'Completá todos los campos obligatorios.',
				values
			});
		}

		const normalizedPhone = normalizePhone(values.phone);

		if (normalizedPhone.length < 8) {
			return fail(400, {
				success: false,
				message: 'Ingresá un número de WhatsApp válido.',
				values
			});
		}

		if (!Object.values(EquipmentType).includes(values.equipmentType as EquipmentType)) {
			return fail(400, {
				success: false,
				message: 'El tipo de equipo seleccionado no es válido.',
				values
			});
		}

		if (!Object.values(VisitReason).includes(values.visitReason as VisitReason)) {
			return fail(400, {
				success: false,
				message: 'El motivo de la visita seleccionado no es válido.',
				values
			});
		}

		if (!Object.values(AppointmentStatus).includes(values.status as AppointmentStatus)) {
			return fail(400, {
				success: false,
				message: 'El estado seleccionado no es válido.',
				values
			});
		}

		if (values.status !== 'PENDIENTE' && values.status !== 'CONFIRMADO') {
			return fail(400, {
				success: false,
				message: 'Un turno nuevo solo puede crearse como pendiente o confirmado.',
				values
			});
		}

		if (!allowedTimes.has(values.time)) {
			return fail(400, {
				success: false,
				message: 'El horario seleccionado no es válido.',
				values
			});
		}

		const appointmentDate = new Date(`${values.date}T12:00:00.000Z`);

		if (Number.isNaN(appointmentDate.getTime())) {
			return fail(400, {
				success: false,
				message: 'La fecha seleccionada no es válida.',
				values
			});
		}

		const dayOfWeek = appointmentDate.getUTCDay();

		if (dayOfWeek === 0) {
			return fail(400, {
				success: false,
				message: 'No se atienden turnos los domingos.',
				values
			});
		}

		const today = new Date();
		today.setUTCHours(0, 0, 0, 0);

		const selectedDate = new Date(appointmentDate);
		selectedDate.setUTCHours(0, 0, 0, 0);

		if (selectedDate < today) {
			return fail(400, {
				success: false,
				message: 'No podés crear un turno para una fecha pasada.',
				values
			});
		}

		const existingAppointment = await prisma.appointment.findFirst({
			where: {
				date: appointmentDate,
				time: values.time,
				status: {
					in: ['PENDIENTE', 'CONFIRMADO']
				}
			},
			select: {
				id: true
			}
		});

		if (existingAppointment) {
			return fail(409, {
				success: false,
				message: 'Ese horario ya está ocupado. Elegí otro horario disponible.',
				values
			});
		}

		const appointmentsForDay = await prisma.appointment.count({
			where: {
				date: appointmentDate,
				status: {
					in: ['PENDIENTE', 'CONFIRMADO']
				}
			}
		});

		if (appointmentsForDay >= 4) {
			return fail(409, {
				success: false,
				message: 'Ya se alcanzó el máximo de cuatro turnos para ese día.',
				values
			});
		}

		try {
			const client = await prisma.client.upsert({
				where: {
					phone: normalizedPhone
				},
				update: {
					fullName: values.fullName,
					address: values.address,
					neighborhood: values.neighborhood || null,
					city: 'Posadas'
				},
				create: {
					fullName: values.fullName,
					phone: normalizedPhone,
					address: values.address,
					neighborhood: values.neighborhood || null,
					city: 'Posadas'
				}
			});

			const appointment = await prisma.appointment.create({
				data: {
					clientId: client.id,
					date: appointmentDate,
					time: values.time,
					status: values.status as AppointmentStatus,
					equipmentType: values.equipmentType as EquipmentType,
					visitReason: values.visitReason as VisitReason,
					problemDescription: values.problemDescription,
					address: values.address,
					neighborhood: values.neighborhood || null,
					city: 'Posadas',
					waitingFeeNotice: true,
					waitingFeeAmount: 30000
				}
			});

			throw redirect(303, `/admin/turnos/${appointment.id}`);
		} catch (error) {
			if (
				typeof error === 'object' &&
				error !== null &&
				'status' in error &&
				'location' in error
			) {
				throw error;
			}

			console.error('Error al crear turno desde admin:', error);

			return fail(500, {
				success: false,
				message: 'No se pudo crear el turno. Intentá nuevamente.',
				values
			});
		}
	}
};