<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Search } from 'lucide-svelte';
	import { searchSchema, type SearchSchema } from './search/schema';
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		FormButton,
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(searchSchema)
	});

	const { form: formData, enhance } = form;
</script>

<main class="grid h-dvh items-center md:justify-center">
	<form method="POST" action="/search" class="md:w-96" use:enhance>
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
	</form>
</main>
