import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const appointments = await prisma.appointment.findMany({
		include: {
			client: true,
			attachments: true
		},
		orderBy: [{ date: 'asc' }, { time: 'asc' }]
	});

	return {
		appointments
	};
};

async function getAppointmentId(request: Request): Promise<string | null> {
	const formData = await request.formData();
	const appointmentId = String(formData.get('appointmentId') ?? '').trim();

	return appointmentId || null;
}

export const actions: Actions = {
	confirm: async ({ request }) => {
		const appointmentId = await getAppointmentId(request);

		if (!appointmentId) {
			return fail(400, {
				message: 'No se recibió el identificador del turno.'
			});
		}

		const appointment = await prisma.appointment.findUnique({
			where: { id: appointmentId }
		});

		if (!appointment) {
			return fail(404, {
				message: 'El turno no existe.'
			});
		}

		if (appointment.status === 'FINALIZADO') {
			return fail(400, {
				message: 'No se puede confirmar un turno finalizado.'
			});
		}

		if (appointment.status === 'CANCELADO') {
			return fail(400, {
				message: 'No se puede confirmar un turno cancelado.'
			});
		}

		await prisma.appointment.update({
			where: { id: appointmentId },
			data: {
				status: 'CONFIRMADO',
				cancelledAt: null,
				cancellationReason: null
			}
		});

		return {
			success: true,
			message: 'Turno confirmado correctamente.'
		};
	},

	finalize: async ({ request }) => {
		const appointmentId = await getAppointmentId(request);

		if (!appointmentId) {
			return fail(400, {
				message: 'No se recibió el identificador del turno.'
			});
		}

		const appointment = await prisma.appointment.findUnique({
			where: { id: appointmentId }
		});

		if (!appointment) {
			return fail(404, {
				message: 'El turno no existe.'
			});
		}

		if (appointment.status === 'CANCELADO') {
			return fail(400, {
				message: 'No se puede finalizar un turno cancelado.'
			});
		}

		await prisma.appointment.update({
			where: { id: appointmentId },
			data: {
				status: 'FINALIZADO',
				finalizedAt: new Date()
			}
		});

		return {
			success: true,
			message: 'Turno finalizado correctamente.'
		};
	},

	cancel: async ({ request }) => {
		const appointmentId = await getAppointmentId(request);

		if (!appointmentId) {
			return fail(400, {
				message: 'No se recibió el identificador del turno.'
			});
		}

		const appointment = await prisma.appointment.findUnique({
			where: { id: appointmentId }
		});

		if (!appointment) {
			return fail(404, {
				message: 'El turno no existe.'
			});
		}

		if (appointment.status === 'FINALIZADO') {
			return fail(400, {
				message: 'No se puede cancelar un turno finalizado.'
			});
		}

		await prisma.appointment.update({
			where: { id: appointmentId },
			data: {
				status: 'CANCELADO',
				cancelledAt: new Date()
			}
		});

		return {
			success: true,
			message: 'Turno cancelado correctamente.'
		};
	}
};