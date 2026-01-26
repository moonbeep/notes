<script lang="ts">
	import { page } from '$app/state';

	import { copy } from '$lib/utils/clipboard';

	let {
		fileName = $bindable('hello.txt'),
		content = '',
		cursorIndex = 0,
		shareUrl = page.url.href
	} = $props();

	let cursorRow = $derived(content.slice(0, cursorIndex).split('\n').length);
	let cursorCol = $derived(cursorIndex - content.lastIndexOf('\n', cursorIndex - 1));
</script>

<div class="bg-black">
	<div
		class="grid h-6 grid-cols-2 items-center border-t border-gray-800 bg-gray-900/60 px-2 select-none"
	>
		<div>
			<input
				bind:value={fileName}
				id="fileName"
				name="fileName"
				class="field-sizing-content min-w-16 border-none bg-transparent text-gray-300 transition-colors outline-none focus:text-gray-100"
			/>
			<label for="fileName" hidden>File Name</label>
			<button
				class="m-0 rounded px-1 text-gray-100 transition-colors hover:bg-gray-100/40 hover:text-gray-300"
				use:copy={shareUrl}
			>
				[Share]
			</button>
		</div>

		<div class="min-w-20 justify-self-end text-gray-100">
			Ln {cursorRow}, Col {cursorCol}
		</div>
	</div>
</div>
