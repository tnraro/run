<script lang="ts">
	import { micromark } from 'micromark';
	import { math, mathHtml } from 'micromark-extension-math';

	interface Props {
		content: string;
	}
	let { content }: Props = $props();

	let html = $derived.by(() => {
		const html = micromark(content, {
			extensions: [math()],
			htmlExtensions: [mathHtml()],
			allowDangerousHtml: true
		});

		return imgNoReferrer(html);

		function imgNoReferrer(html: string) {
			return html.replaceAll('<img', '<img referrerpolicy="no-referrer"');
		}
	});
</script>

<article>
	{@html html}
</article>

<style>
	article :global(h1) {
		@apply text-2xl font-extrabold;
	}

	article :global(h2) {
		@apply my-2 text-xl font-bold;
	}

	article :global(p) {
		@apply inline leading-relaxed;
	}

	article :global(pre:has(code)) {
		@apply overflow-x-auto bg-background p-2 font-mono;
	}

	article :global(:not(pre) > code) {
		@apply font-mono text-sm text-destructive;
	}

	article :global(ul) {
		@apply list-inside list-disc;
	}

	article :global(img) {
		@apply mx-auto;
	}
</style>
