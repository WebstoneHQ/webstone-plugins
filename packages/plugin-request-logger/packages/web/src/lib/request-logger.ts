import type { Handle } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';

export const addRequestLogger = (async ({ event, resolve }) => {
	const request_id = randomUUID();

	const overwrite_methods = ['debug', 'error', 'info', 'log', 'warn'] as const;
	const overwrites = overwrite_methods.reduce((result, method) => {
		result[method] = (message, log_data = {}) => {
			console[method]({
				request_id,
				ts: Date.now(),
				message,
				...log_data
			});
		};
		return result;
	}, {} as Console);

	const logger = {
		...console,
		...overwrites
	};
	event.locals.logger = logger;

	const response = await resolve(event);
	return response;
}) satisfies Handle;

export const logRequestDetails = (async ({ event, resolve }) => {
	const timeStart = Date.now();
	event.locals.logger.log('Incoming request', {
		method: event.request.method,
		route: event.route.id,
		params: event.params,
		cookies: event.cookies.getAll()
	});

	const response = await resolve(event);
	event.locals.logger.log('Request processed', {
		duration_ms: Date.now() - timeStart
	});

	return response;
}) satisfies Handle;
