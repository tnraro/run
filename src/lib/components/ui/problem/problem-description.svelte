<script lang="ts">
	import { micromark } from 'micromark';
	import { math, mathHtml } from 'micromark-extension-math';

	interface Props {
		content: string;
	}
	let { content }: Props = $props();

	let html = $derived.by(() =>
		micromark(content, {
			extensions: [math()],
			htmlExtensions: [mathHtml()],
			allowDangerousHtml: true
		})
	);
</script>

{@html html}
