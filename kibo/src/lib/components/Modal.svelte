<script lang="ts">
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';

	import { listNotes, loadNote, deleteNote } from '$lib/utils/db';

	import Button from '$lib/components/Button.svelte';

	// Props
	let {
		isOpen = $bindable(true),
		selectedNoteName = $bindable('new'),
		content = $bindable(''),
		savedNotes = $bindable([]),
		autosave = $bindable(false),
		onClose = $bindable()
	} = $props<{
		isOpen: boolean;
		selectedNoteName: string;
		content: string;
		savedNotes: string[];
		autosave: boolean;
		onClose?: () => void;
	}>();

	// Internal state
	let searchText = $state('');
	let filteredNoteNames = $derived(
		savedNotes.filter((name: string) => name.toLowerCase().includes(searchText.toLowerCase()))
	);

	onMount(async () => {
		savedNotes = await listNotes();
	});

	// Handle note load
	const onLoadNote = async (loadNoteName: string) => {
		content = await loadNote(loadNoteName);
		selectedNoteName = loadNoteName;
		isOpen = false;
	};

	// Handle note delete
	const onDeleteNote = async (deleteNoteName: string) => {
		if (selectedNoteName === deleteNoteName) {
			autosave = false;
		}
		await deleteNote(deleteNoteName);
		savedNotes = await listNotes();
	};

	onClose = (event: MouseEvent) => {
		if (event.target === event.currentTarget) {
			isOpen = !isOpen;
		}
	};
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && onClose()} />

{#if isOpen}
	<button
		transition:fade={{ duration: 10 }}
		aria-label="close modal"
		class="fixed inset-0 z-100 grid place-items-center bg-backdrop/80 p-4 backdrop-blur-sm light:bg-backdrop/20"
		onclick={onClose}
	>
		<div
			class="grid max-w-[80vw] grid-flow-row gap-2 rounded border border-separator bg-accent/60 p-2 text-content light:border-l-separator light:bg-l-accent/60 light:text-l-content"
		>
			<!-- Search bar -->
			<input
				type="text"
				id="searchFile"
				name="searchFile"
				aria-label="search note"
				bind:value={searchText}
				placeholder="Search notes..."
				class="w-full rounded border border-separator p-2 text-content
				focus:ring-1 focus:ring-accent/50 focus:outline-none
				light:border-l-separator light:text-l-content light:focus:ring-l-accent/50"
			/>

			<!-- Notes list -->
			<ul class="max-h-64 overflow-y-auto">
				{#each filteredNoteNames as name (name)}
					<li
						transition:slide={{ duration: 100 }}
						class="grid grid-cols-[1fr_auto] gap-4 border-b border-separator py-1 light:border-l-separator"
					>
						<!-- Load button -->
						<Button onclick={() => onLoadNote(name)}>
							<div class="p-1">{name}</div>
						</Button>
						<!-- Delete button -->
						<Button onclick={() => onDeleteNote(name)}
							><div class="p-1 text-danger light:text-l-danger">[X]</div></Button
						>
					</li>
				{/each}
			</ul>

			<div class="p-2">
				<Button label="close modal" onclick={onClose}>[Close]</Button>
			</div>
		</div>
	</button>
{/if}
