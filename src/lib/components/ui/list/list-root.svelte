<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		ref?: HTMLElement | null;
		class?: string;
		children?: Snippet;
	} & SvelteHTMLElements['div'];
	let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<div bind:this={ref} class={cn('space-y-2', className)} {...restProps}>
	{@render children?.()}
</div>
