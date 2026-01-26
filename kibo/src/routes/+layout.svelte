<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Kibo</title>
	<meta name="description" content="Simple, sharable and ephemeral notes." />
</svelte:head>
{@render children()}
