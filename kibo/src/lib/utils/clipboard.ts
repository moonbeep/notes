export const copyToClipboard = async (text: string): Promise<void> => {
	try {
		await navigator.clipboard.writeText(text);
	} catch (e) {
		console.error('ERROR: Could not save note to clipboard. Error:', e);
	}
};
