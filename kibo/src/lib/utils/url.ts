import { SvelteURL } from 'svelte/reactivity';

import { FILENAME_LIMIT, CONTENT_LIMIT } from '$lib/constants';

export async function compress(str: string): Promise<string> {
	const blob = new Blob([str]);

	const compressedStream = blob.stream().pipeThrough(new CompressionStream('gzip'));
	const buffer = await new Response(compressedStream).arrayBuffer();

	// Convert to base64
	return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export async function decompress(base64: string): Promise<string> {
	try {
		const binaryString = atob(base64);
		const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));

		const response = new Response(bytes);
		const decompressedStream = response.body!.pipeThrough(new DecompressionStream('gzip'));

		return await new Response(decompressedStream).text();
	} catch (e) {
		console.log('ERROR: Content could not be decoded. Error:', e);
		return '';
	}
}

export const encodeUrl = async (
	href: string,
	fileName: string,
	content: string
): Promise<SvelteURL> => {
	const url = new SvelteURL(href);
	url.searchParams.set('f', await compress(fileName.slice(0, FILENAME_LIMIT)));
	url.searchParams.set('c', await compress(content.slice(0, CONTENT_LIMIT)));
	return url;
};

export const decodeUrl = async (href: string) => {
	const url = new SvelteURL(href);
	const content = url.searchParams.get('c') ? await decompress(url.searchParams.get('c')!) : '';

	const fileName = url.searchParams.get('f') ? await decompress(url.searchParams.get('f')!) : 'new';

	return {
		content: content,
		fileName: fileName
	};
};
