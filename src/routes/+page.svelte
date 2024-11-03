<script lang="ts">
	import {
		FormButton,
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Search } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { searchSchema } from './search/schema';
	import { storable } from '$lib/hooks/storable';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(searchSchema)
	});

	const { form: formData, enhance } = form;

	const problems = storable<{ title: string; url: string }[]>('problems', () => []);
</script>

<main class="grid h-dvh items-center md:justify-center">
	<form method="POST" action="/search" class="md:w-96 space-y-8" use:enhance>
		<FormField {form} name="url">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Problem URL</FormLabel>
					<div class="flex gap-1">
						<Input type="search" {...props} bind:value={$formData.url} placeholder="Problem URL" />
						<FormButton><Search /></FormButton>
					</div>
				{/snippet}
			</FormControl>
			<FormDescription>Enter the problem URL</FormDescription>
			<FormFieldErrors />
		</FormField>
		<aside class="space-y-2">
			<h2 class="text-sm font-medium leading-none m-0">Recent Problems</h2>
			<ul class="overflow-y-auto overflow-x-hidden">
				{#each $problems as problem (problem.url)}
					<li class="flex flex-col"><a class="active:bg-accent active:text-accent-foreground relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none" href={problem.url}>{problem.title}</a></li>
				{/each}
			</ul>
		</aside>
	</form>
</main>
