import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fail, redirect } from '@sveltejs/kit';
import {
	AttachmentType,
	EquipmentType,
	VisitReason
} from '@prisma/client';
import { prisma } from '$lib/server/prisma';
import type { Actions } from './$types';

const MAX_FILES = 3;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 20 * 1024 * 1024;

const allowedImageTypes = new Set([
	'image/jpeg',
	'image/png',
	'image/webp'
]);

const allowedVideoTypes = new Set([
	'video/mp4',
	'video/webm'
]);

const allowedTimes = new Set([
	'08:30',
	'10:00',
	'15:00',
	'16:30',
	'18:00'
]);

type FormValues = {
	fullName: string;
	phone: string;
	address: string;
	neighborhood: string;
	equipmentType: string;
	visitReason: string;
	problemDescription: string;
	date: string;
	time: string;
};

type StoredAttachment = {
	type: AttachmentType;
	url: string;
	fileName: string;
	mimeType: string;
	size: number;
	absolutePath: string;
};

function getExtension(file: File): string {
	const extensionsByMimeType: Record<string, string> = {
		'image/jpeg': '.jpg',
		'image/png': '.png',
		'image/webp': '.webp',
		'video/mp4': '.mp4',
		'video/webm': '.webm'
	};

	return extensionsByMimeType[file.type] ?? extname(file.name).toLowerCase();
}

function normalizePhone(phone: string): string {
	return phone.replace(/[^\d+]/g, '');
}

function validateFiles(files: File[]): string | null {
	if (files.length > MAX_FILES) {
		return `Podés adjuntar como máximo ${MAX_FILES} archivos.`;
	}

	for (const file of files) {
		const isImage = allowedImageTypes.has(file.type);
		const isVideo = allowedVideoTypes.has(file.type);

		if (!isImage && !isVideo) {
			return `El archivo "${file.name}" tiene un formato no permitido.`;
		}

		if (isImage && file.size > MAX_IMAGE_SIZE) {
			return `La imagen "${file.name}" supera el límite de 5 MB.`;
		}

		if (isVideo && file.size > MAX_VIDEO_SIZE) {
			return `El video "${file.name}" supera el límite de 20 MB.`;
		}
	}

	return null;
}

async function saveFiles(files: File[]): Promise<StoredAttachment[]> {
	const uploadDirectory = join(process.cwd(), 'static', 'uploads');

	await mkdir(uploadDirectory, {
		recursive: true
	});

	const storedFiles: StoredAttachment[] = [];

	for (const file of files) {
		const extension = getExtension(file);
		const generatedFileName = `${randomUUID()}${extension}`;
		const absolutePath = join(uploadDirectory, generatedFileName);
		const buffer = Buffer.from(await file.arrayBuffer());

		await writeFile(absolutePath, buffer);

		storedFiles.push({
			type: allowedImageTypes.has(file.type)
				? AttachmentType.FOTO
				: AttachmentType.VIDEO,
			url: `/uploads/${generatedFileName}`,
			fileName: file.name,
			mimeType: file.type,
			size: file.size,
			absolutePath
		});
	}

	return storedFiles;
}

