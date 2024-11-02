<script lang="ts">
	import { MergeView } from '@codemirror/merge';
	import { EditorState } from '@codemirror/state';
	import { EditorView } from 'codemirror';
	import { onDestroy, onMount } from 'svelte';
	import { diffViewSetup } from './diff-view-setup';

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
		const value = b;
		if (view == null) return;
		view.a.dispatch({
			changes: {
				from: 0,
				to: view.a.state.doc.length,
				insert: value
			}
		});
	});

	let aChangedByView = false;
	$effect(() => {
		const value = a;
		if (view == null || aChangedByView) return;
		aChangedByView = false;
		view.b.dispatch({
			changes: {
				from: 0,
				to: view.b.state.doc.length,
				insert: value
			}
		});
	});

	onMount(() => {
		view = new MergeView({
			a: {
				doc: b,
				extensions: [diffViewSetup(), EditorView.editable.of(false), EditorState.readOnly.of(true)]
			},
			b: {
				doc: a,
				extensions: [
					diffViewSetup(),
					EditorState.transactionFilter.of((tr) => {
						if (tr.docChanged) {
							aChangedByView = true;
							a = tr.newDoc.toString();
							onchangea?.(a);
						}
						return tr;
					})
				]
			},
			parent: div,
			orientation: 'b-a'
		});
		onready?.(view);
	});
	onDestroy(() => {
		view?.destroy();
	});
</script>

<div bind:this={div}></div>
