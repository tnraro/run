<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import CodeEditor from '$lib/components/ui/code-editor/code-editor.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { SidebarTrigger, useSidebar } from '$lib/components/ui/sidebar';
	import { MutationState } from '$lib/hooks/mutation.svelte';
	import { storable } from '$lib/hooks/storable';
	import { Testcases } from '$lib/hooks/testcases.svelte';
	import type { PsProblem } from '$lib/server/ps/ps-adapter';
	import 'katex/dist/katex.min.css';
	import { Copy, Moon, Play, Sun } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
	import { onMount, setContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Code } from '../code-editor/context.svelte';
	import ProblemSidebar from './problem-sidebar.svelte';

	interface Props {
		id: string;
		problem: PsProblem;
	}
	let { id, problem }: Props = $props();

	const sidebar = useSidebar();
	onMount(() => {
		sidebar.setOpenMobile(true);
	});

	const code = new Code(id);
	setContext('code', code);

	const testcases = new Testcases();
	setContext('testcases', testcases);
	onMount(() => {
		testcases.new($testcasesStore.length > 0 ? $testcasesStore : problem.testcases);
	});

	const testcasesStore = storable<{ id: string; input: string; output: string }[]>(
		`${id}:testcases`,
		() => []
	);
	$effect(() => {
		testcasesStore.set(testcases.localSnapshot());
	});

	let tab = $state('problem');

	async function onrun(testcaseIds?: string[]) {
		const filter = testcaseIds != null ? new Set(testcaseIds) : undefined;
		try {
			testcases.setState(MutationState.Pending, filter);
			const res = await fetch('/api/run', {
				method: 'POST',
				body: JSON.stringify({
					lang: code.lang,
					code: code.code,
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
		try {
			await code.copy();
			toast.success('Code copied to clipboard');
		} catch (error) {
			if (error instanceof Error) {
				toast.error('Failed to copy code to clipboard', { description: error.message });
			} else {
				toast.error('Failed to copy code to clipboard', { description: String(error) });
			}
		}
	}
</script>

<ProblemSidebar
	url={problem.url}
	title={problem.title}
	content={problem.content}
	{tab}
	{onrun}
	oncopy={copyCode}
/>
<div class="grid w-full grid-rows-[1fr_max-content]">
	<ScrollArea>
		<CodeEditor lang={code.lang} bind:value={code.code} />
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
