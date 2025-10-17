<script>
	import { m } from '$lib/translations';
	import { Button as SparkleButton } from '$lib/components/ui/button-sparkle';
	import { Button } from '$lib/components/ui/button';
	import HeroAnimation from '$lib/components/HeroAnimation.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { scroll, windowWidth } from '$store/page';
	import MockupHero from '$lib/components/MockupHero.svelte';
	import GradientImage from '$lib/components/GradientImage.svelte';

	let animationWidth = 1000;

	const handleResize = () => {
		animationWidth = window?.document?.getElementById('animation')?.getBoundingClientRect()?.width;
		console.log('animationWidth', animationWidth);
	};

	const colors = [
		// { colorName: 'forest', color: '#17545A', size: 200, x: 75, y: 25 },
		// { colorName: 'forest', color: '#17545A', size: 200, x: 75, y: 25 },
		// { colorName: 'rose', color: '#F0BADA', size: 100, x: 100, y: 0 },

		{ colorName: 'lilac', color: '#D8BEFF', size: 400, x: 0, y: 0 }
		// { colorName: 'orange', color: '#FF9C34', size: 400, x: 0, y: 0 },
	];
</script>

<div class="relative z-10 flex md:h-svh flex-col justify-center pt-32 md:pt-32 mb-24 md:mb-0">
	{#each colors as color}
		<div
			class="absolute z-0 size-full -translate-x-1/2 -translate-y-1/2 transform rounded-full opacity-25"
			style="width: {color.size}%; height: {color.size}%; left: {color.x}%; top: {color.y}%; background: radial-gradient(circle, {color.color} 0%, transparent 60%);"
		></div>
	{/each}

	<div class="flex flex-col md:flex-row">
		<div class="md:order-1 flex items-center justify-center mb-10 md:mb-0">
			<MockupHero class="w-52 md:w-60 lg:right-0 lg:w-96 -mb-4 md:mb-0" />
		</div>
		<div class="z-10 flex flex-grow flex-col justify-center">
			<h1 class="mb-10 font-display text-5xl font-semibold leading-[106%] md:text-7xl">
				{m.page_home_hero()}
				<span
					style="background-image: url('/women.jpg')"
					class="-mb-1 hidden md:inline-block h-[0.8em] w-[2.3em] rounded-full bg-cover bg-center"
				></span>
				{m.page_home_hero2()}
			</h1>
			<div class="mb-10 max-w-[30em] text-lg md:text-xl">
				{m.page_home_hero_subline()}
			</div>
			<a href="/app/auth/login" class="flex text-lg cursor-pointer">
					<GradientImage
						class="rounded-xl bg-lilac font-bold text-black shadow-lg dark:shadow-gray-300/30 border border-black/5"
					>
						<div class="relative z-10 shadow-inner shadow-white/20 px-6 py-4 lg:px-7 lg:py-5">
							{m.page_home_cta()}
						</div>
					</GradientImage>
			</a>
		</div>
	</div>

	<!-- <div class="relative md:mb-32 lg:mb-60">
		<div class="-mx-5 mt-20 flex items-center md:mx-0">
			<div class="hidden rounded-full bg-muted-dark/40 md:block md:size-32 lg:size-40"></div>
			<div class="-ml-16 hidden rounded-full bg-muted-dark md:block md:size-32 lg:size-40"></div>
			<div
				style="background-image: url('/women.jpg')"
				class="h-52 w-full bg-cover bg-right md:-ml-16 md:h-32 md:w-[300px] md:rounded-full md:bg-center lg:h-40 lg:w-[500px]"
			></div>
		</div>
		
	</div> -->
</div>

<style lang="scss">
	:global(.animate-icon4-pulse) {
		animation-name: phonePulse;
		animation-duration: 4s;
		animation-delay: 400ms;
		animation-timing-function: ease-in-out;
		animation-direction: alternate;
		animation-iteration-count: infinite;
	}
	:global(.animate-icon3-pulse) {
		animation-name: phonePulse;
		animation-duration: 4s;
		animation-timing-function: ease-in-out;
		animation-direction: alternate;
		animation-iteration-count: infinite;
	}
	:global(.animate-icon2-pulse) {
		animation-name: phonePulse;
		animation-duration: 3s;
		animation-timing-function: ease-in-out;
		animation-direction: alternate;
		animation-iteration-count: infinite;
	}
	:global(.animate-icon1-pulse) {
		animation-name: phonePulse;
		animation-duration: 2s;
		animation-timing-function: ease-in-out;
		animation-direction: alternate;
		animation-iteration-count: infinite;
	}
	:global(.animate-phone-pulse) {
		animation-name: phonePulse;
		animation-duration: 1s;
		animation-timing-function: ease-in-out;
		animation-direction: alternate;
		animation-iteration-count: infinite;
	}
	@keyframes phonePulse {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
