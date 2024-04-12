<script lang="ts">
	import { onMount } from 'svelte';
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { buttonVariants, type Props, type Events } from '.';
	import backgroundImage from '$assets/images/holo3.jpg';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export { className as class };

	const getRandomValue = (min, max) => {
		return Math.round(Math.random() * (max - min) + min);
	};

	const positions = [
		{ left: -30, top: -20, scale: 0.4 },
		{ left: 120, top: -10, scale: 0.6 },
		{ left: 40, top: 100, scale: 1 },
		{ left: -20, top: 110, scale: 0.8 },
		{ left: 110, top: 110, scale: 1.2 },
		{ left: 20, top: -60, scale: 1 },
		{ left: 60, top: -40, scale: 0.4 }
	];

	const delays: string[] = [
		'delay-0',
		'delay-75',
		'delay-300',
		'delay-500',
		'delay-700',
		'delay-1000',
		'delay-500'
	];
	const animationTimings: string[] = [
		'animation-duration: 500ms;animation-delay: 0ms;',
		'animation-duration: 700ms;animation-delay: 75ms;',
		'animation-duration: 1000ms;animation-delay: 300ms;',
		'animation-duration: 400ms;animation-delay: 500ms;',
		'animation-duration: 1500ms;animation-delay: 700ms;',
		'animation-duration: 2500ms;animation-delay: 200ms;',
		'animation-duration: 700ms;animation-delay: 75ms;'
	];
</script>

<ButtonPrimitive.Root
	{builders}
	style="background-image: url('{backgroundImage}'); background-size: 300% 300%;"
	class={cn(buttonVariants({ variant, size, className }), 'animate-bg-hover-fast group relative transform scale-100 hover:scale-105 transition')}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<div
		class="pointer-events-none absolute h-full w-full scale-95 transform opacity-0 transition group-hover:scale-100 group-hover:opacity-100"
	>
		{#each positions as star, index}
			<div
				class="absolute w-4 scale-0 fill-yellow-700 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100 dark:fill-yellow-100 {delays[
					index
				]}"
				style="left: {star.left}%;top: {star.top}%;transform: scale({star.scale})"
			>
				<svg
					viewBox="0 0 32 32"
					xmlns="http://www.w3.org/2000/svg"
					style="filter: drop-shadow(0 0 10px rgba(255,255,255,0.6));{animationTimings[index]}"
					class="-translate-x-50 -translate-y-50 animate-wobble transform"
					><path
						d="M16.451.68339c0,11.57088-3.857,15.42784-15.42785,15.42784,11.57088,0,15.42785,3.857,15.42785,15.42784,0-11.57088,3.857-15.42784,15.42785-15.42784C20.308,16.11123,16.451,12.25427,16.451.68339Z"
					/></svg
				>
			</div>
		{/each}
	</div>
	<slot />
</ButtonPrimitive.Root>

<style>
</style>
