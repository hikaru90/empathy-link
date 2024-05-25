<script>
	import { t } from '$lib/translations';
	import { Button as SparkleButton } from '$lib/components/ui/button-sparkle';
	import { Button } from '$lib/components/ui/button';
	import HeroAnimation from '$lib/components/HeroAnimation.svelte';
	import {onMount, onDestroy} from 'svelte'

	let animationWidth = 1000

	const handleResize = () => {
		animationWidth = window?.document?.getElementById('animation')?.getBoundingClientRect()?.width
		console.log('animationWidth',animationWidth);
	}

	onMount(() => {
		window.addEventListener('resize', handleResize)
		animationWidth = window?.document?.getElementById('animation')?.getBoundingClientRect()?.width
	})
	onDestroy(() => {
		window.removeEventListener('resize', handleResize)
	})
</script>

<div class="pt-10 lg:pt-32">
	<h1 class="mb-10 font-display text-3xl font-semibold leading-[106%] lg:text-7xl">
		{$t('default.page.home.hero')}
	</h1>
	<a href="/auth/login">
		<SparkleButton
			class="px-3 py-5 font-bold text-black shadow-lg dark:shadow-gray-300/30 lg:px-6 lg:py-7 lg:text-lg"
		>
			{$t('default.page.home.cta')}
		</SparkleButton>
	</a>
</div>

<div id="animation" class="relative mb-40 w-full">
		<div style="border-radius: {animationWidth/75}px;" class="absolute w-[9.9%] h-[50.8%] z-50 left-[44.6%] top-[19.5%] transform skew-y-[30deg] overflow-hidden">
			<HeroAnimation />
		</div>
	<img src="hero/1phone.png" alt="" class="relative z-40 w-full" />
	<img
		src="hero/1phone_lit.png"
		alt=""
		class="animate-phone-pulse absolute left-0 top-0 z-50 h-full w-full"
	/>
	<img src="hero/icon1.png" alt="" class="absolute left-0 top-0 h-full w-full" />
	<img
		src="hero/icon1_lit.png"
		alt=""
		class="animate-icon1-pulse absolute left-0 top-0 h-full w-full"
	/>
	<img src="hero/icon2.png" alt="" class="absolute left-0 top-0 h-full w-full" />
	<img
		src="hero/icon2_lit.png"
		alt=""
		class="animate-icon2-pulse absolute left-0 top-0 h-full w-full"
	/>
  <img src="hero/icon4.png" alt="" class="absolute left-0 top-0 h-full w-full" />
  <img
    src="hero/icon4_lit.png"
    alt=""
    class="animate-icon4-pulse absolute left-0 top-0 h-full w-full"
  />
	<img src="hero/icon3.png" alt="" class="absolute left-0 top-0 h-full w-full" />
	<img
		src="hero/icon3_lit.png"
		alt=""
		class="animate-icon3-pulse absolute left-0 top-0 h-full w-full"
	/>
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
