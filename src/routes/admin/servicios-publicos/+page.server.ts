import { fail, redirect } from '@sveltejs/kit';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { prisma } from '$lib/server/prisma';
import { publicServices } from '$lib/services/public-services';

const allowedImageTypes: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp'
};

const maxImageSize = 5 * 1024 * 1024;
const maxFilesPerUpload = 8;

function isValidServiceSlug(slug: string) {
	return publicServices.some((service) => service.slug === slug);
}

async function removeLocalUpload(imageUrl: string) {
	if (!imageUrl.startsWith('/uploads/services/')) {
		return;
	}

	const relativePath = imageUrl.replace(/^\//, '');
	await unlink(join(process.cwd(), 'static', relativePath)).catch(() => undefined);
}

export async function load() {
	const images = await prisma.publicServiceImage.findMany({
		orderBy: [{ slug: 'asc' }, { position: 'asc' }, { createdAt: 'asc' }]
	});

	const imagesBySlug = new Map<string, typeof images>();

	for (const image of images) {
		const currentImages = imagesBySlug.get(image.slug) ?? [];
		currentImages.push(image);
		imagesBySlug.set(image.slug, currentImages);
	}

	return {
		services: publicServices.map((service) => ({
			slug: service.slug,
			shortTitle: service.shortTitle,
			title: service.title,
			summary: service.summary,
			images: imagesBySlug.get(service.slug) ?? []
		}))
	};
}

export const actions = {
	upload: async ({ request }) => {
		const formData = await request.formData();

		const slug = String(formData.get('slug') ?? '');
		const files = formData
			.getAll('images')
			.filter((file): file is File => typeof file !== 'string' && file.size > 0);

		if (!isValidServiceSlug(slug)) {
			return fail(400, { error: 'El servicio seleccionado no es válido.' });
		}

		if (files.length === 0) {
			return fail(400, { error: 'Tenés que seleccionar al menos una imagen.' });
		}

		if (files.length > maxFilesPerUpload) {
			return fail(400, { error: `Podés subir hasta ${maxFilesPerUpload} imágenes por vez.` });
		}

		for (const file of files) {
			if (file.size > maxImageSize) {
				return fail(400, { error: 'Cada imagen no puede superar los 5 MB.' });
			}

			if (!allowedImageTypes[file.type]) {
				return fail(400, { error: 'Formato no permitido. Usá JPG, PNG o WEBP.' });
			}
		}

		const uploadDir = join(process.cwd(), 'static', 'uploads', 'services');
		await mkdir(uploadDir, { recursive: true });

		const currentCount = await prisma.publicServiceImage.count({
			where: { slug }
		});

		for (const [index, file] of files.entries()) {
			const extension = allowedImageTypes[file.type];
			const newFileName = `${slug}-${randomUUID()}.${extension}`;
			const filePath = join(uploadDir, newFileName);
			const imageUrl = `/uploads/services/${newFileName}`;

			const buffer = Buffer.from(await file.arrayBuffer());
			await writeFile(filePath, buffer);

			await prisma.publicServiceImage.create({
				data: {
					slug,
					imageUrl,
					fileName: file.name,
					mimeType: file.type,
					size: file.size,
					position: currentCount + index
				}
			});
		}

		throw redirect(303, '/admin/servicios-publicos');
	},

	remove: async ({ request }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');

		const image = await prisma.publicServiceImage.findUnique({
			where: { id }
		});

		if (!image) {
			return fail(404, { error: 'La imagen no existe.' });
		}

		await removeLocalUpload(image.imageUrl);

		await prisma.publicServiceImage.delete({
			where: { id }
		});

		throw redirect(303, '/admin/servicios-publicos');
	}
};
