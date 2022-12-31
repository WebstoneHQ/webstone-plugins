import type { AnyRouter, ClientDataTransformerOptions } from '@trpc/server';
import { createTRPCProxyClient, httpBatchLink, type TRPCLink } from '@trpc/client';

export function createTrpcClient<Router extends AnyRouter>(
	endpointUrl = '/trpc',
	loadFetch?: typeof window.fetch,
	transformer?: ClientDataTransformerOptions
) {
	const link: TRPCLink<Router> = httpBatchLink({
		url: endpointUrl,
		...(loadFetch && { fetch: loadFetch })
	});

	return createTRPCProxyClient<Router>({ transformer, links: [link] });
}
