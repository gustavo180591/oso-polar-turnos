import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
	adapter
});

async function main() {
	const email = 'admin@osopolar.com';
	const password = 'admin123456';

	const passwordHash = await bcrypt.hash(password, 12);

	const user = await prisma.user.upsert({
		where: {
			email
		},
		update: {
			name: 'Administrador',
			passwordHash,
			role: 'ADMIN'
		},
		create: {
			name: 'Administrador',
			email,
			passwordHash,
			role: 'ADMIN'
		}
	});

	console.log('Administrador creado/actualizado:');
	console.log({
		id: user.id,
		email,
		password
	});
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});