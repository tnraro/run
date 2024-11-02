<script lang="ts">
	import DiffView from '../p/[...url]/diff-view.svelte';

	let a = $state('a');
	let b = $state<string>();
</script>

<DiffView {a} {b} />
