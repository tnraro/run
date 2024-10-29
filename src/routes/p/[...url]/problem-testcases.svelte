<script lang="ts">
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { cn } from '$lib/utils';
	import { Play, Square } from 'lucide-svelte';

	interface Props {
		testcases: {
			input: string;
			output: string;
			receivedOutput?: string;
			passed?: boolean;
		}[];
	}
	let { testcases }: Props = $props();
</script>

<Accordion type="multiple">
	{#each testcases as { input, output, receivedOutput, passed }, i}
		<AccordionItem
			class={cn({
				'bg-green-100': passed === true,
				'bg-red-100': passed === false
			})}
		>
			<AccordionTrigger>TC #{i + 1}</AccordionTrigger>
			<AccordionContent>
				<Label for="testcase-input-{i}">Input</Label>
				<Textarea id="testcase-input-{i}" value={input} />
				<Label for="testcase-output-{i}">Expected Output</Label>
				<Textarea id="testcase-output-{i}" value={output} />
				{#if receivedOutput}
					<Label for="testcase-received-output-{i}">Received Output</Label>
					<Textarea id="testcase-received-output-{i}" value={output} />
				{/if}
				<Button><Play /></Button>
				<Button variant="destructive"><Square /></Button>
			</AccordionContent>
		</AccordionItem>
	{/each}
</Accordion>
