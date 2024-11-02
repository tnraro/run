<script lang="ts">
	import CodeEditor from '$lib/components/ui/code-editor/code-editor.svelte';
	import template from '$lib/components/ui/code-editor/template.cpp?raw';
	import { SidebarProvider, SidebarTrigger } from '$lib/components/ui/sidebar';
	import { hash } from '$lib/utils/hash';
	import { psCompare } from '$lib/utils/ps-trim';
	import 'katex/dist/katex.min.css';
	import { onMount, tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { ApiPResponse } from '../../api/p/+server';
	import ProblemSidebar from './problem-sidebar.svelte';
	import type { ITestcase } from './types';

	let { data } = $props();

	let code = $state<string>();
	let testcases = $state<ITestcase[]>([]);

	onMount(() => {
		loadCode();
		loadTestcase();
		if (testcases.length === 0) {
			for (const tc of data.problem.testcases) {
				addTestcase(tc.input, tc.output);
			}
		}
	});

	$effect(() => {
		const key = `${hash(data.problem.url)}:testcases`;
		localStorage.setItem(
			key,
			JSON.stringify(
				testcases.map((tc) => ({
					id: tc.id,
					input: tc.input,
					output: tc.output
				}))
			)
		);
	});
	$effect(() => {
		if (code == null) return;
		const key = `${hash(data.problem.url)}:code`;
		localStorage.setItem(key, code);
	});

	function loadCode() {
		const key = `${hash(data.problem.url)}:code`;
		const x = localStorage.getItem(key);
		tick().then(() => {
			code = x == null ? template : x;
		});
	}
	function loadTestcase() {
		const key = `${hash(data.problem.url)}:testcases`;
		const x = localStorage.getItem(key);
		if (x == null) return;
		const y = JSON.parse(x);
		for (const { id, input, output } of y) {
			testcases.push({
				id,
				input,
				output,
				state: 0
			});
		}
	}

	function addTestcase(input?: string, output?: string) {
		testcases.push({
			id: crypto.randomUUID(),
			input: input ?? '',
			output: output ?? '',
			state: 0
		});
	}

	function deleteTestcase(id: string) {
		testcases = testcases.filter((tc) => tc.id !== id);
	}

	async function onrun(testcaseIds: string[]) {
		try {
			testcases = testcases.map((tc) => ({
				...tc,
				state: testcaseIds.includes(tc.id) ? 1 : tc.state
			}));
			const res = await fetch('/api/p', {
				method: 'POST',
				body: JSON.stringify({
					code,
					testcases: testcases
						.filter((tc) => testcaseIds.includes(tc.id))
						.map((tc) => ({
							id: tc.id,
							input: tc.input
						}))
				})
			});
			if (!res.ok) {
				throw res;
			}
			const body = (await res.json()) as ApiPResponse;

			for (const testcase of body) {
				const index = testcases.findIndex((tc) => tc.id === testcase.id);
				if (index !== -1) {
					const isSame = psCompare(testcases[index].output, testcase.output);
					testcases[index].state = isSame ? 2 : 3;
					testcases[index].receivedOutput = testcase.output;
					testcases[index].time = testcase.time;
				}
			}
		} catch (error) {
			testcases = testcases.map((tc) => ({
				...tc,
				state: testcaseIds.includes(tc.id) ? 3 : tc.state
			}));
			if (error instanceof Response) {
				const body = await error.text();
				toast.error(body, { duration: 1_000_000 });
				return;
			}
			toast.error(String(error));
			console.error(error);
		}
	}
</script>

<SidebarProvider>
	<ProblemSidebar
		url={data.problem.url}
		title={data.problem.title}
		content={data.problem.content}
		bind:testcases
		{code}
		{onrun}
		onadd={addTestcase}
		ondelete={deleteTestcase}
	/>
	<div class="grid w-full grid-rows-[1fr_max-content]">
		<main>
			<CodeEditor bind:value={code} />
		</main>
		<footer>
			<SidebarTrigger />
		</footer>
	</div>
</SidebarProvider>
