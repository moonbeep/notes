// --- UTF-8 Safe Base64 Helpers ---

export const encode = (str: string) => {
	const bytes = new TextEncoder().encode(str);
	const binString = Array.from(bytes, (b) => String.fromCodePoint(b)).join('');
	return btoa(binString);
};

export const decode = (str: string) => {
	try {
		const binString = atob(str);
		const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
		return new TextDecoder().decode(bytes);
	} catch (e) {
		console.log('ERROR: Content could not be decoded. Error:', e);
		return '';
	}
};
