<script>
	import { t } from '$lib/translations';
	import { Button as SparkleButton } from '$lib/components/ui/button-sparkle';
	import { Button } from '$lib/components/ui/button';
	import HeroAnimation from '$lib/components/HeroAnimation.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { scroll, windowWidth } from '$store/page';
	import MockupHero from '$lib/components/MockupHero.svelte';

	let animationWidth = 1000;

	const handleResize = () => {
		animationWidth = window?.document?.getElementById('animation')?.getBoundingClientRect()?.width;
		console.log('animationWidth', animationWidth);
	};
</script>

<div class="relative z-10 pt-20 lg:-mb-20 md:pt-32">
	<h1
		class="mb-10 max-w-[14em] font-display text-4xl font-semibold leading-[106%] md:text-5xl lg:text-7xl"
	>
		{$t('default.page.home.hero')}
	</h1>
	<a href="/app/auth/login">
		<SparkleButton
			class="px-3 py-5 font-bold text-black shadow-lg rounded-lg dark:shadow-gray-300/30 lg:px-6 lg:py-7 lg:text-lg"
		>
			{$t('default.page.home.cta')}
		</SparkleButton>
	</a>
	<div class="mt-20 flex items-center -mx-5 md:mx-0">
		<div class="hidden md:block md:size-32 lg:size-40 rounded-full bg-offwhite/40"></div>
		<div class="hidden md:block -ml-16 md:size-32 lg:size-40 rounded-full bg-offwhite"></div>
		<div
			style="background-image: url('/women.jpg')"
			class="md:-ml-16 h-52 md:h-32 lg:h-40 w-full md:w-[300px] lg:w-[500px] md:rounded-full bg-offwhite bg-cover bg-right md:bg-center"
		></div>
	</div>
	<MockupHero class="absolute top-64 md:top-72 lg:top-80 -right-4 lg:right-0 w-40 md:w-60 lg:w-96" />
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
