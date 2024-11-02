<script lang="ts">
	import { AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { MutationState } from '$lib/hooks/mutation.svelte';
	import { Play, Trash2 } from 'lucide-svelte';
	import DiffView from './diff-view.svelte';
	import type { ITestcase } from './types';

	interface Props {
		testcase: ITestcase;
		onrun?: (testcases: string[]) => void;
		ondelete?: (id: string) => void;
	}
	let { testcase = $bindable(), onrun, ondelete }: Props = $props();
</script>

<AccordionItem>
	<AccordionTrigger>
		<div class="flex gap-1 w-full">
			<p>Test {testcase.id.slice(0, 7)}</p>
			<div class="flex-1"></div>
			{#if testcase.state === MutationState.Pending}
				<Badge variant="secondary">pending</Badge>
			{:else if testcase.state === MutationState.Success}
				<Badge>passed</Badge>
			{:else if testcase.state === MutationState.Error}
				<Badge variant="destructive">failed</Badge>
			{/if}
			{#if testcase.time != null}
				<Badge variant="secondary">{testcase.time}ms</Badge>
			{/if}
		</div>
	</AccordionTrigger>
	<AccordionContent>
		<div class="flex gap-1">
			<div class="flex-1"></div>
			<Button
				size="sm"
				onclick={() => {
					onrun?.([testcase.id]);
				}}><Play /></Button
			>
			<Button
				size="sm"
				variant="destructive"
				onclick={() => {
					ondelete?.(testcase.id);
				}}><Trash2 /></Button
			>
		</div>
		<Label for="testcase-input-{testcase.id}">Input</Label>
		<Textarea id="testcase-input-{testcase.id}" bind:value={testcase.input} />
		<Label>Output</Label>
		<DiffView bind:a={testcase.output} bind:b={testcase.receivedOutput} />
	</AccordionContent>
</AccordionItem>
