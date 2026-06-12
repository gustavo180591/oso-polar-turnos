import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '$lib/server/prisma';

const SESSION_COOKIE_NAME = 'oso_polar_session';
const SESSION_DURATION_DAYS = 30;

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	role: string;
};

function getSessionExpirationDate() {
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

	return expiresAt;
}

export function getSessionCookieName() {
	return SESSION_COOKIE_NAME;
}

export function getSessionCookieOptions() {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * SESSION_DURATION_DAYS
	};
}

export async function verifyPassword(password: string, passwordHash: string) {
	return bcrypt.compare(password, passwordHash);
}

export async function createSession(userId: string) {
	const token = randomBytes(32).toString('hex');

	const session = await prisma.session.create({
		data: {
			userId,
			token,
			expiresAt: getSessionExpirationDate()
		}
	});

	return session;
}

export async function validateSession(token: string | undefined): Promise<AuthUser | null> {
	if (!token) {
		return null;
	}

	const session = await prisma.session.findUnique({
		where: {
			token
		},
		include: {
			user: true
		}
	});

	if (!session) {
		return null;
	}

	if (session.expiresAt < new Date()) {
		await prisma.session.delete({
			where: {
				id: session.id
			}
		});

		return null;
	}

	return {
		id: session.user.id,
		name: session.user.name,
		email: session.user.email,
		role: session.user.role
	};
}

export async function deleteSession(token: string | undefined) {
	if (!token) {
		return;
	}

	await prisma.session
		.delete({
			where: {
				token
			}
		})
		.catch(() => null);
}