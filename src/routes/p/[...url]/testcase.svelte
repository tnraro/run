<script lang="ts">
	import { AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Testcase } from '$lib/hooks/testcases.svelte';
	import { Play, Trash2 } from 'lucide-svelte';
	import DiffView from './diff-view.svelte';

	interface Props {
		testcase: Testcase;
		onrun?: (testcases: string[]) => void;
	}
	let { testcase, onrun }: Props = $props();
</script>

<AccordionItem>
	<AccordionTrigger>
		<div class="flex w-full gap-1">
			<p>Test {testcase.id.slice(0, 7)}</p>
			<div class="flex-1"></div>
			{#if testcase.isPending()}
				<Badge variant="secondary">pending</Badge>
			{:else if testcase.isSuccess()}
				<Badge>passed</Badge>
			{:else if testcase.isError()}
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
					testcase.delete();
				}}><Trash2 /></Button
			>
		</div>
		<Label for="testcase-input-{testcase.id}">Input</Label>
		<Textarea id="testcase-input-{testcase.id}" bind:value={testcase.input} />
		<Label>Output</Label>
		<DiffView bind:a={testcase.output} bind:b={testcase.receivedOutput} />
	</AccordionContent>
</AccordionItem>
