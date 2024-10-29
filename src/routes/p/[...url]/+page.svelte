<script lang="ts">
	import { Carta, Markdown } from 'carta-md';
	import { math } from '@cartamd/plugin-math';
	let { data } = $props();

	const carta = new Carta({
		extensions: [math()],
		sanitizer(html) {
			return html;
		}
	});
</script>

<h1><a href={data.url} target="_blank" rel="noopener noreferrer">{data.title}</a></h1>

<Markdown {carta} value={data.content} />
