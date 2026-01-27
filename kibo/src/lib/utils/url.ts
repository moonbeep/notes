import { SvelteURL } from 'svelte/reactivity';

import { encode } from '$lib/utils/base64';

import { FILENAME_LIMIT, CONTENT_LIMIT } from '$lib/constants';

export const getUrl = (href: string, fileName: string, content: string) => {
	const url = new SvelteURL(href);
	url.searchParams.set('f', encode(fileName.slice(0, FILENAME_LIMIT)));
	url.searchParams.set('c', encode(content.slice(0, CONTENT_LIMIT)));
	return url;
};
