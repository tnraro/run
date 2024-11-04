<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		ref?: HTMLElement | null;
		class?: string;
		children?: Snippet;
	} & SvelteHTMLElements['p'];
	let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<p
	bind:this={ref}
	class={cn(
		'flex flex-1 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</p>
