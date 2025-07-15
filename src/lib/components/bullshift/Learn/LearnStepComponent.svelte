<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		pageIndex: number;
		blockIndex: number;
		totalSteps: number;
		children: any;
		onStepChange?: (step: number) => void;
	}

	let { pageIndex, blockIndex, totalSteps, children, onStepChange }: Props = $props();

</script>

<slot />