async function deleteStoredFiles(files: StoredAttachment[]): Promise<void> {
	await Promise.allSettled(
		files.map((file) => unlink(file.absolutePath))
	);
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const values: FormValues = {
			fullName: String(formData.get('fullName') ?? '').trim(),
			phone: String(formData.get('phone') ?? '').trim(),
			address: String(formData.get('address') ?? '').trim(),
			neighborhood: String(formData.get('neighborhood') ?? '').trim(),
			equipmentType: String(formData.get('equipmentType') ?? '').trim(),
			visitReason: String(formData.get('visitReason') ?? '').trim(),
			problemDescription: String(
				formData.get('problemDescription') ?? ''
			).trim(),
			date: String(formData.get('date') ?? '').trim(),
			time: String(formData.get('time') ?? '').trim()
		};

		const acceptedWaitingFee =
			formData.get('acceptedWaitingFee') === 'on';

		const files = formData
			.getAll('attachments')
			.filter(
				(value): value is File =>
					value instanceof File && value.size > 0
			);

		if (
			!values.fullName ||
			!values.phone ||
			!values.address ||
			!values.equipmentType ||
			!values.visitReason ||
			!values.problemDescription ||
			!values.date ||
			!values.time
		) {
			return fail(400, {
				success: false,
				message: 'Completá todos los campos obligatorios.',
				values
			});
		}

		const normalizedPhone = normalizePhone(values.phone);

		if (normalizedPhone.length < 8) {
			return fail(400, {
				success: false,
				message: 'Ingresá un número de WhatsApp válido.',
				values
			});
		}

		if (
			!Object.values(EquipmentType).includes(
				values.equipmentType as EquipmentType
			)
		) {
			return fail(400, {
				success: false,
				message: 'El tipo de equipo seleccionado no es válido.',
				values
			});
		}

		if (
			!Object.values(VisitReason).includes(
				values.visitReason as VisitReason
			)
		) {
			return fail(400, {
				success: false,
				message: 'El motivo de la visita seleccionado no es válido.',
				values
			});
		}

		if (!allowedTimes.has(values.time)) {
			return fail(400, {
				success: false,
				message: 'El horario seleccionado no es válido.',
				values
			});
		}

		if (!acceptedWaitingFee) {
			return fail(400, {
				success: false,
				message:
					'Debés aceptar el aviso sobre la espera o cancelación sin aviso previo.',
				values
			});
		}

		const fileError = validateFiles(files);

		if (fileError) {
			return fail(400, {
				success: false,
				message: fileError,
				values
			});
		}

		/*
		 * Se guarda al mediodía UTC para evitar que al mostrar la fecha
		 * en Argentina aparezca el día anterior por diferencia horaria.
		 */
		const appointmentDate = new Date(
			`${values.date}T12:00:00.000Z`
		);

		if (Number.isNaN(appointmentDate.getTime())) {
			return fail(400, {
				success: false,
				message: 'La fecha seleccionada no es válida.',
				values
			});
		}

		const dayOfWeek = appointmentDate.getUTCDay();

		if (dayOfWeek === 0) {
			return fail(400, {
				success: false,
				message: 'No se atienden turnos los domingos.',
				values
			});
		}

		const today = new Date();
		today.setUTCHours(0, 0, 0, 0);

		const selectedDate = new Date(appointmentDate);
		selectedDate.setUTCHours(0, 0, 0, 0);

		if (selectedDate < today) {
			return fail(400, {
				success: false,
				message: 'No podés solicitar un turno para una fecha pasada.',
				values
			});
		}

		const existingAppointment = await prisma.appointment.findFirst({
			where: {
				date: appointmentDate,
				time: values.time,
				status: {
					in: ['PENDIENTE', 'CONFIRMADO']
				}
			},
			select: {
				id: true
			}
		});

		if (existingAppointment) {
			return fail(409, {
				success: false,
				message:
					'Ese horario ya está ocupado. Elegí otro horario disponible.',
				values
			});
		}

		const appointmentsForDay = await prisma.appointment.count({
			where: {
				date: appointmentDate,
				status: {
					in: ['PENDIENTE', 'CONFIRMADO']
				}
			}
		});

		if (appointmentsForDay >= 4) {
			return fail(409, {
				success: false,
				message:
					'Ya se alcanzó el máximo de cuatro turnos para ese día.',
				values
			});
		}

		let storedFiles: StoredAttachment[] = [];

		try {
			storedFiles = await saveFiles(files);

			const client = await prisma.client.upsert({
				where: {
					phone: normalizedPhone
				},
				update: {
					fullName: values.fullName,
					address: values.address,
					neighborhood: values.neighborhood || null,
					city: 'Posadas'
				},
				create: {
					fullName: values.fullName,
					phone: normalizedPhone,
					address: values.address,
					neighborhood: values.neighborhood || null,
					city: 'Posadas'
				}
			});

			const appointment = await prisma.appointment.create({
				data: {
					clientId: client.id,
					date: appointmentDate,
					time: values.time,
					status: 'PENDIENTE',
					equipmentType:
						values.equipmentType as EquipmentType,
					visitReason: values.visitReason as VisitReason,
					problemDescription: values.problemDescription,
					address: values.address,
					neighborhood: values.neighborhood || null,
					city: 'Posadas',
					waitingFeeNotice: true,
					waitingFeeAmount: 30000,

					attachments:
						storedFiles.length > 0
							? {
									create: storedFiles.map((file) => ({
										type: file.type,
										url: file.url,
										fileName: file.fileName,
										mimeType: file.mimeType,
										size: file.size
									}))
								}
							: undefined
				}
			});

			throw redirect(
				303,
				`/solicitar-turno/exito?id=${appointment.id}`
			);
		} catch (error) {
			/*
			 * Los redirects de SvelteKit son excepciones internas.
			 * No debemos borrar los archivos cuando el turno fue creado
			 * correctamente y únicamente se está redirigiendo.
			 */
			if (
				typeof error === 'object' &&
				error !== null &&
				'status' in error &&
				'location' in error
			) {
				throw error;
			}

			await deleteStoredFiles(storedFiles);

			console.error('Error al crear el turno:', error);

			return fail(500, {
				success: false,
				message:
					'No se pudo registrar el turno. Intentá nuevamente.',
				values
			});
		}
	}
};