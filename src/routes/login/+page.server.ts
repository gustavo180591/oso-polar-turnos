import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import {
	createSession,
	getSessionCookieName,
	getSessionCookieOptions,
	verifyPassword
} from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	return {
		redirectTo: url.searchParams.get('redirectTo') ?? '/admin'
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();

		const email = String(formData.get('email') ?? '').trim().toLowerCase();
		const password = String(formData.get('password') ?? '');
		const redirectTo = String(
			formData.get('redirectTo') ?? url.searchParams.get('redirectTo') ?? '/admin'
		);

		if (!email || !password) {
			return fail(400, {
				success: false,
				message: 'Ingresá email y contraseña.',
				email,
				redirectTo
			});
		}

		const user = await prisma.user.findUnique({
			where: {
				email
			}
		});

		if (!user) {
			return fail(400, {
				success: false,
				message: 'Email o contraseña incorrectos.',
				email,
				redirectTo
			});
		}

		const isValidPassword = await verifyPassword(password, user.passwordHash);

		if (!isValidPassword) {
			return fail(400, {
				success: false,
				message: 'Email o contraseña incorrectos.',
				email,
				redirectTo
			});
		}

		const session = await createSession(user.id);

		cookies.set(getSessionCookieName(), session.token, getSessionCookieOptions());

		throw redirect(303, redirectTo.startsWith('/') ? redirectTo : '/admin');
	}
};