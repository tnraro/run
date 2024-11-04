<script lang="ts">
	import Problem from '$lib/components/ui/problem/problem.svelte';
	import { SidebarProvider } from '$lib/components/ui/sidebar';
	import { storable } from '$lib/hooks/storable.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	const playgrounds = storable<{ id: String; title: string; url: string }[]>(
		'playgrounds',
		() => []
	);

	onMount(() => {
		const url = `/pg/${data.id}`;
		playgrounds.update((ps) => {
			if (ps.some((p) => p.url === url))
				return [{ id: data.id, title: data.id, url }, ...ps.filter((p) => p.url !== url)];
			return [{ id: data.id, title: data.id, url }, ...ps];
		});
	});
</script>

<SidebarProvider>
	<Problem
		id={data.id}
		problem={{
			title: 'new playground',
			content: '',
			testcases: [],
			url: ''
		}}
	/>
</SidebarProvider>
