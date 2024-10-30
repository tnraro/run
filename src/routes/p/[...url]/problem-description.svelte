<script lang="ts">
	import type { PsProblem } from '$lib/server/ps/ps-adapter';
	import { micromark } from 'micromark';
	import { math, mathHtml } from 'micromark-extension-math';

	interface Props {
		problem: PsProblem;
	}
	let { problem }: Props = $props();

	let html = $derived.by(() =>
		micromark(problem.content, {
			extensions: [math()],
			htmlExtensions: [mathHtml()],
			allowDangerousHtml: true
		})
	);
</script>

{@html html}
