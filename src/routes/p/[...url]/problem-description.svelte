<script lang="ts">
	import type { PsProblem } from '$lib/server/ps/ps-adapter';
	import { math } from '@cartamd/plugin-math';
	import { Carta, Markdown } from 'carta-md';

	interface Props {
		problem: PsProblem;
	}
	let { problem }: Props = $props();

	const carta = new Carta({
		extensions: [math()],
		sanitizer(html) {
			return html;
		}
	});
</script>

<Markdown {carta} value={problem.content} />
