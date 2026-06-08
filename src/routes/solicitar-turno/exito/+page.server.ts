import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function load({ url }) {
	const id = url.searchParams.get('id');

	if (!id) {
		throw error(404, 'Turno no encontrado');
	}

	const appointment = await prisma.appointment.findUnique({
		where: { id },
		include: {
			client: true
		}
	});

	if (!appointment) {
		throw error(404, 'Turno no encontrado');
	}

	return {
		appointment
	};
}