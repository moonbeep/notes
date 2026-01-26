<script lang="ts">
	const { children, disabled = false, submit = false, onclick = undefined } = $props();
</script>

<button
	class="m-0 rounded px-1 text-content transition-colors hover:bg-content/40 hover:text-subtext light:text-l-content light:hover:bg-l-content/40 light:hover:text-l-subtext"
	{disabled}
	type={submit ? 'submit' : 'button'}
	{onclick}
>
	{@render children?.()}
</button>
