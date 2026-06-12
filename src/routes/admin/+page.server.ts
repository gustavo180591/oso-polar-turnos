import { AppointmentStatus } from '@prisma/client';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

function startOfUtcDay(date: Date) {
	const result = new Date(date);
	result.setUTCHours(0, 0, 0, 0);

	return result;
}

function addDays(date: Date, days: number) {
	const result = new Date(date);
	result.setUTCDate(result.getUTCDate() + days);

	return result;
}

function startOfUtcMonth(date: Date) {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addMonths(date: Date, months: number) {
	const result = new Date(date);
	result.setUTCMonth(result.getUTCMonth() + months);

	return result;
}

export const load: PageServerLoad = async () => {
	const now = new Date();

	const todayStart = startOfUtcDay(now);
	const tomorrowStart = addDays(todayStart, 1);

	const monthStart = startOfUtcMonth(now);
	const nextMonthStart = addMonths(monthStart, 1);

	const [
		todayAppointments,
		pendingAppointmentsCount,
		confirmedAppointmentsCount,
		finalizedThisMonthCount,
		cancelledThisMonthCount,
		totalClientsCount,
		activeServicesCount,
		monthIncome,
		monthDebt,
		upcomingAppointments,
		recentAppointments
	] = await Promise.all([
		prisma.appointment.findMany({
			where: {
				date: {
					gte: todayStart,
					lt: tomorrowStart
				}
			},
			include: {
				client: true,
				attachments: true
			},
			orderBy: {
				time: 'asc'
			}
		}),

		prisma.appointment.count({
			where: {
				status: AppointmentStatus.PENDIENTE
			}
		}),

		prisma.appointment.count({
			where: {
				status: AppointmentStatus.CONFIRMADO
			}
		}),

		prisma.appointment.count({
			where: {
				status: AppointmentStatus.FINALIZADO,
				date: {
					gte: monthStart,
					lt: nextMonthStart
				}
			}
		}),

		prisma.appointment.count({
			where: {
				status: AppointmentStatus.CANCELADO,
				date: {
					gte: monthStart,
					lt: nextMonthStart
				}
			}
		}),

		prisma.client.count(),

		prisma.service.count({
			where: {
				isActive: true
			}
		}),

		prisma.appointment.aggregate({
			where: {
				paid: true,
				finalPrice: {
					not: null
				},
				date: {
					gte: monthStart,
					lt: nextMonthStart
				}
			},
			_sum: {
				finalPrice: true
			}
		}),

		prisma.appointment.aggregate({
			where: {
				paid: false,
				finalPrice: {
					not: null
				},
				date: {
					gte: monthStart,
					lt: nextMonthStart
				}
			},
			_sum: {
				finalPrice: true
			}
		}),

		prisma.appointment.findMany({
			where: {
				date: {
					gte: todayStart
				},
				status: {
					in: [AppointmentStatus.PENDIENTE, AppointmentStatus.CONFIRMADO]
				}
			},
			include: {
				client: true
			},
			orderBy: [
				{
					date: 'asc'
				},
				{
					time: 'asc'
				}
			],
			take: 5
		}),

		prisma.appointment.findMany({
			include: {
				client: true
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 5
		})
	]);

	return {
		todayAppointments,
		upcomingAppointments,
		recentAppointments,
		stats: {
			todayAppointmentsCount: todayAppointments.length,
			pendingAppointmentsCount,
			confirmedAppointmentsCount,
			finalizedThisMonthCount,
			cancelledThisMonthCount,
			totalClientsCount,
			activeServicesCount,
			monthIncome: monthIncome._sum.finalPrice ?? 0,
			monthDebt: monthDebt._sum.finalPrice ?? 0
		}
	};
};