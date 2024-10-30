<script lang="ts">
	import { SidebarProvider, SidebarTrigger } from '$lib/components/ui/sidebar';
	import 'katex/dist/katex.min.css';
	import ProblemSidebar from './problem-sidebar.svelte';
	let { data, children } = $props();
</script>

<SidebarProvider>
	<ProblemSidebar problem={data} />
	<div class="grid w-full grid-rows-[1fr_max-content]">
		<main>
			{@render children()}
		</main>
		<footer>
			<SidebarTrigger />
		</footer>
	</div>
</SidebarProvider>
