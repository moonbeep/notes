<script lang="ts">
	import { page } from '$app/state';

	import TextArea from '$lib/components/TextArea.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let content = $state('');
	let fileName = $state('hello.txt');
	let cursorIndex = $state(0);
	let shareUrl = $state(page.url.href);
</script>

<div class="text-md grid h-screen grid-rows-[1fr_24px] overflow-hidden font-mono text-sm">
	<TextArea bind:content bind:fileName bind:cursorIndex bind:shareUrl />

	<Footer bind:fileName {content} {cursorIndex} {shareUrl} />
</div>
