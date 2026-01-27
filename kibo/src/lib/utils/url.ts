import { SvelteURL } from 'svelte/reactivity';

import LZString from 'lz-string';

import { FILENAME_LIMIT, CONTENT_LIMIT } from '$lib/constants';

export const encode = (str: string): string => {
	return LZString.compressToEncodedURIComponent(str);
};

export const decode = (str: string): string => {
	try {
		return LZString.decompressFromEncodedURIComponent(str);
	} catch (e) {
		console.log('ERROR: Content could not be decoded. Error:', e);
		return '';
	}
};

export const getUrl = (href: string, fileName: string, content: string): SvelteURL => {
	const url = new SvelteURL(href);
	url.searchParams.set('f', encode(fileName.slice(0, FILENAME_LIMIT)));
	url.searchParams.set('c', encode(content.slice(0, CONTENT_LIMIT)));
	return url;
};
