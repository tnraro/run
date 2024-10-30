<script lang="ts">
	import { Mutation } from '$lib/hooks/mutation.svelte';

	let a = new Mutation(async (mutation: number) => {
		await new Promise((r) => setTimeout(r, 1000));
		return mutation + 1;
	});
	let n = $state(0);
</script>

<button onclick={() => a.mutate(n++)}>click</button>

{#if a.isIdle}
	idle
{:else if a.isPending}
	loading...
{:else if a.isError}
	error: {a.error}
{:else}
	<p>
		{a.data}
	</p>
{/if}

<p>
	{n}
</p>
