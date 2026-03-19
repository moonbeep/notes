<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		disabled = false,
		submit = false,
		onclick = undefined,
		label = 'Button',
		children
	} = $props<{
		disabled?: boolean;
		submit?: boolean;
		onclick?: () => void;
		label?: string;
		children: Snippet;
	}>();
</script>

<button
	aria-label={label}
	class="m-0 rounded px-1 text-content transition-colors hover:bg-content/40 hover:text-subtext light:text-l-content light:hover:bg-l-content/20 light:hover:text-l-subtext"
	{disabled}
	type={submit ? 'submit' : 'button'}
	{onclick}
>
	{@render children?.()}
</button>
