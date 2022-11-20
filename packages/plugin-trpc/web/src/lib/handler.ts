import type { Handle } from '@sveltejs/kit';
import type { Dict } from '@trpc/server';
import { resolveHTTPResponse } from '@trpc/server/http';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTrpcHandler = (endpointURL: string, router: any): Handle => {
	const trpcHandler: Handle = async ({ event, resolve }) => {
		if (event.url.pathname.startsWith(endpointURL)) {
			const request = event.request as Request & {
				headers: Dict<string | string[]>;
			};

			const req = {
				method: request.method,
				headers: request.headers,
				query: event.url.searchParams,
				body: await request.text()
			};

			const httpResponse = await resolveHTTPResponse({
				router,
				req,
				path: event.url.pathname.substring(endpointURL.length + 1),
				createContext: async () => null
			});

			const { status, headers, body } = httpResponse as {
				status: number;
				headers: Record<string, string>;
				body: string;
			};

			return new Response(body, { status, headers });
		}

		return await resolve(event);
	};

	return trpcHandler;
};
