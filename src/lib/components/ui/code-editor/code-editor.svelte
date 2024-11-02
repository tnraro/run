<script lang="ts">
	import { cpp } from '@codemirror/lang-cpp';
	import { gruvboxDark } from '@fsegurai/codemirror-theme-gruvbox-dark';
	import type { EditorView } from 'codemirror';
	import CodeMirror from 'svelte-codemirror-editor';

	interface Props {
		value?: string;
		onchange?: (value: string) => void;
		onready?: (view: EditorView) => void;
	}
	let { value = $bindable(), onchange, onready }: Props = $props();
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
	on:ready={(e) => onready?.(e.detail)}
	on:change={(e) => onchange?.(e.detail)}
/>
