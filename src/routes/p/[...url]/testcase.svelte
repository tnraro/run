<script lang="ts">
	import { AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion';
	import { Badge } from '$lib/components/ui/badge';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { MutationState } from '$lib/hooks/mutation.svelte';
	import { hash } from '$lib/utils/hash';
	import { psTrim } from '$lib/utils/ps-trim';
	import DiffView from './diff-view.svelte';

	interface Props {
		input: string;
		output: string;
		state: MutationState;
		receivedOutput?: string;
		time?: number;
	}
	let { input, output, state: _state, receivedOutput, time }: Props = $props();

	let id = $derived(hash(psTrim(input)));
</script>

<AccordionItem>
	<AccordionTrigger>
		<div>
			Test {id}
			{#if _state === MutationState.Pending}
				<Badge>pending</Badge>
			{:else if _state === MutationState.Success}
				<Badge>passed</Badge>
			{:else if _state === MutationState.Error}
				<Badge variant="destructive">failed</Badge>
			{/if}
			{#if time != null}
				<Badge>{time}ms</Badge>
			{/if}
		</div>
	</AccordionTrigger>
	<AccordionContent>
		<Label for="testcase-input-{id}">Input</Label>
		<Textarea id="testcase-input-{id}" value={input} />
		<Label>Output</Label>
		<DiffView bind:a={output} bind:b={receivedOutput} />
	</AccordionContent>
</AccordionItem>
