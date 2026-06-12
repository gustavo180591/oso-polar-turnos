import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

function toInputDate(date: Date) {
	return date.toISOString().slice(0, 10);
}

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

function endOfUtcMonth(date: Date) {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
}

function parseDateParam(value: string | null, fallback: Date) {
	if (!value) {
		return fallback;
	}

	const parsedDate = new Date(`${value}T12:00:00.000Z`);

	if (Number.isNaN(parsedDate.getTime())) {
		return fallback;
	}

	return parsedDate;
}

export const load: PageServerLoad = async ({ url }) => {
	const now = new Date();

	const defaultFrom = startOfUtcMonth(now);
	const defaultTo = endOfUtcMonth(now);

	const fromDate = parseDateParam(url.searchParams.get('from'), defaultFrom);
	const toDate = parseDateParam(url.searchParams.get('to'), defaultTo);

	const from = startOfUtcDay(fromDate);
	const to = addDays(startOfUtcDay(toDate), 1);

	const dateFilter = {
		gte: from,
		lt: to
	};

	const [
		totalAppointments,
		pendingAppointments,
		confirmedAppointments,
		finalizedAppointments,
		cancelledAppointments,
		paidIncome,
		pendingDebt,
		averageTicket,
		statusReport,
		reasonReport,
		equipmentReport,
		clientReport,
		recentFinalizedAppointments,
		pendingPaymentAppointments
	] = await Promise.all([
		prisma.appointment.count({
			where: {
				date: dateFilter
			}
		}),

		prisma.appointment.count({
			where: {
				date: dateFilter,
				status: 'PENDIENTE'
			}
		}),

		prisma.appointment.count({
			where: {
				date: dateFilter,
				status: 'CONFIRMADO'
			}
		}),

		prisma.appointment.count({
			where: {
				date: dateFilter,
				status: 'FINALIZADO'
			}
		}),

		prisma.appointment.count({
			where: {
				date: dateFilter,
				status: 'CANCELADO'
			}
		}),

		prisma.appointment.aggregate({
			where: {
				date: dateFilter,
				paid: true,
				finalPrice: {
					not: null
				}
			},
			_sum: {
				finalPrice: true
			}
		}),

		prisma.appointment.aggregate({
			where: {
				date: dateFilter,
				paid: false,
				finalPrice: {
					not: null
				}
			},
			_sum: {
				finalPrice: true
			}
		}),

		prisma.appointment.aggregate({
			where: {
				date: dateFilter,
				status: 'FINALIZADO',
				finalPrice: {
					not: null
				}
			},
			_avg: {
				finalPrice: true
			}
		}),

		prisma.appointment.groupBy({
			by: ['status'],
			where: {
				date: dateFilter
			},
			_count: {
				_all: true
			},
			orderBy: {
				_count: {
					status: 'desc'
				}
			}
		}),

		prisma.appointment.groupBy({
			by: ['visitReason'],
			where: {
				date: dateFilter
			},
			_count: {
				_all: true
			},
			orderBy: {
				_count: {
					visitReason: 'desc'
				}
			}
		}),

		prisma.appointment.groupBy({
			by: ['equipmentType'],
			where: {
				date: dateFilter
			},
			_count: {
				_all: true
			},
			orderBy: {
				_count: {
					equipmentType: 'desc'
				}
			}
		}),

		prisma.appointment.groupBy({
			by: ['clientId'],
			where: {
				date: dateFilter
			},
			_count: {
				_all: true
			},
			orderBy: {
				_count: {
					clientId: 'desc'
				}
			},
			take: 5
		}),

		prisma.appointment.findMany({
			where: {
				date: dateFilter,
				status: 'FINALIZADO'
			},
			include: {
				client: true
			},
			orderBy: [
				{
					date: 'desc'
				},
				{
					time: 'desc'
				}
			],
			take: 6
		}),

		prisma.appointment.findMany({
			where: {
				date: dateFilter,
				paid: false,
				finalPrice: {
					not: null
				}
			},
			include: {
				client: true
			},
			orderBy: [
				{
					date: 'desc'
				},
				{
					time: 'desc'
				}
			],
			take: 6
		})
	]);

	const clientIds = clientReport.map((item) => item.clientId);

	const clients = await prisma.client.findMany({
		where: {
			id: {
				in: clientIds
			}
		}
	});

	const topClients = clientReport.map((item) => {
		const client = clients.find((clientItem) => clientItem.id === item.clientId);

		return {
			clientId: item.clientId,
			fullName: client?.fullName ?? 'Cliente eliminado',
			phone: client?.phone ?? '',
			totalAppointments: item._count._all
		};
	});

	return {
		filters: {
			from: toInputDate(from),
			to: toInputDate(addDays(to, -1))
		},
		stats: {
			totalAppointments,
			pendingAppointments,
			confirmedAppointments,
			finalizedAppointments,
			cancelledAppointments,
			paidIncome: paidIncome._sum.finalPrice ?? 0,
			pendingDebt: pendingDebt._sum.finalPrice ?? 0,
			averageTicket: Math.round(averageTicket._avg.finalPrice ?? 0)
		},
		statusReport,
		reasonReport,
		equipmentReport,
		topClients,
		recentFinalizedAppointments,
		pendingPaymentAppointments
	};
};