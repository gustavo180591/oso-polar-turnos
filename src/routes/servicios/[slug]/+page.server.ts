import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { publicServices } from '$lib/services/public-services';

export async function load({ params }) {
	const service = publicServices.find((item) => item.slug === params.slug);

	if (!service) {
		throw error(404, 'Servicio no encontrado');
	}

	const images = await prisma.publicServiceImage.findMany({
		where: {
			slug: service.slug
		},
		orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
		select: {
			id: true,
			imageUrl: true,
			fileName: true
		}
	});

	return {
		service: {
			...service,
			galleryImages: images.map((image) => ({
				id: image.id,
				src: image.imageUrl,
				alt: image.fileName ?? service.title
			}))
		},
		relatedServices: publicServices.filter((item) => item.slug !== service.slug).slice(0, 3)
	};
}
