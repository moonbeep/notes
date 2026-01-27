<script lang="ts">
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';

	import { copyToClipboard } from '$lib/utils/clipboard';
	import { encodeUrl } from '$lib/utils/url';

	import Button from '$lib/components/Button.svelte';
	import { ThemeManager } from '$lib/components/Theme.svelte';

	import { FILENAME_LIMIT } from '$lib/constants';

	let { fileName = $bindable('new'), content = '', cursorIndex = 0 } = $props();

	let cursorRow = $derived(content.slice(0, cursorIndex).split('\n').length);
	let cursorCol = $derived(cursorIndex - content.lastIndexOf('\n', cursorIndex - 1));

	let shareText = $state('Share');

	const shareNote = async () => {
		const url = await encodeUrl(page.url.href, fileName, content);

		try {
			replaceState(url, {}); // eslint-disable-line svelte/no-navigation-without-resolve
		} catch (_) {
			// SvelteKit router isn't ready yet; it will catch up on the next state change
			// Do nothing
		}

		copyToClipboard(url.href);
		shareText = 'Copied!';
		setTimeout(() => {
			shareText = 'Share';
		}, 1000);
	};
</script>

<div class=" bg-backdrop light:bg-l-backdrop">
	<div
		class="grid min-h-6 grid-cols-[1fr_auto] items-center border-t border-separator bg-accent/60 px-2 select-none light:border-l-separator light:bg-l-accent/60"
	>
		<div>
			<input
				bind:value={fileName}
				id="fileName"
				name="fileName"
				maxlength={FILENAME_LIMIT}
				class="field-sizing-content max-w-32 min-w-8 border-none bg-transparent text-subtext transition-colors outline-none focus:text-content light:text-l-subtext light:focus:text-l-content"
			/>
			<label for="fileName" class="hidden">File Name</label>
			<Button onclick={shareNote}>[{shareText}]</Button>
			<Button onclick={ThemeManager.toggle}>[{ThemeManager.current}]</Button>
		</div>

		<div class="min-w-20 justify-self-end text-content light:text-l-content">
			<span>Ln {cursorRow},</span>
			<span>Col {cursorCol}</span>
		</div>
	</div>
</div>
