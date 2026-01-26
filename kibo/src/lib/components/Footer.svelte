<script lang="ts">
	import { page } from '$app/state';

	import { copyToClipboard } from '$lib/utils/clipboard';
	import Button from '$lib/components/Button.svelte';
	import { ThemeManager } from './Theme.svelte';

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

<div class=" bg-backdrop light:bg-l-backdrop">
	<div
		class="grid h-6 grid-cols-[1fr_auto] items-center border-t border-separator bg-accent/60 px-2 select-none light:border-l-separator light:bg-l-accent/60"
	>
		<div>
			<input
				bind:value={fileName}
				id="fileName"
				name="fileName"
				class="field-sizing-content max-w-18 min-w-8 border-none bg-transparent text-subtext transition-colors outline-none focus:text-content light:text-l-subtext light:focus:text-l-content"
			/>
			<label for="fileName" class="hidden">File Name</label>
			<Button onclick={shareNote}>[{shareText}]</Button>
			<Button onclick={ThemeManager.toggle}>[{ThemeManager.current}]</Button>
		</div>

		<div class="min-w-20 justify-self-end text-content light:text-l-content">
			Ln {cursorRow}, Col {cursorCol}
		</div>
	</div>
</div>
