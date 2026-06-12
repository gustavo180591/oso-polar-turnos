import { redirect, type RequestHandler } from '@sveltejs/kit';
import { deleteSession, getSessionCookieName } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get(getSessionCookieName());

	await deleteSession(token);

	cookies.delete(getSessionCookieName(), {
		path: '/'
	});

	throw redirect(303, '/login');
};