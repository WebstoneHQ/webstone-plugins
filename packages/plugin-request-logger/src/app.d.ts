// See https://kit.svelte.dev/docs/types#app

import type { RequestLogger } from '$lib/request-logger.ts';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			logger: RequestLogger;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
