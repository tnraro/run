<script lang="ts">
	import Problem from '$lib/components/ui/problem/problem.svelte';
	import { SidebarProvider } from '$lib/components/ui/sidebar';
	import { clearLocalStorage } from '$lib/hooks/local.js';
	import { storable } from '$lib/hooks/storable.js';
	import { hash } from '$lib/utils/hash.js';
	import { onMount } from 'svelte';
	let { data } = $props();

	const problems = storable<{ id: string; title: string; url: string }[]>('problems', () => []);

	let id = $derived(hash(data.problem.url));

	onMount(() => {
		const url = `/p/${data.id}`;
		problems.update((ps) => {
			if (ps.some((p) => p.url === url))
				return [{ id, title: data.problem.title, url }, ...ps.filter((p) => p.url !== url)];
			for (const p of ps.slice(2)) {
				clearLocalStorage(p.id);
			}
			return [{ id, title: data.problem.title, url }, ...ps].slice(0, 3);
		});
	});
</script>

<SidebarProvider>
	<Problem {id} problem={data.problem} />
</SidebarProvider>
