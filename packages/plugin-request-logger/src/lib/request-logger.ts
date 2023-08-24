import type { Handle } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';

export interface RequestLogger extends Console {
	/**
	 * Overrides the Console's debug function.
	 * Logs a debug message with optional additional data.
	 *
	 * @param message - The debug message to log.
	 * @param log_data - Optional additional data to include in the log.
	 */
	debug(message: string, log_data?: Record<string, unknown>): void;

	/**
	 * Overrides the Console's error function.
	 * Logs an error message with optional additional data.
	 *
	 * @param message - The error message to log.
	 * @param log_data - Optional additional data to include in the log.
	 */
	error(message: string, log_data?: Record<string, unknown>): void;

	/**
	 * Overrides the Console's info function.
	 * Logs an info message with optional additional data.
	 *
	 * @param message - The info message to log.
	 * @param log_data - Optional additional data to include in the log.
	 */
	info(message: string, log_data?: Record<string, unknown>): void;

	/**
	 * Overrides the Console's log function.
	 * Logs a log message with optional additional data.
	 *
	 * @param message - The log message to log.
	 * @param log_data - Optional additional data to include in the log.
	 */
	log(message: string, log_data?: Record<string, unknown>): void;

	/**
	 * Overrides the Console's warn function.
	 * Logs a warning message with optional additional data.
	 *
	 * @param message - The warning message to log.
	 * @param log_data - Optional additional data to include in the log.
	 */
	warn(message: string, log_data?: Record<string, unknown>): void;
}

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

	const logger: RequestLogger = {
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
