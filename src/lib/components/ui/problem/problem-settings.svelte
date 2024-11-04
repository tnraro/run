<script lang="ts">
	import { Code } from '$lib/components/ui/code-editor/context.svelte';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { getContext } from 'svelte';

	const code = getContext<Code>('code');
</script>

<h2>Language</h2>
<Select type="single" name="lang" bind:value={code.lang}>
	<SelectTrigger>
		{code.lang}
	</SelectTrigger>
	<SelectContent>
		{#each Code.Languages as lang}
			<SelectItem value={lang} label={lang} />
		{/each}
	</SelectContent>
</Select>
