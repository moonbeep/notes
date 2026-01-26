<script lang="ts">
	import { page } from '$app/state';

	import { ThemeManager } from '$lib/components/Theme.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let content = $state('');
	let fileName = $state('untitled');
	let cursorIndex = $state(0);
	let shareUrl = $state(page.url.href);

	$effect(() => {
		ThemeManager.apply();
	});
</script>

<main class="text-md grid h-screen grid-rows-[1fr_24px] overflow-hidden font-mono text-sm">
	<TextArea bind:content bind:fileName bind:cursorIndex bind:shareUrl />
	<Footer bind:fileName {content} {cursorIndex} {shareUrl} />
</main>
