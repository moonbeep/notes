<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { browser } from '$app/environment';

	import { encode, decode } from '$lib/utils/base64';

	let {
		content = $bindable(''),
		fileName = $bindable('untitled'),
		cursorIndex = $bindable(0),
		shareUrl = $bindable(page.url.href)
	} = $props();

	// --- Initial State (SSR Safe) ---
	// If we are in the browser, pull from URL immediately; otherwise use defaults.
	content =
		browser && page.url.searchParams.get('c') ? decode(page.url.searchParams.get('c')!) : '';

	fileName =
		browser && page.url.searchParams.get('f')
			? decode(page.url.searchParams.get('f')!)
			: 'untitled';

	let textareaRef: HTMLTextAreaElement | undefined = $state();
	let lineNumbersRef: HTMLDivElement | undefined = $state();

	// --- Derived Calculations ---
	let lines = $derived(content.split('\n'));

	// --- Sync Effect ---
	$effect(() => {
		if (!browser) return;

		// Track dependencies
		const currentContent = content;
		const currentFile = fileName;

		const url = new URL(page.url);
		url.searchParams.set('f', encode(currentFile));
		url.searchParams.set('c', encode(currentContent));

		// try/catch handles the "router not initialized" error during the first few milliseconds
		try {
			replaceState(url, {}); // eslint-disable-line svelte/no-navigation-without-resolve
			shareUrl = url.href;
		} catch (_) {
			// SvelteKit router isn't ready yet; it will catch up on the next state change
			// Do nothing
		}
	});

	// --- Event Handlers ---
	function handleScroll() {
		if (lineNumbersRef && textareaRef) lineNumbersRef.scrollTop = textareaRef.scrollTop;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Tab') {
			e.preventDefault();
			const start = textareaRef!.selectionStart;
			const end = textareaRef!.selectionEnd;
			content = content.substring(0, start) + '  ' + content.substring(end);

			// Update cursor position after DOM updates
			requestAnimationFrame(() => {
				if (textareaRef) {
					textareaRef.selectionStart = textareaRef.selectionEnd = start + 2;
					cursorIndex = textareaRef.selectionStart;
				}
			});
		}
	}
</script>

<div class="grid grid-cols-[2.5rem_1fr] overflow-hidden bg-backdrop light:bg-l-backdrop">
	<div
		bind:this={lineNumbersRef}
		class="overflow-hidden border-r border-separator bg-accent/60 pt-4 pr-3 text-right text-subtext tabular-nums select-none light:border-l-separator light:bg-l-accent/60 light:text-l-subtext"
	>
		{#each lines as _, i (i)}
			<div class="leading-6">{i + 1}</div>
		{/each}
	</div>

	<textarea
		bind:this={textareaRef}
		bind:value={content}
		id="content"
		name="content"
		onscroll={handleScroll}
		onkeydown={handleKeydown}
		onkeyup={() => (cursorIndex = textareaRef?.selectionStart ?? 0)}
		onclick={() => (cursorIndex = textareaRef?.selectionStart ?? 0)}
		spellcheck="false"
		class="block-cursor h-full w-full resize-none overflow-x-auto border-none bg-transparent p-0 pt-4 pl-3 leading-6 whitespace-pre text-content caret-content outline-none light:text-l-content light:caret-l-content"
	></textarea>
	<label for="content" hidden>Content</label>
</div>

<style>
	.block-cursor {
		caret-shape: block;
	}
	textarea::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	textarea::-webkit-scrollbar-thumb {
		background: #27272a;
	}
</style>
