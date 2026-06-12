import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search')?.trim() ?? '';

	const clients = await prisma.client.findMany({
		where: search
			? {
					OR: [
						{
							fullName: {
								contains: search,
								mode: 'insensitive'
							}
						},
						{
							phone: {
								contains: search
							}
						},
						{
							address: {
								contains: search,
								mode: 'insensitive'
							}
						},
						{
							neighborhood: {
								contains: search,
								mode: 'insensitive'
							}
						}
					]
				}
			: undefined,
		include: {
			_count: {
				select: {
					appointments: true,
					equipments: true
				}
			},
			appointments: {
				orderBy: {
					date: 'desc'
				},
				take: 1,
				select: {
					id: true,
					date: true,
					time: true,
					status: true,
					equipmentType: true,
					visitReason: true
				}
			}
		},
		orderBy: {
			updatedAt: 'desc'
		}
	});

	return {
		clients,
		search
	};
};