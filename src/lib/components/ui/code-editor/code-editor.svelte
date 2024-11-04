<script lang="ts">
	import type { RunnerLanguage } from '$lib/server/run';
	import { cpp } from '@codemirror/lang-cpp';
	import { javascript } from '@codemirror/lang-javascript';
	import { gruvboxDark } from '@fsegurai/codemirror-theme-gruvbox-dark';
	import type { EditorView } from 'codemirror';
	import CodeMirror from 'svelte-codemirror-editor';

	interface Props {
		lang?: RunnerLanguage;
		value?: string;
		onchange?: (value: string) => void;
		onready?: (view: EditorView) => void;
	}
	let { lang: language, value = $bindable(), onchange, onready }: Props = $props();

	let lang = $derived.by(() => {
		switch (language) {
			case 'js':
				return javascript();
			default:
				return cpp();
		}
	});
</script>

<CodeMirror
	bind:value
	{lang}
	useTab={false}
	theme={gruvboxDark}
	lineWrapping={true}
	class="h-full"
	styles={{
		'&': {
			height: '100%'
		}
	}}
	on:ready={(e) => onready?.(e.detail)}
	on:change={(e) => onchange?.(e.detail)}
/>
