<script lang="ts">
	import { ThemeManager } from '$lib/components/Theme.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { BANNER } from '$lib/constants';

	let content = $state('');
	let fileName = $state('new');
	let cursorIndex = $state(0);

	$effect(() => {
		ThemeManager.apply();
	});

	console.log(BANNER + '\nVersion:', __APP_VERSION__, '\nRelease date:', __BUILD_TIME__);
</script>

<main class="text-md grid h-screen grid-rows-[1fr_auto] overflow-hidden font-mono text-sm">
	<TextArea bind:content bind:fileName bind:cursorIndex />
	<Footer bind:fileName {content} {cursorIndex} />
</main>
