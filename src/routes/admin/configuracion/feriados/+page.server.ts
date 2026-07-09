import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

function parseHolidayDate(dateValue: string) {
	const [year, month, day] = dateValue.split('-').map(Number);

	if (!year || !month || !day) {
		return null;
	}

	const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	return date;
}

export const load: PageServerLoad = async () => {
	const holidays = await prisma.holiday.findMany({
		orderBy: {
			date: 'asc'
		}
	});

	return {
		holidays
	};
};

export const actions: Actions = {
	createHoliday: async ({ request }) => {
		const formData = await request.formData();

		const dateValue = String(formData.get('date') ?? '').trim();
		const name = String(formData.get('name') ?? '').trim();
		const description = String(formData.get('description') ?? '').trim();

		if (!dateValue || !name) {
			return fail(400, {
				success: false,
				message: 'Completá la fecha y el nombre del feriado.'
			});
		}

		const date = parseHolidayDate(dateValue);

		if (!date) {
			return fail(400, {
				success: false,
				message: 'La fecha ingresada no es válida.'
			});
		}

		await prisma.holiday.upsert({
			where: {
				date
			},
			create: {
				date,
				name,
				description: description || null,
				isEnabled: true
			},
			update: {
				name,
				description: description || null,
				isEnabled: true
			}
		});

		return {
			success: true,
			message: 'Feriado guardado correctamente.'
		};
	},

	toggleHoliday: async ({ request }) => {
		const formData = await request.formData();
		const holidayId = String(formData.get('holidayId') ?? '').trim();

		if (!holidayId) {
			return fail(400, {
				success: false,
				message: 'No se recibió el identificador del feriado.'
			});
		}

		const holiday = await prisma.holiday.findUnique({
			where: {
				id: holidayId
			}
		});

		if (!holiday) {
			return fail(404, {
				success: false,
				message: 'El feriado no existe.'
			});
		}

		await prisma.holiday.update({
			where: {
				id: holidayId
			},
			data: {
				isEnabled: !holiday.isEnabled
			}
		});

		return {
			success: true,
			message: holiday.isEnabled
				? 'Feriado desactivado correctamente.'
				: 'Feriado activado correctamente.'
		};
	},

	deleteHoliday: async ({ request }) => {
		const formData = await request.formData();
		const holidayId = String(formData.get('holidayId') ?? '').trim();

		if (!holidayId) {
			return fail(400, {
				success: false,
				message: 'No se recibió el identificador del feriado.'
			});
		}

		await prisma.holiday.delete({
			where: {
				id: holidayId
			}
		});

		return {
			success: true,
			message: 'Feriado eliminado correctamente.'
		};
	}
};
