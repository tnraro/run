<script lang="ts">
	import { SidebarProvider, SidebarTrigger } from '$lib/components/ui/sidebar';
	import 'katex/dist/katex.css';
	import ProblemSidebar from './problem-sidebar.svelte';
	let { data, children } = $props();
</script>

<SidebarProvider>
	<ProblemSidebar problem={data} />
	<main>
		<SidebarTrigger />
		{@render children()}
	</main>
</SidebarProvider>
