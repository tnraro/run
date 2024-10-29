<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Sidebar,
		SidebarContent,
		SidebarFooter,
		SidebarHeader
	} from '$lib/components/ui/sidebar';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import type { PsProblem } from '$lib/server/ps/ps-adapter';
	import ProblemDescription from './problem-description.svelte';
	import ProblemTestcases from './problem-testcases.svelte';

	interface Props {
		problem: PsProblem;
	}
	let { problem }: Props = $props();
</script>

<Tabs value="problem">
	<Sidebar>
		<SidebarHeader>
			<h1><a href={problem.url} target="_blank" rel="noopener noreferrer">{problem.title}</a></h1>
		</SidebarHeader>
		<SidebarContent class="overflow-x-hidden">
			<TabsContent value="problem">
				<ProblemDescription {problem} />
			</TabsContent>
			<TabsContent value="test">
				<ProblemTestcases testcases={problem.testcases} />
			</TabsContent>
		</SidebarContent>
		<SidebarFooter>
			<TabsContent value="test">
				<div class="flex gap-1">
					<Button>Run all</Button>
					<Button variant="destructive">Stop</Button>
				</div>
			</TabsContent>
			<TabsList class="grid grid-cols-2">
				<TabsTrigger value="problem">Problem</TabsTrigger>
				<TabsTrigger value="test">Test</TabsTrigger>
			</TabsList>
		</SidebarFooter>
	</Sidebar>
</Tabs>
