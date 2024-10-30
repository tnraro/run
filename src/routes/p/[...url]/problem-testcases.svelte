<script lang="ts">
	import { Accordion } from '$lib/components/ui/accordion';
	import type { MutationState } from '$lib/hooks/mutation.svelte';
	import Testcase from './testcase.svelte';

	interface Props {
		testcases: {
			input: string;
			output: string;
			state: MutationState;
			receivedOutput?: string;
			time?: number;
		}[];
	}
	let { testcases }: Props = $props();
</script>

<Accordion type="multiple">
	{#each testcases as testcase}
		<Testcase {...testcase} />
	{/each}
</Accordion>
