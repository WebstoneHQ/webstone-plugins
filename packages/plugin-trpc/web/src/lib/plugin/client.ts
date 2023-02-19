import type { AnyRouter, ClientDataTransformerOptions } from '@trpc/server';
import {
	createTRPCProxyClient,
	httpBatchLink,
	type HTTPHeaders,
	type TRPCLink
} from '@trpc/client';

export function createTrpcClient<Router extends AnyRouter>({
	endpointUrl = '/trpc',
	loadFetch,
	transformer,
	headers
}: {
	endpointUrl: string;
	loadFetch?: typeof window.fetch;
	transformer?: ClientDataTransformerOptions;
	headers?: HTTPHeaders | (() => HTTPHeaders | Promise<HTTPHeaders>);
}) {
	const link: TRPCLink<Router> = httpBatchLink({
		url: endpointUrl,
		...(loadFetch && { fetch: loadFetch, headers })
	});

	return createTRPCProxyClient<Router>({ transformer, links: [link] });
}
