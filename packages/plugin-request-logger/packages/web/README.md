# `request-logger` Web - Webstone Plugin

## About

This library provides the following features for [SvelteKit](https://kit.svelte.dev/) applications

This library provides an `event.locals.logger` object for [SvelteKit](https://kit.svelte.dev/) applications. It can be accessed wherever `event.locals` is available. This includes hooks (`handle`, and `handleError`), server-only `load` functions, and `+server.js` files. See [the docs](https://kit.svelte.dev/docs/types#app-locals) for potential future locations.

## Installation

Install this plugin with the following command:

```shell
npm install -D webstone-plugin-request-logger-web
```

## Usage

Create a `src/hooks.server.js` file, if it doesn't already exist, with the following code:

```js
import { sequence } from '@sveltejs/kit/hooks';
import { addRequestLogger, logRequestDetails } from 'webstone-plugin-request-logger-web';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(addRequestLogger, logRequestDetails /*, yourHandlers*/);
```

### `locals.logger`

The logger is available wherever `event.locals` is available ([docs](https://kit.svelte.dev/docs/types#app-locals)). For example, to use it in a server-only `load` function or an action within a `+page.server.js` file:

```ts
import type { Actions, PageServerLoad } from './$types';

import { fail } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	locals.logger.debug('Fetching posts from database...');

	try {
		// TODO: Fetch posts from database
		locals.logger.debug(`Successfully fetched ${posts.length} posts`);
	} catch (error) {
		locals.logger.error(`Failed to fetched ${posts.length} posts`, error);
	}

	return {};
}) satisfies PageServerLoad;

export const actions = {
	create_post: async (event) => {
		const data = await event.request.formData();
		const author = data.get('author')?.toString() || '';
		const content = data.get('content')?.toString() || '';
		event.locals.logger.log('Creating a new post...', {
			author,
			content
		});

		try {
			// TODO: Persist the new post in the database
			event.locals.logger.debug('Successfully created the post');
		} catch (error) {
			event.locals.logger.error('Could not persist the post', { error });
			return fail(500, {
				id: 'form_create_post',
				reason: 'unexpected'
			});
		}
	}
} satisfies Actions;
```

## Learn more about Webstone Plugins

This plugin is part of a wider ecosystem called [Webstone Plugins](https://github.com/WebstoneHQ/webstone-plugins).
