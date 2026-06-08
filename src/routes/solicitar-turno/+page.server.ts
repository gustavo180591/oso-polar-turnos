import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const fullName = String(formData.get('fullName') || '').trim();
		const phone = String(formData.get('phone') || '').trim();
		const address = String(formData.get('address') || '').trim();
		const neighborhood = String(formData.get('neighborhood') || '').trim();
		const equipmentType = String(formData.get('equipmentType') || '').trim();
		const visitReason = String(formData.get('visitReason') || '').trim();
		const problemDescription = String(formData.get('problemDescription') || '').trim();
		const date = String(formData.get('date') || '').trim();
		const time = String(formData.get('time') || '').trim();
		const acceptedWaitingFee = formData.get('acceptedWaitingFee') === 'on';

		if (!fullName || !phone || !address || !equipmentType || !visitReason || !problemDescription || !date || !time) {
			return fail(400, {
				message: 'Completá todos los campos obligatorios.',
				values: {
					fullName,
					phone,
					address,
					neighborhood,
					equipmentType,
					visitReason,
					problemDescription,
					date,
					time
				}
			});
		}

		if (!acceptedWaitingFee) {
			return fail(400, {
				message: 'Debés aceptar el aviso sobre la espera o cancelación sin aviso previo.',
				values: {
					fullName,
					phone,
					address,
					neighborhood,
					equipmentType,
					visitReason,
					problemDescription,
					date,
					time
				}
			});
		}

		const appointmentDate = new Date(`${date}T00:00:00`);

		const existingAppointment = await prisma.appointment.findFirst({
			where: {
				date: appointmentDate,
				time,
				status: {
					in: ['PENDIENTE', 'CONFIRMADO']
				}
			}
		});

		if (existingAppointment) {
			return fail(400, {
				message: 'Ese horario ya fue solicitado. Elegí otro horario disponible.',
				values: {
					fullName,
					phone,
					address,
					neighborhood,
					equipmentType,
					visitReason,
					problemDescription,
					date,
					time
				}
			});
		}

		const client = await prisma.client.upsert({
			where: {
				phone
			},
			update: {
				fullName,
				address,
				neighborhood: neighborhood || null
			},
			create: {
				fullName,
				phone,
				address,
				neighborhood: neighborhood || null
			}
		});

		const appointment = await prisma.appointment.create({
			data: {
				clientId: client.id,
				date: appointmentDate,
				time,
				status: 'PENDIENTE',
				equipmentType: equipmentType as 'AIRE_ACONDICIONADO' | 'HELADERA' | 'FREEZER' | 'OTRO',
				visitReason: visitReason as 'LIMPIEZA' | 'MANTENIMIENTO' | 'REPARACION' | 'OTRO',
				problemDescription,
				address,
				neighborhood: neighborhood || null,
				waitingFeeNotice: true,
				waitingFeeAmount: 30000
			}
		});

		throw redirect(303, `/solicitar-turno/exito?id=${appointment.id}`);
	}
};