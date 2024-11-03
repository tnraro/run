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
	import type { Testcases } from '$lib/hooks/testcases.svelte';
	import { House } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import ProblemDescription from './problem-description.svelte';
	import Testcase from './testcase.svelte';

	interface Props {
		url: string;
		title: string;
		content: string;
		tab: string;
		onrun?: (testcases?: string[]) => void;
		oncopy?: () => void;
	}
	let { url, title, content, tab, onrun, oncopy }: Props = $props();

	const testcases = getContext<Testcases>('testcases');
</script>

<Tabs bind:value={tab}>
	<Sidebar collapsible="offcanvas">
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
					{#each testcases as testcase (testcase.id)}
						<Testcase {testcase} {onrun} />
					{/each}
					<div class="m-1 flex flex-col">
						<Button onclick={() => testcases.add()}>Add test case</Button>
					</div>
				</Accordion>
			</TabsContent>
		</SidebarContent>
		<SidebarFooter>
			<TabsContent value="test">
				<div class="flex gap-1">
					<Button
						disabled={testcases.isPending}
						onclick={() => {
							onrun?.();
						}}>Run all</Button
					>
					<Button variant="secondary" onclick={oncopy}>Copy</Button>
				</div>
			</TabsContent>
			<TabsList class="grid grid-cols-2">
				<TabsTrigger value="problem">Problem</TabsTrigger>
				<TabsTrigger value="test">Test</TabsTrigger>
			</TabsList>
		</SidebarFooter>
	</Sidebar>
</Tabs>
