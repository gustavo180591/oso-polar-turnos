import { redirect, type Handle } from '@sveltejs/kit';
import { getSessionCookieName, validateSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(getSessionCookieName());
	const user = await validateSession(sessionToken);

	event.locals.user = user;

	const isAdminRoute = event.url.pathname.startsWith('/admin');
	const isLoginRoute = event.url.pathname === '/login';

	if (isAdminRoute && !user) {
		const redirectTo = `${event.url.pathname}${event.url.search}`;

		throw redirect(303, `/login?redirectTo=${encodeURIComponent(redirectTo)}`);
	}

	if (isLoginRoute && user) {
		throw redirect(303, '/admin');
	}

	return resolve(event);
};