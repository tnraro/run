<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		ref?: HTMLElement | null;
		class?: string;
		children?: Snippet;
	} & SvelteHTMLElements['ul'];
	let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<ul bind:this={ref} class={cn('overflow-y-auto overflow-x-hidden space-y-1', className)} {...restProps}>
	{@render children?.()}
</ul>
