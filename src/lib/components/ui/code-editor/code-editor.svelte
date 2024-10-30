<script lang="ts">
	import { cpp } from '@codemirror/lang-cpp';
	import { gruvboxDark } from '@fsegurai/codemirror-theme-gruvbox-dark';
	import { tick } from 'svelte';
	import CodeMirror from 'svelte-codemirror-editor';
	import template from './template.cpp?raw';

	interface Props {
		value?: string;
		onchange?: (value: string) => void;
	}
	let { value = $bindable(), onchange }: Props = $props();
</script>

<CodeMirror
	bind:value
	lang={cpp()}
	useTab={false}
	theme={gruvboxDark}
	lineWrapping={true}
	class="h-full"
	styles={{
		'&': {
			height: '100%'
		}
	}}
	on:ready={() => {
		tick().then(() => {
			if (value == null || value.trim().length === 0) value = template;
		});
	}}
	on:change={(e) => onchange?.(e.detail)}
/>
