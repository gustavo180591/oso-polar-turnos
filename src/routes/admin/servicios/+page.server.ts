import { fail } from '@sveltejs/kit';
import { VisitReason } from '@prisma/client';
import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

function getStringValue(formData: FormData, key: string) {
	return String(formData.get(key) ?? '').trim();
}

function getNullableStringValue(formData: FormData, key: string) {
	const value = getStringValue(formData, key);

	return value || null;
}

function parseOptionalPositiveInteger(value: string, fieldName: string) {
	if (!value) {
		return null;
	}

	const parsedValue = Number(value);

	if (!Number.isInteger(parsedValue) || parsedValue < 0) {
		throw new Error(`${fieldName} debe ser un número entero mayor o igual a cero.`);
	}

	return parsedValue;
}

function validateVisitReason(value: string) {
	const validReasons = Object.values(VisitReason);

	if (!validReasons.includes(value as VisitReason)) {
		throw new Error('El tipo de servicio seleccionado no es válido.');
	}

	return value as VisitReason;
}

export const load: PageServerLoad = async () => {
	const services = await prisma.service.findMany({
		orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }]
	});

	return { services };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const name = getStringValue(formData, 'name');
		const description = getNullableStringValue(formData, 'description');
		const visitReasonValue = getStringValue(formData, 'visitReason');
		const basePriceValue = getStringValue(formData, 'basePrice');
		const estimatedDurationValue = getStringValue(formData, 'estimatedDurationMinutes');

		if (!name) {
			return fail(400, {
				success: false,
				message: 'El nombre del servicio es obligatorio.'
			});
		}

		try {
			const visitReason = validateVisitReason(visitReasonValue);
			const basePrice = parseOptionalPositiveInteger(basePriceValue, 'El precio base');
			const estimatedDurationMinutes = parseOptionalPositiveInteger(
				estimatedDurationValue,
				'La duración estimada'
			);

			await prisma.service.create({
				data: {
					name,
					description,
					visitReason,
					basePrice,
					estimatedDurationMinutes,
					isActive: true
				}
			});

			return {
				success: true,
				message: 'Servicio creado correctamente.'
			};
		} catch (error) {
			return fail(400, {
				success: false,
				message: error instanceof Error ? error.message : 'No se pudo crear el servicio.'
			});
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();

		const serviceId = getStringValue(formData, 'serviceId');
		const name = getStringValue(formData, 'name');
		const description = getNullableStringValue(formData, 'description');
		const visitReasonValue = getStringValue(formData, 'visitReason');
		const basePriceValue = getStringValue(formData, 'basePrice');
		const estimatedDurationValue = getStringValue(formData, 'estimatedDurationMinutes');

		if (!serviceId) {
			return fail(400, {
				success: false,
				message: 'No se recibió el servicio a editar.'
			});
		}

		if (!name) {
			return fail(400, {
				success: false,
				message: 'El nombre del servicio es obligatorio.'
			});
		}

		try {
			const service = await prisma.service.findUnique({
				where: { id: serviceId }
			});

			if (!service) {
				return fail(404, {
					success: false,
					message: 'El servicio no existe.'
				});
			}

			const visitReason = validateVisitReason(visitReasonValue);
			const basePrice = parseOptionalPositiveInteger(basePriceValue, 'El precio base');
			const estimatedDurationMinutes = parseOptionalPositiveInteger(
				estimatedDurationValue,
				'La duración estimada'
			);

			await prisma.service.update({
				where: { id: serviceId },
				data: {
					name,
					description,
					visitReason,
					basePrice,
					estimatedDurationMinutes
				}
			});

			return {
				success: true,
				message: 'Servicio actualizado correctamente.'
			};
		} catch (error) {
			return fail(400, {
				success: false,
				message: error instanceof Error ? error.message : 'No se pudo actualizar el servicio.'
			});
		}
	},

	toggleActive: async ({ request }) => {
		const formData = await request.formData();

		const serviceId = getStringValue(formData, 'serviceId');

		if (!serviceId) {
			return fail(400, {
				success: false,
				message: 'No se recibió el servicio.'
			});
		}

		const service = await prisma.service.findUnique({
			where: { id: serviceId }
		});

		if (!service) {
			return fail(404, {
				success: false,
				message: 'El servicio no existe.'
			});
		}

		await prisma.service.update({
			where: { id: serviceId },
			data: {
				isActive: !service.isActive
			}
		});

		return {
			success: true,
			message: service.isActive ? 'Servicio desactivado.' : 'Servicio activado.'
		};
	}
};