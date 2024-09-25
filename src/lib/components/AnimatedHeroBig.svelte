<script>
	import { t } from '$lib/translations';
	import { Button as SparkleButton } from '$lib/components/ui/button-sparkle';
	import { Button } from '$lib/components/ui/button';
	import HeroAnimation from '$lib/components/HeroAnimation.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { scroll, windowWidth } from '$store/page';

	let animationWidth = 1000;

	const handleResize = () => {
		animationWidth = window?.document?.getElementById('animation')?.getBoundingClientRect()?.width;
		console.log('animationWidth', animationWidth);
	};
</script>

<div class="relative z-10 pt-20 lg:-mb-20 lg:pt-32">
	<h1
		class="mb-10 max-w-[14em] font-display text-4xl font-semibold leading-[106%] md:text-5xl lg:text-7xl"
	>
		{$t('default.page.home.hero')}
	</h1>
	<a href="/app/auth/login">
		<SparkleButton
			class="px-3 py-5 font-bold text-black shadow-lg dark:shadow-gray-300/30 lg:px-6 lg:py-7 lg:text-lg"
		>
			{$t('default.page.home.cta')}
		</SparkleButton>
	</a>
	<div class="mt-20 flex items-center">
		<div class="size-52 rounded-full bg-offwhite/40"></div>
		<div class="-ml-16 size-52 rounded-full bg-offwhite"></div>
		<div
			style="background-image: url('/women.jpg')"
			class="-ml-16 h-52 w-[600px] rounded-full bg-offwhite bg-cover bg-center"
		></div>
	</div>
</div>

<!-- <div class="relative z-0 py-4 -mx-[40%] -mb-48 md:-mb-[20%] md:-mx-[10%]">
	<div id="animation" class="relative w-full lg:mb-40">
		<div
			style="border-radius: {animationWidth / 75}px;"
			class="absolute left-[45.05%] top-[15.5%] z-[60] h-[48.8%] w-[9.9%] skew-y-[32deg] transform overflow-hidden"
		>
			<HeroAnimation />
		</div>
		<img src="hero/phone_mobile.png" alt="" class="relative z-40 block w-full md:hidden" />
		<img src="hero/2phone.png" alt="" class="relative z-40 hidden w-full md:block" />
		<img
			src="hero/2phone_lit.png"
			alt=""
			class="animate-phone-pulse absolute left-0 top-0 z-50 hidden h-full w-full md:block"
		/>
		<img src="hero/icon1.png" alt="" class="absolute left-0 top-0 hidden h-full w-full md:block" />
		<img
			src="hero/icon1_lit.png"
			alt=""
			class="animate-icon1-pulse absolute left-0 top-0 hidden h-full w-full md:block"
		/>
		<img src="hero/icon2.png" alt="" class="absolute left-0 top-0 hidden h-full w-full md:block" />
		<img
			src="hero/icon2_lit.png"
			alt=""
			class="animate-icon2-pulse absolute left-0 top-0 hidden h-full w-full md:block"
		/>
		<img src="hero/icon4.png" alt="" class="absolute left-0 top-0 hidden h-full w-full md:block" />
		<img
			src="hero/icon4_lit.png"
			alt=""
			class="animate-icon4-pulse absolute left-0 top-0 hidden h-full w-full md:block"
		/>
		<img src="hero/icon3.png" alt="" class="absolute left-0 top-0 hidden h-full w-full md:block" />
		<img
			src="hero/icon3_lit.png"
			alt=""
			class="animate-icon3-pulse absolute left-0 top-0 hidden h-full w-full md:block"
		/>
	</div>
</div> -->

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
