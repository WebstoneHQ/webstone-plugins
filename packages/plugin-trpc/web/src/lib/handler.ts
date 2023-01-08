import type { Handle, RequestEvent } from '@sveltejs/kit';
import type {
	AnyRouter,
	Dict,
	inferRouterContext,
	inferRouterError,
	TRPCError
} from '@trpc/server';
import type { HTTPRequest } from '@trpc/server/dist/http/internals/types';
import { resolveHTTPResponse, type ResponseMeta } from '@trpc/server/http';
import type { TRPCResponse } from '@trpc/server/rpc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTrpcHandler = <Router extends AnyRouter>({
	endpointURL = '/trpc',
	router,
	createContext,
	responseMeta,
	onError
}: {
	/**
	 * URL the Handler is mounted on
	 */
	endpointURL: string;

	/**
	 * TRPC router
	 */
	router: Router;
	createContext?: (event: RequestEvent) => Promise<inferRouterContext<Router>>;
	responseMeta?: (options: {
		data: TRPCResponse<unknown, inferRouterError<Router>>[];
		ctx?: inferRouterContext<Router>;
		paths?: string[];
		type: 'query' | 'mutation' | 'subscription' | 'unknown';
		errors: TRPCError[];
	}) => ResponseMeta;

	onError?: (options: {
		error: TRPCError;
		type: 'query' | 'mutation' | 'subscription' | 'unknown';
		path?: string;
		input: unknown;
		ctx?: inferRouterContext<Router>;
		req: HTTPRequest;
	}) => void;
}): Handle => {
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
				createContext: async () => createContext?.(event),
				responseMeta,
				onError
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
