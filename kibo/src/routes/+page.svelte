<script lang="ts">
	import { ThemeManager } from '$lib/components/Theme.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let content = $state('');
	let fileName = $state('untitled');
	let cursorIndex = $state(0);

	$effect(() => {
		ThemeManager.apply();
	});
</script>

<main class="text-md grid h-screen grid-rows-[1fr_auto] overflow-hidden font-mono text-sm">
	<TextArea bind:content bind:fileName bind:cursorIndex />
	<Footer bind:fileName {content} {cursorIndex} />
</main>
