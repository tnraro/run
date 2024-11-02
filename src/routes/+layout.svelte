<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	let { children } = $props();
</script>

<Toaster richColors position="top-center" />
<ModeWatcher />

{@render children()}
