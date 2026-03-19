<script lang="ts">
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import { onMount } from 'svelte';

	import { saveNote } from '$lib/utils/db';
	import { decodeUrl, encodeUrl } from '$lib/utils/url';

	import { LINE_HEIGHT, CONTENT_LIMIT } from '$lib/constants';

	let {
		content = $bindable(''),
		noteName = $bindable('new'),
		cursorIndex = $bindable(0),
		autosave = false
	} = $props();

	let textareaRef: HTMLTextAreaElement | undefined = $state();
	let lineNumbersRef: HTMLDivElement | undefined = $state();
	let charMeasureRef: HTMLSpanElement | undefined = $state();

	let containerWidth = $state(0);
	let charWidth = $state(0);

	// --- Derived Calculations ---
	let lines = $derived(content.split('\n'));

	// Calculate how many visual rows each logical line occupies
	let lineMetadata = $derived.by(() => {
		if (charWidth === 0 || containerWidth === 0) return lines.map(() => 1);

		const charsPerLine = Math.floor(containerWidth / charWidth);

		return lines.map((line) => {
			if (line.length === 0) return 1;
			return Math.ceil(line.length / charsPerLine) || 1;
		});
	});

	// --- Sync Effects ---
	onMount(async () => {
		const params = await decodeUrl(page.url.href);
		content = params.content;
		noteName = params.noteName;
	});

	$effect(() => {
		// Touching content and noteName so Svelte can track it in effect
		const currentContent = content;
		const currentFileName = noteName;

		if (!charMeasureRef) return;

		charWidth = charMeasureRef.getBoundingClientRect().width;

		const timerId = setTimeout(async () => {
			const url = await encodeUrl(page.url.href, currentFileName, currentContent);
			try {
				replaceState(url, {}); // eslint-disable-line svelte/no-navigation-without-resolve
			} catch (_) {
				// SvelteKit router isn't ready yet; it will catch up on the next state change
				// Do nothing
			}
			if (autosave) {
				await saveNote(content, noteName);
			}
		}, 300);

		return () => {
			clearTimeout(timerId);
		};
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

<!-- This is to measure how much space a character occupies on the screen -->
<span
	bind:this={charMeasureRef}
	class="invisible absolute font-mono whitespace-pre"
	aria-hidden="true">x</span
>

<div class="grid grid-cols-[3rem_1fr] overflow-hidden bg-backdrop font-mono light:bg-l-backdrop">
	<div
		bind:this={lineNumbersRef}
		class="overflow-hidden border-r border-separator bg-accent/60 pt-4 pr-3 text-right text-subtext tabular-nums select-none light:border-l-separator light:bg-l-accent/60 light:text-l-subtext"
	>
		{#each lineMetadata as rows, i (i)}
			<div style="height: {rows * LINE_HEIGHT}rem;" class="leading-6">
				{i + 1}
			</div>
		{/each}
	</div>

	<textarea
		bind:this={textareaRef}
		bind:value={content}
		bind:clientWidth={containerWidth}
		id="content"
		name="content"
		onscroll={handleScroll}
		onkeydown={handleKeydown}
		onkeyup={async () => (cursorIndex = textareaRef?.selectionStart ?? 0)}
		onclick={() => (cursorIndex = textareaRef?.selectionStart ?? 0)}
		spellcheck="false"
		maxlength={CONTENT_LIMIT}
		class="block-cursor h-full w-full resize-none border-none bg-transparent p-0 pt-4 pl-3 leading-6 break-all whitespace-pre-wrap text-content caret-content outline-none light:text-l-content light:caret-l-content"
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
