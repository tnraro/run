<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		ref?: HTMLElement | null;
		class?: string;
		children?: Snippet;
	} & SvelteHTMLElements['li'];
	let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<li bind:this={ref} class={cn('flex gap-1', className)} {...restProps}>
	{@render children?.()}
</li>
