<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import CodeEditor from '$lib/components/ui/code-editor/code-editor.svelte';
	import template from '$lib/components/ui/code-editor/template.cpp?raw';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { SidebarTrigger, useSidebar } from '$lib/components/ui/sidebar';
	import { MutationState } from '$lib/hooks/mutation.svelte';
	import { storable } from '$lib/hooks/storable';
	import { Testcases } from '$lib/hooks/testcases.svelte';
	import { hash } from '$lib/utils/hash';
	import 'katex/dist/katex.min.css';
	import { Copy, Moon, Play, Sun } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	import { onMount, setContext, tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import ProblemSidebar from './problem-sidebar.svelte';

	let { data } = $props();

	const sidebar = useSidebar();
	onMount(() => {
		sidebar.setOpenMobile(true);
	});

	let code = $state<string>();
	onMount(() => {
		loadCode();
	});
	$effect(() => {
		if (code == null) return;
		const key = `${hash(data.problem.url)}:code`;
		localStorage.setItem(key, code);
	});

	const testcases = new Testcases();
	setContext('testcases', testcases);
	onMount(() => {
		testcases.new($testcasesStore.length > 0 ? $testcasesStore : data.problem.testcases);
	});

	const testcasesStore = storable<{ id: string; input: string; output: string }[]>(
		`${hash(data.problem.url)}:testcases`,
		() => []
	);
	$effect(() => {
		testcasesStore.set(testcases.localSnapshot());
	});

	let tab = $state('problem');

	const problems = storable<{ title: string; url: string }[]>('problems', () => []);
	onMount(() => {
		problems.update((ps) => {
			const url = `/p/${data.id}`;
			if (ps.some((p) => p.url === url)) return ps;
			return [{ title: data.problem.title, url }, ...ps].slice(0, 3);
		});
	});

	function loadCode() {
		const key = `${hash(data.problem.url)}:code`;
		const x = localStorage.getItem(key);
		tick().then(() => {
			code = x == null ? template : x;
		});
	}

	async function onrun(testcaseIds?: string[]) {
		const filter = testcaseIds != null ? new Set(testcaseIds) : undefined;
		try {
			testcases.setState(MutationState.Pending, filter);
			const res = await fetch('/api/p', {
				method: 'POST',
				body: JSON.stringify({
					code,
					testcases: testcases.remoteSnapshot(filter)
				})
			});
			if (!res.ok) {
				throw res;
			}
			testcases.setResult(await res.json());
		} catch (error) {
			testcases.setState(MutationState.Error);
			if (error instanceof Response) {
				const body = await error.text();
				toast.error(body, { duration: 1_000_000 });
				return;
			}
			toast.error(String(error));
			console.error(error);
		}
	}
	async function copyCode() {
		if (code == null) return;

		try {
			await navigator.clipboard?.writeText(code);
			toast.success('Code copied to clipboard');
		} catch (error) {
			toast.error('Failed to copy code to clipboard', { description: String(error) });
		}
	}
</script>

<ProblemSidebar
	url={data.problem.url}
	title={data.problem.title}
	content={data.problem.content}
	{tab}
	{onrun}
	oncopy={copyCode}
/>
<div class="grid w-full grid-rows-[1fr_max-content]">
	<ScrollArea>
		<CodeEditor bind:value={code} />
	</ScrollArea>
	<footer class="flex justify-between gap-1">
		<SidebarTrigger />
		<Button
			disabled={testcases.isPending}
			onclick={() => {
				tab = 'test';
				sidebar.setOpenMobile(true);
				onrun();
			}}><Play /></Button
		>
		<Button onclick={copyCode} variant="secondary"><Copy /></Button>
		<Button onclick={toggleMode} variant="ghost">
			<Sun class="scale-100 dark:scale-0" />
			<Moon class="absolute scale-0 dark:scale-100" />
		</Button>
	</footer>
</div>
