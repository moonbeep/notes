<script lang="ts">
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';

	import { copyToClipboard } from '$lib/utils/clipboard';
	import { saveNote, listNotes } from '$lib/utils/db';
	import { encodeUrl } from '$lib/utils/url';

	import Button from '$lib/components/Button.svelte';
	import { ThemeManager } from '$lib/components/Theme.svelte';

	import { NOTE_NAME_LIMIT } from '$lib/constants';

	let {
		noteName = $bindable('new'),
		content = $bindable(''),
		cursorIndex = 0,
		isLoadModalOpen = $bindable(false),
		savedNotes = $bindable([]),
		autosave = $bindable(false),
		overflow = false
	} = $props<{
		noteName: string;
		content: string;
		cursorIndex: number;
		isLoadModalOpen: boolean;
		savedNotes: string[];
		autosave: boolean;
		overflow: boolean;
	}>();

	let cursorRow = $derived(content.slice(0, cursorIndex).split('\n').length);
	let cursorCol = $derived(cursorIndex - content.lastIndexOf('\n', cursorIndex - 1));

	let shareText = $state('Share');
	let saveText = $derived(autosave === true ? 'Auto Saving' : 'Save');

	const shareNote = async () => {
		const url = await encodeUrl(page.url.href, noteName, content);

		try {
			replaceState(url, {}); // eslint-disable-line svelte/no-navigation-without-resolve
		} catch (_) {
			// SvelteKit router isn't ready yet; it will catch up on the next state change
			// Do nothing
		}

		copyToClipboard(url.href);
		shareText = 'Copied!';
		setTimeout(() => {
			shareText = 'Share';
		}, 1000);
	};

	const onSaveNote = async () => {
		await saveNote(content, noteName);
		savedNotes = await listNotes();
		autosave = true;
	};

	const openLoadModal = () => {
		isLoadModalOpen = true;
	};

	$effect(() => {
		if (noteName) {
			autosave = false;
		}
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if ((e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			onSaveNote();
		}
	}}
/>

<div class=" bg-backdrop light:bg-l-backdrop">
	<div
		class="grid min-h-6 grid-cols-[1fr_auto] items-center border-t border-separator bg-accent/60 px-2 select-none light:border-l-separator light:bg-l-accent/60"
	>
		<div>
			<input
				bind:value={noteName}
				id="noteName"
				name="noteName"
				aria-label="note name"
				maxlength={NOTE_NAME_LIMIT}
				class="field-sizing-content max-w-32 min-w-8 border-none bg-transparent text-subtext transition-colors outline-none focus:text-content light:text-l-subtext light:focus:text-l-content"
			/>
			<Button onclick={shareNote} label="share">[{shareText}]</Button>
			<Button onclick={onSaveNote} label="save">[{saveText}]</Button>
			<Button onclick={openLoadModal} label="load notes">[Load]</Button>
			<Button onclick={ThemeManager.toggle} label="change theme">[{ThemeManager.current}]</Button>
			{#if overflow === true}
				<Button disabled label="overflow">[Overflow Detected!]</Button>
			{/if}
		</div>

		<div class="min-w-20 justify-self-end text-content light:text-l-content">
			<span>Ln {cursorRow},</span>
			<span>Col {cursorCol}</span>
		</div>
	</div>
</div>
