<script lang="ts">
	import { ThemeManager } from '$lib/components/Theme.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Modal from '$lib/components/Modal.svelte';

	import { BANNER } from '$lib/constants';

	let content = $state('');
	let noteName = $state('new');
	let cursorIndex = $state(0);
	let isOpen = $state(false);
	let savedNotes = $state([]);
	let autosave = $state(false);
	let overflow = $state(false);

	$effect(() => {
		ThemeManager.apply();
	});

	console.log(BANNER + '\nVersion:', __APP_VERSION__, '\nRelease date:', __BUILD_TIME__);
</script>

<main class="text-md grid h-screen grid-rows-[1fr_auto] overflow-hidden font-mono text-sm">
	<TextArea bind:content bind:noteName bind:cursorIndex {autosave} bind:overflow />
	<Footer
		bind:noteName
		{content}
		{cursorIndex}
		bind:isLoadModalOpen={isOpen}
		bind:savedNotes
		bind:autosave
		{overflow}
	/>
	<Modal bind:isOpen bind:selectedNoteName={noteName} bind:content bind:savedNotes bind:autosave />
</main>
