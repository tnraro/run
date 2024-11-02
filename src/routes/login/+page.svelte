<script lang="ts">
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema.js';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" action="?/{data.target}" use:enhance>
	<h1>{data.target}</h1>
	<FormField {form} name="username">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Username</FormLabel>
				<Input {...props} bind:value={$formData.username} />
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	<FormField {form} name="password">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Password</FormLabel>
				<Input type="password" {...props} bind:value={$formData.password} />
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	<FormButton>{data.target}</FormButton>
</form>
