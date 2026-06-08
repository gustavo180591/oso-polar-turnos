import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL no está definida en .env');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	await prisma.service.createMany({
		data: [
			{
				name: 'Limpieza de aire acondicionado',
				description: 'Limpieza general del equipo, filtros y revisión básica.',
				visitReason: 'LIMPIEZA',
				basePrice: null,
				estimatedDurationMinutes: 90,
				isActive: true
			},
			{
				name: 'Mantenimiento de aire acondicionado',
				description: 'Mantenimiento preventivo del equipo de aire acondicionado.',
				visitReason: 'MANTENIMIENTO',
				basePrice: null,
				estimatedDurationMinutes: 90,
				isActive: true
			},
			{
				name: 'Reparación de aire acondicionado',
				description: 'Diagnóstico y reparación de fallas en equipos de aire acondicionado.',
				visitReason: 'REPARACION',
				basePrice: null,
				estimatedDurationMinutes: 120,
				isActive: true
			},
			{
				name: 'Reparación de heladera',
				description: 'Diagnóstico y reparación de heladeras.',
				visitReason: 'REPARACION',
				basePrice: null,
				estimatedDurationMinutes: 120,
				isActive: true
			},
			{
				name: 'Reparación de freezer',
				description: 'Diagnóstico y reparación de freezers.',
				visitReason: 'REPARACION',
				basePrice: null,
				estimatedDurationMinutes: 120,
				isActive: true
			}
		],
		skipDuplicates: true
	});

	console.log('Seed ejecutado correctamente');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});