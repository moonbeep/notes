<script lang="ts">
	import { page } from '$app/state';

	import { copyToClipboard } from '$lib/utils/clipboard';
	import Button from '$lib/components/Button.svelte';

	let {
		fileName = $bindable('untitled'),
		content = '',
		cursorIndex = 0,
		shareUrl = page.url.href
	} = $props();

	let cursorRow = $derived(content.slice(0, cursorIndex).split('\n').length);
	let cursorCol = $derived(cursorIndex - content.lastIndexOf('\n', cursorIndex - 1));

	let shareText = $state('Share');

	const shareNote = () => {
		copyToClipboard(shareUrl);
		shareText = 'Done!';
		setTimeout(() => {
			shareText = 'Share';
		}, 1000);
	};
</script>

<div class="bg-backdrop">
	<div
		class="grid h-6 grid-cols-2 items-center border-t border-separator bg-accent/60 px-2 select-none"
	>
		<div>
			<input
				bind:value={fileName}
				id="fileName"
				name="fileName"
				class="field-sizing-content min-w-8 border-none bg-transparent text-subtext transition-colors outline-none focus:text-content"
			/>
			<label for="fileName" class="hidden">File Name</label>
			<Button onclick={shareNote}>[{shareText}]</Button>
		</div>

		<div class="min-w-20 justify-self-end text-content">
			Ln {cursorRow}, Col {cursorCol}
		</div>
	</div>
</div>
