<script lang="ts">
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
	import ProblemTestcases from './problem-testcases.svelte';

	interface Props {
		url: string;
		title: string;
		content: string;
		testcases: {
			input: string;
			output: string;
			state: MutationState;
			receivedOutput?: string;
			time?: number;
		}[];
		onrun: (testcases: string[]) => void;
	}
	let { url, title, content, testcases, onrun }: Props = $props();
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
				<ProblemTestcases {testcases} />
			</TabsContent>
		</SidebarContent>
		<SidebarFooter>
			<TabsContent value="test">
				<div class="flex gap-1">
					<Button
						disabled={testcases.some((testcase) => testcase.state === MutationState.Pending)}
						onclick={() => {
							onrun(testcases.map(({ input }) => input));
						}}>Run all</Button
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
