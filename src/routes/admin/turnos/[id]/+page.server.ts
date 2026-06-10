import { error, fail } from '@sveltejs/kit';
import { PaymentMethod } from '@prisma/client';
import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const appointment = await prisma.appointment.findUnique({
		where: {
			id: params.id
		},
		include: {
			client: true,
			equipment: true,
			attachments: true,
			createdBy: {
				select: {
					id: true,
					name: true,
					email: true
				}
			}
		}
	});

	if (!appointment) {
		throw error(404, 'Turno no encontrado.');
	}

	return {
		appointment
	};
};

export const actions: Actions = {
	updateDetails: async ({ request, params }) => {
		const appointment = await prisma.appointment.findUnique({
			where: {
				id: params.id
			}
		});

		if (!appointment) {
			return fail(404, {
				success: false,
				message: 'El turno no existe.'
			});
		}

		const formData = await request.formData();

		const technicianNotes = String(formData.get('technicianNotes') ?? '').trim();
		const finalPriceValue = String(formData.get('finalPrice') ?? '').trim();
		const paymentMethodValue = String(formData.get('paymentMethod') ?? '').trim();
		const paid = formData.get('paid') === 'on';

		let finalPrice: number | null = null;

		if (finalPriceValue) {
			finalPrice = Number(finalPriceValue);

			if (!Number.isInteger(finalPrice) || finalPrice < 0) {
				return fail(400, {
					success: false,
					message: 'El precio final debe ser un número entero mayor o igual a cero.'
				});
			}
		}

		let paymentMethod: PaymentMethod | null = null;

		if (paymentMethodValue) {
			const validPaymentMethods = Object.values(PaymentMethod);

			if (!validPaymentMethods.includes(paymentMethodValue as PaymentMethod)) {
				return fail(400, {
					success: false,
					message: 'El medio de pago seleccionado no es válido.'
				});
			}

			paymentMethod = paymentMethodValue as PaymentMethod;
		}

		if (paymentMethod && finalPrice === null) {
			return fail(400, {
				success: false,
				message: 'Debés ingresar el precio final antes de seleccionar un medio de pago.'
			});
		}

		if (paid && finalPrice === null) {
			return fail(400, {
				success: false,
				message: 'No se puede marcar el trabajo como pagado sin ingresar el precio final.'
			});
		}

		await prisma.appointment.update({
			where: {
				id: params.id
			},
			data: {
				technicianNotes: technicianNotes || null,
				finalPrice,
				paymentMethod,
				paid
			}
		});

		return {
			success: true,
			message: 'La información del turno se actualizó correctamente.'
		};
	}
};