<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { browser } from '$app/environment';

	import { encode, decode } from '$lib/utils/base64';

	let {
		content = $bindable(''),
		fileName = $bindable('hello.txt'),
		cursorIndex = $bindable(0),
		shareUrl = $bindable(page.url.href)
	} = $props();

	// --- Initial State (SSR Safe) ---
	// If we are in the browser, pull from URL immediately; otherwise use defaults.
	content =
		browser && page.url.searchParams.get('content')
			? decode(page.url.searchParams.get('content')!)
			: '';

	fileName =
		browser && page.url.searchParams.get('file')
			? decode(page.url.searchParams.get('file')!)
			: 'hello.txt';

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
		url.searchParams.set('file', encode(currentFile));
		url.searchParams.set('content', encode(currentContent));

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

<div class="grid grid-cols-[3.5rem_1fr] overflow-hidden bg-black">
	<div
		bind:this={lineNumbersRef}
		class="overflow-hidden border-r border-gray-800 bg-gray-900/60 pt-4 pr-3 text-right text-gray-500 tabular-nums select-none"
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
		class="block-cursor h-full w-full resize-none border-none bg-transparent p-0 pt-4 pl-3 leading-6 text-gray-100 caret-gray-100 outline-none"
	></textarea>
	<label for="content" hidden>Content</label>
</div>

<style>
	.block-cursor {
		caret-shape: block;
	}
	textarea::-webkit-scrollbar {
		width: 6px;
	}
	textarea::-webkit-scrollbar-thumb {
		background: #27272a;
	}
</style>
