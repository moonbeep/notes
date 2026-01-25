import type { Action } from 'svelte/action';

export const copy: Action<HTMLElement, string> = (node, text) => {
	function handleClick() {
		if (text) {
			navigator.clipboard
				.writeText(text)
				.then(() => {
					// Optional: Dispatch a custom event on success
					node.dispatchEvent(new CustomEvent('copied', { detail: text }));
				})
				.catch((e) => console.error('ERROR: Could not save note to clipboard. Error:', e));
		}
	}

	node.addEventListener('click', handleClick);

	return {
		update(newText) {
			text = newText; // Update the text if the prop changes
		},
		destroy() {
			node.removeEventListener('click', handleClick);
		}
	};
};
