<script lang="ts">
	import { Accordion } from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarHeader
	} from '$lib/components/ui/sidebar';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { MutationState } from '$lib/hooks/mutation.svelte';
	import { House } from 'lucide-svelte';
	import ProblemDescription from './problem-description.svelte';
	import Testcase from './testcase.svelte';
	import type { ITestcase } from './types';
	import { toast } from 'svelte-sonner';

	interface Props {
		url: string;
		title: string;
		content: string;
		testcases: ITestcase[];
		code: string | undefined;
		onrun?: (testcases: string[]) => void;
		onadd?: (input?: string, output?: string) => void;
		ondelete?: (id: string) => void;
	}
	let {
		url,
		title,
		content,
		testcases = $bindable(),
		code,
		onrun,
		onadd,
		ondelete
	}: Props = $props();
</script>

<Tabs value="problem">
	<Sidebar>
		<SidebarHeader>
			<div class="flex items-center gap-2">
				<a href="/">
					<House />
				</a>
				<h1><a href={url} target="_blank" rel="noopener noreferrer">{title}</a></h1>
			</div>
		</SidebarHeader>
		<SidebarContent class="overflow-x-hidden">
			<TabsContent value="problem">
				<ProblemDescription {content} />
			</TabsContent>
			<TabsContent value="test">
				<Accordion type="multiple">
					{#each testcases as testcase, i (testcase.id)}
						<Testcase bind:testcase={testcases[i]} {onrun} {ondelete} />
					{/each}
					<div class="m-1 flex flex-col">
						<Button onclick={() => onadd?.()}>Add test case</Button>
					</div>
				</Accordion>
			</TabsContent>
		</SidebarContent>
		<SidebarFooter>
			<TabsContent value="test">
				<div class="flex gap-1">
					<Button
						disabled={testcases.some((testcase) => testcase.state === MutationState.Pending)}
						onclick={() => {
							onrun?.(testcases.map(({ id }) => id));
						}}>Run all</Button
					>
					<Button
						variant="secondary"
						onclick={async () => {
							if (code == null) return;

							try {
								await navigator.clipboard?.writeText(code);
								toast.success('Code copied to clipboard');
							} catch (error) {
								toast.error('Failed to copy code to clipboard', { description: String(error) });
							}
						}}>Copy</Button
					>
				</div>
			</TabsContent>
			<TabsList class="grid grid-cols-2">
				<TabsTrigger value="problem">Problem</TabsTrigger>
				<TabsTrigger value="test">Test</TabsTrigger>
			</TabsList>
		</SidebarFooter>
	</Sidebar>
</Tabs>
