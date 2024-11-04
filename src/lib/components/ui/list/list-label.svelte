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

<p bind:this={ref} class={cn('m-0 text-sm font-medium leading-none', className)} {...restProps}>
	{@render children?.()}
</p>
