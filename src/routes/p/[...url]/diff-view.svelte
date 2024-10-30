<script lang="ts">
	import { MergeView } from '@codemirror/merge';
	import { basicSetup, EditorView } from 'codemirror';
	import { EditorState } from '@codemirror/state';
	import { onDestroy, onMount } from 'svelte';

	interface Props {
		a?: string;
		b?: string;
		onready?: (view: MergeView) => void;
		onchangea?: (value: string) => void;
	}
	let { a = $bindable(), b = $bindable(), onready, onchangea }: Props = $props();

	let div: HTMLElement;
	let view: MergeView;

	$effect(() => {
		console.log(view, b);
		if (view == null) return;
		view.a.dispatch({
			changes: {
				from: 0,
				to: view.a.state.doc.length,
				insert: b
			}
		});
	});
	$effect(() => {
		if (view == null) return;
		view.b.dispatch({
			changes: {
				from: 0,
				to: view.b.state.doc.length,
				insert: a
			}
		});
	});

	onMount(() => {
		view = new MergeView({
			a: {
				doc: b,
				extensions: [basicSetup, EditorView.editable.of(false), EditorState.readOnly.of(true)]
			},
			b: {
				doc: a,
				extensions: [
					basicSetup,
					EditorState.transactionFilter.of((tr) => {
						if (tr.docChanged) {
							a = tr.newDoc.toString();
							onchangea?.(a);
						}
						return tr;
					})
				]
			},
			parent: div,
			revertControls: 'b-to-a',
			orientation: 'b-a'
		});
		onready?.(view);
	});
	onDestroy(() => {
		view?.destroy();
	});
</script>

<div bind:this={div}></div>
