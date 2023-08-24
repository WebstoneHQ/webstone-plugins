// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { RequestLogger } from '$lib/request-logger.ts';

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
