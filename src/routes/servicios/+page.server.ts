import { prisma } from '$lib/server/prisma';
import { publicServices } from '$lib/services/public-services';

export async function load() {
	const images = await prisma.publicServiceImage.findMany({
		orderBy: [{ slug: 'asc' }, { position: 'asc' }, { createdAt: 'asc' }],
		select: {
			slug: true,
			imageUrl: true
		}
	});

	const imagesBySlug = new Map<string, string[]>();

	for (const image of images) {
		const currentImages = imagesBySlug.get(image.slug) ?? [];
		currentImages.push(image.imageUrl);
		imagesBySlug.set(image.slug, currentImages);
	}

	return {
		services: publicServices.map((service) => {
			const galleryImages = imagesBySlug.get(service.slug) ?? [];

			return {
				...service,
				mainImageUrl: galleryImages[0] ?? '/brand/logo-horizontal.jpeg',
				galleryImages
			};
		})
	};
}
