import { prisma } from '$lib/server/prisma';

export async function load() {
	const appointments = await prisma.appointment.findMany({
		include: {
			client: true,
			attachments: true
		},
		orderBy: [
			{
				date: 'asc'
			},
			{
				time: 'asc'
			}
		]
	});

	return {
		appointments
	};
}