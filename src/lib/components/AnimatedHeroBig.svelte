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

<div class="relative z-10 flex h-svh flex-col pt-20 md:pt-32">
	<div class="flex-grow flex flex-col justify-center">
		<h1
			class="mb-10 max-w-[14em] font-display text-4xl font-semibold leading-[106%] md:text-5xl lg:text-7xl"
		>
			{$t('default.page.home.hero')}
		</h1>
		<a href="/app/auth/login">
			<SparkleButton
				class="rounded-lg px-3 py-5 font-bold text-black shadow-lg dark:shadow-gray-300/30 lg:px-6 lg:py-7 lg:text-lg"
			>
				{$t('default.page.home.cta')}
			</SparkleButton>
		</a>
	</div>
	<div class="relative md:mb-32 lg:mb-60">
		<div class="-mx-5 mt-20 flex items-center md:mx-0">
			<div class="hidden rounded-full bg-muted-dark/40 md:block md:size-32 lg:size-40"></div>
			<div class="-ml-16 hidden rounded-full bg-muted-dark md:block md:size-32 lg:size-40"></div>
			<div
				style="background-image: url('/women.jpg')"
				class="h-52 w-full bg-cover bg-right md:-ml-16 md:h-32 md:w-[300px] md:rounded-full md:bg-center lg:h-40 lg:w-[500px]"
			></div>
		</div>
		<MockupHero
			class="absolute -right-4 top-0 w-40 md:w-60 lg:right-0 lg:w-96 -mt-20"
		/>
	</div>
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
