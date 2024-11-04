<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		ref?: HTMLElement | null;
		class?: string;
		children?: Snippet;
	} & SvelteHTMLElements['a'];
	let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<a
	bind:this={ref}
	class={cn(
		'flex flex-1 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none active:bg-accent active:text-accent-foreground',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</a>
