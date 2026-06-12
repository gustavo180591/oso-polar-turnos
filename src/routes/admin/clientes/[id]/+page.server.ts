import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const client = await prisma.client.findUnique({
		where: {
			id: params.id
		},
		include: {
			equipments: {
				orderBy: {
					createdAt: 'desc'
				}
			},
			appointments: {
				include: {
					attachments: true,
					equipment: true
				},
				orderBy: [
					{
						date: 'desc'
					},
					{
						time: 'desc'
					}
				]
			}
		}
	});

	if (!client) {
		throw error(404, 'Cliente no encontrado.');
	}

	const totalAppointments = client.appointments.length;

	const completedAppointments = client.appointments.filter(
		(appointment) => appointment.status === 'FINALIZADO'
	).length;

	const pendingAppointments = client.appointments.filter(
		(appointment) => appointment.status === 'PENDIENTE'
	).length;

	const confirmedAppointments = client.appointments.filter(
		(appointment) => appointment.status === 'CONFIRMADO'
	).length;

	const cancelledAppointments = client.appointments.filter(
		(appointment) => appointment.status === 'CANCELADO'
	).length;

	const totalPaid = client.appointments
		.filter((appointment) => appointment.paid && appointment.finalPrice !== null)
		.reduce((total, appointment) => total + (appointment.finalPrice ?? 0), 0);

	const totalDebt = client.appointments
		.filter((appointment) => !appointment.paid && appointment.finalPrice !== null)
		.reduce((total, appointment) => total + (appointment.finalPrice ?? 0), 0);

	return {
		client,
		stats: {
			totalAppointments,
			completedAppointments,
			pendingAppointments,
			confirmedAppointments,
			cancelledAppointments,
			totalPaid,
			totalDebt
		}
	};
};