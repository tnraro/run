<script lang="ts">
	import CodeEditor from '$lib/components/ui/code-editor/code-editor.svelte';
	import { SidebarProvider, SidebarTrigger } from '$lib/components/ui/sidebar';
	import { mutation } from '$lib/hooks/mutation.svelte';
	import 'katex/dist/katex.min.css';
	import type { ApiPBody } from '../../api/p/+server';
	import ProblemSidebar from './problem-sidebar.svelte';

	let { data } = $props();

	let code = $state<string>();

	const result = mutation({
		async fn(testcases: string[]) {
			const res = await fetch('/api/p', {
				method: 'POST',
				body: JSON.stringify({
					code,
					testcases
				})
			});
			return (await res.json()) as ApiPBody;
		}
	});

	let testcases = $derived.by(() => {
		const testcases = result.data?.testcases ?? {};
		const state = result.state;
		return data.problem.testcases.map((testcase) => {
			const tc = testcases[testcase.input];
			return {
				...testcase,
				receivedOutput: tc?.output,
				state,
				time: tc?.time
			};
		});
	});

	let problem = $derived.by(() => {
		return {
			...data.problem,
			testcases
		};
	});

	$inspect(result);
</script>

<SidebarProvider>
	<ProblemSidebar {...problem} onrun={result.mutate} />
	<div class="grid w-full grid-rows-[1fr_max-content]">
		<main>
			<CodeEditor bind:value={code} />
		</main>
		<footer>
			<SidebarTrigger />
		</footer>
	</div>
</SidebarProvider>
