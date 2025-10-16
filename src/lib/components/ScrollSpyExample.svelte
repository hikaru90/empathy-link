<script lang="ts">
	import { onMount } from 'svelte';
	import { setupVisibilityTracking } from '$scripts/helpers';
	import { checkVisibility } from '$lib/actions';

	// Cleanup function for manual tracking
	let cleanup: (() => void) | null = null;

	onMount(() => {
		// Method 1: Setup manual visibility tracking for all .checkVisibility elements
		// This finds all elements with the class and observes them
		cleanup = setupVisibilityTracking(undefined, 100, 0.2);

		return () => {
			cleanup?.();
		};
	});
</script>

<div class="space-y-96 p-8">
	<h1 class="text-4xl font-bold">ScrollSpy Examples</h1>

	<!-- Method 1: Using the class-based approach -->
	<section class="space-y-8">
		<h2 class="text-2xl font-bold">Method 1: Class-based tracking</h2>
		<p class="text-gray-600">Add the 'checkVisibility' class to any element</p>

		<div class="checkVisibility rounded-lg bg-blue-100 p-8 transition-all duration-700 opacity-0 translate-y-8 is-visible:opacity-100 is-visible:translate-y-0">
			<p class="text-lg font-semibold">I fade in when visible!</p>
			<p class="text-sm text-gray-600">Using class: checkVisibility</p>
		</div>

		<div class="checkVisibility rounded-lg bg-green-100 p-8 transition-all duration-700 opacity-0 -translate-x-8 is-visible:opacity-100 is-visible:translate-x-0">
			<p class="text-lg font-semibold">I slide in from the left!</p>
			<p class="text-sm text-gray-600">Using class: checkVisibility</p>
		</div>
	</section>

	<!-- Method 2: Using Svelte action -->
	<section class="space-y-8">
		<h2 class="text-2xl font-bold">Method 2: Svelte Action</h2>
		<p class="text-gray-600">Use the checkVisibility action directly</p>

		<div
			use:checkVisibility={{ offset: 100, threshold: 0.2 }}
			class="rounded-lg bg-purple-100 p-8 transition-all duration-700 opacity-0 scale-90 is-visible:opacity-100 is-visible:scale-100"
		>
			<p class="text-lg font-semibold">I scale up when visible!</p>
			<p class="text-sm text-gray-600">Using action: use:checkVisibility</p>
		</div>

		<div
			use:checkVisibility={{ offset: 50, threshold: 0.5, once: true }}
			class="rounded-lg bg-orange-100 p-8 transition-all duration-700 opacity-0 translate-y-8 is-visible:opacity-100 is-visible:translate-y-0"
		>
			<p class="text-lg font-semibold">I only animate once!</p>
			<p class="text-sm text-gray-600">Using action with once: true</p>
		</div>
	</section>

	<!-- More examples with different animations -->
	<section class="space-y-8">
		<h2 class="text-2xl font-bold">More Examples</h2>

		<div
			use:checkVisibility
			class="rounded-lg bg-pink-100 p-8 transition-all duration-1000 opacity-0 rotate-3 is-visible:opacity-100 is-visible:rotate-0"
		>
			<p class="text-lg font-semibold">I rotate into view!</p>
		</div>

		<div
			class="checkVisibility rounded-lg bg-yellow-100 p-8 transition-all duration-700 opacity-0 blur-sm is-visible:opacity-100 is-visible:blur-0"
		>
			<p class="text-lg font-semibold">I blur in!</p>
		</div>
	</section>
</div>

<style>
	/* You can also define custom CSS animations here */
	:global(.is-visible) {
		/* Global styles for visible elements */
	}
</style>
