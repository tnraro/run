<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		FormButton,
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import {
		List,
		ListItem,
		ListItemButton,
		ListItemLink,
		ListLabel,
		ListUnorderedList
	} from '$lib/components/ui/list';
	import { clearLocalStorage } from '$lib/hooks/local';
	import { storable } from '$lib/hooks/storable';
	import { Search } from 'lucide-svelte';
	import Trash_2 from 'lucide-svelte/icons/trash-2';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { searchSchema } from './search/schema';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(searchSchema)
	});

	const { form: formData, enhance } = form;

	const problems = storable<{ id: string; title: string; url: string }[]>('problems', () => []);

	const playgrounds = storable<{ id: string; title: string; url: string }[]>(
		'playgrounds',
		() => []
	);
</script>

<main class="grid h-dvh items-center md:justify-center">
	<div class="space-y-16">
		<form method="POST" action="/search" class="space-y-8 md:w-96" use:enhance>
			<FormField {form} name="url">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>Problem URL</FormLabel>
						<div class="flex gap-1">
							<Input
								type="search"
								{...props}
								bind:value={$formData.url}
								placeholder="Problem URL"
							/>
							<FormButton><Search /></FormButton>
						</div>
					{/snippet}
				</FormControl>
				<FormDescription>Enter the problem URL</FormDescription>
				<FormFieldErrors />
			</FormField>
			{#if $problems.length > 0}
				<List>
					<ListLabel>Recent Problems</ListLabel>
					<ListUnorderedList>
						{#each $problems as problem (problem.url)}
							<ListItem>
								<ListItemLink href={problem.url}>{problem.title}</ListItemLink>
								<ListItemButton
									variant="secondary"
									size="icon"
									onclick={() => {
										$problems = $problems.filter((p) => p.id !== problem.id);
										clearLocalStorage(problem.id);
									}}><Trash_2 /></ListItemButton
								>
							</ListItem>
						{/each}
					</ListUnorderedList>
				</List>
			{/if}
		</form>
		<div class="flex flex-col gap-2">
			<Button
				onclick={() => {
					goto(`/pg/${crypto.randomUUID()}`);
				}}>Create new playground</Button
			>
			{#if $playgrounds.length > 0}
				<List>
					<ListLabel>Recent Playground</ListLabel>
					<ListUnorderedList>
						{#each $playgrounds as playground (playground.url)}
							<ListItem>
								<ListItemLink href={playground.url}>{playground.title}</ListItemLink>
								<ListItemButton
									variant="secondary"
									size="icon"
									onclick={() => {
										$playgrounds = $playgrounds.filter((p) => p.id !== playground.id);
										clearLocalStorage(playground.id);
									}}><Trash_2 /></ListItemButton
								>
							</ListItem>
						{/each}
					</ListUnorderedList>
				</List>
			{/if}
		</div>
	</div>
</main>
clearLocalStorage
