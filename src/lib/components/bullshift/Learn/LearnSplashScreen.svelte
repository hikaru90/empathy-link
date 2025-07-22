<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	/**
	 * LearnSplashScreen Component
	 * 
	 * A reusable splash screen component for learn modules that shows a colored card
	 * with text and animates in/out with configurable timing.
	 * 
	 * @example
	 * <LearnSplashScreen 
	 *   color="#3B82F6" 
	 *   text="Zeit zu Atmen"
	 *   on:splashDone={() => console.log('Splash finished!')}
	 * />
	 */
	interface Props {
		/** Background color of the splash card */
		color?: string;
		/** Text to display in the splash card */
		text?: string;
		/** Delay before showing the splash (in milliseconds) */
		delay?: number;
		/** Total duration before hiding the splash (in milliseconds) */
		duration?: number;
	}

	let { color = '#6b7280', text = 'Zeit zu Atmen', delay = 50, duration = 2000 }: Props = $props();

	const dispatch = createEventDispatcher<{
		splashDone: void;
	}>();

	let splashScreen = $state(false);
	let splashDone = $state(false);

	let splashClass = $derived(() => {
		if (splashDone) {
			return 'opacity-0 scale-0 h-0';
		}
		if (splashScreen) {
			return 'opacity-100 scale-100';
		}
		return 'opacity-0 scale-50';
	});

	onMount(() => {
		setTimeout(() => {
			splashScreen = true;
		}, delay);
		
		setTimeout(() => {
			splashDone = true;
			dispatch('splashDone');
		}, duration);
	});
</script>

<div
	class="absolute inset-0 z-50 flex h-full flex-col items-center justify-center rounded-lg transition-all transform duration-1000 pointer-events-none {splashClass()}"
>
	<div
		style="background-color: {color}"
		class="flex size-52 flex-col items-center justify-center rounded-xl shadow-xl"
	>
		<div
			class="flex w-full flex-grow items-center justify-center rounded-xl border border-white/30"
		>
			<div class="text-xl font-bold">{text}</div>
		</div>
	</div>
</div> 