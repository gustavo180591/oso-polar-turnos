import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';

const defaultSchedules = [
	{
		dayOfWeek: 1,
		dayName: 'Lunes',
		isEnabled: true,
		morningStart: '08:30',
		morningEnd: '12:00',
		afternoonStart: '15:00',
		afternoonEnd: '20:00',
		maxAppointments: 4
	},
	{
		dayOfWeek: 2,
		dayName: 'Martes',
		isEnabled: true,
		morningStart: '08:30',
		morningEnd: '12:00',
		afternoonStart: '15:00',
		afternoonEnd: '20:00',
		maxAppointments: 4
	},
	{
		dayOfWeek: 3,
		dayName: 'Miércoles',
		isEnabled: true,
		morningStart: '08:30',
		morningEnd: '12:00',
		afternoonStart: '15:00',
		afternoonEnd: '20:00',
		maxAppointments: 4
	},
	{
		dayOfWeek: 4,
		dayName: 'Jueves',
		isEnabled: true,
		morningStart: '08:30',
		morningEnd: '12:00',
		afternoonStart: '15:00',
		afternoonEnd: '20:00',
		maxAppointments: 4
	},
	{
		dayOfWeek: 5,
		dayName: 'Viernes',
		isEnabled: true,
		morningStart: '08:30',
		morningEnd: '12:00',
		afternoonStart: '15:00',
		afternoonEnd: '20:00',
		maxAppointments: 4
	},
	{
		dayOfWeek: 6,
		dayName: 'Sábado',
		isEnabled: true,
		morningStart: '08:30',
		morningEnd: '12:00',
		afternoonStart: '15:00',
		afternoonEnd: '20:00',
		maxAppointments: 4
	},
	{
		dayOfWeek: 0,
		dayName: 'Domingo',
		isEnabled: false,
		morningStart: null,
		morningEnd: null,
		afternoonStart: null,
		afternoonEnd: null,
		maxAppointments: 0
	}
];

async function ensureDefaultSchedules() {
	for (const schedule of defaultSchedules) {
		await prisma.businessSchedule.upsert({
			where: {
				dayOfWeek: schedule.dayOfWeek
			},
			create: schedule,
			update: {}
		});
	}
}

function normalizeTime(value: FormDataEntryValue | null) {
	const time = String(value ?? '').trim();

	return time || null;
}

export const load: PageServerLoad = async () => {
	await ensureDefaultSchedules();

	const schedules = await prisma.businessSchedule.findMany({
		orderBy: {
			dayOfWeek: 'asc'
		}
	});

	const orderedSchedules = [
		...schedules.filter((schedule) => schedule.dayOfWeek >= 1),
		...schedules.filter((schedule) => schedule.dayOfWeek === 0)
	];

	return {
		schedules: orderedSchedules
	};
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();

		await ensureDefaultSchedules();

		for (const schedule of defaultSchedules) {
			const dayOfWeek = schedule.dayOfWeek;
			const isEnabled = formData.get(`enabled-${dayOfWeek}`) === 'on';
			const maxAppointments = Number(formData.get(`maxAppointments-${dayOfWeek}`) ?? 0);

			if (isEnabled && (!maxAppointments || maxAppointments < 1)) {
				return fail(400, {
					message: `El día ${schedule.dayName} debe tener al menos 1 turno disponible.`
				});
			}

			await prisma.businessSchedule.update({
				where: {
					dayOfWeek
				},
				data: {
					isEnabled,
					morningStart: isEnabled ? normalizeTime(formData.get(`morningStart-${dayOfWeek}`)) : null,
					morningEnd: isEnabled ? normalizeTime(formData.get(`morningEnd-${dayOfWeek}`)) : null,
					afternoonStart: isEnabled ? normalizeTime(formData.get(`afternoonStart-${dayOfWeek}`)) : null,
					afternoonEnd: isEnabled ? normalizeTime(formData.get(`afternoonEnd-${dayOfWeek}`)) : null,
					maxAppointments: isEnabled ? maxAppointments : 0
				}
			});
		}

		return {
			success: true,
			message: 'Configuración guardada correctamente.'
		};
	}
};
