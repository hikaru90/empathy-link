<script lang="ts">
	import backgroundImage from '$assets/images/holo3.jpg';
	import { m } from '$lib/translations';
	import IconFolder from '$assets/icons/icon-folder.svg?raw';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';
	import { get } from 'svelte/store';
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import Heart from '$assets/icons/heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';
	import SendHorizontal from 'lucide-svelte/icons/send-horizontal'
	import GradientImage from '$lib/components/GradientImage.svelte';

	let menuItems = $state([
		{
			slug: 'home',
			name: m.menu_bar_home(),
			path: '/app/dashboard',
			icon: IconFolder,
			available: true
		},
		{
			slug: 'selfempathy',
			name: m.menu_bar_selfempathy(),
			path: '/app/selfempathy',
			icon: IconSelf,
			available: false
		},
		{
			slug: 'fights',
			name: m.menu_bar_fights(),
			path: '/app/fights',
			icon: IconFight,
			available: true
		},
		{
			slug: 'feedback',
			name: m.menu_bar_feedback(),
			path: '/app/feedback',
			icon: IconFeedback,
			available: false
		},
		{
			slug: 'learn',
			name: m.menu_bar_learn(),
			path: '/app/learn',
			icon: IconLearn,
			available: false
		}
	]);
</script>

<div class="relative h-full w-full p-[1.2em]">
	<div class="pop-in">
		<div class="flex items-center justify-center">
			<!-- <div
				style="background-image: url('{backgroundImage}'); background-size: 300% 100%"
				class="animate-bg-fast flex h-[1em] w-[2em] flex-col items-center justify-center rounded-full shadow-lg"
			></div> -->
			<GradientImage class="w-10 h-4 rounded-full shadow-md" fast />
		</div>
	</div>

	<div class="relative flex h-full flex-col justify-between pb-[3.6em]">
		<div class="flex flex-col gap-px sm:gap-[0.5em]">
			<div class="step step1 h-[5em] w-full pr-4">
				<div class="bg-white/90 border border-white size-full shadow-lg rounded-[0.8em]"></div>
				<!-- <div class="w-[2em] fill-observation-foreground">
					{@html IconEye}
				</div> -->
			</div>
			<div class="step step2 h-[2em] w-full pl-4">
				<div class="bg-lilac/90 border border-lilac size-full shadow-lg rounded-[0.8em]"></div>
				<!-- <div class="w-[2em] fill-feelings-foreground">
					{@html IconHeart}
				</div> -->
			</div>
			<div class="step step3 h-[3em] w-full pr-4">
				<div class="bg-white/90 border border-white size-full shadow-lg rounded-[0.8em]"></div>
				<!-- <div class="w-[2em] fill-needs-foreground">
					{@html IconSwirl}
				</div> -->
			</div>
			<div class="step step4 h-[2em] w-full pl-4">
				<div class="bg-lilac/90 border border-lilac size-full shadow-lg rounded-[0.8em]"></div>
				<!-- <div class="w-[2em] fill-request-foreground">
					{@html IconSteps}
				</div> -->
			</div>
		</div>
		<div class="step5 flex items-center justify-center rounded-full px-[1em] py-[0.5em] shadow-lg mb-[0.5em]">
			<div class="flex w-full items-center justify-between fill-lilac">
				<div class="h-[0.5em] w-[3em] rounded bg-lilac"></div>
				<SendHorizontal class="text-purple-500 w-[2em]" />
			</div>
		</div>

		<div class="absolute flex h-full w-full items-center justify-center pb-[6em]">
			<div class="heart">
				<div class="w-[8em] fill-request-foreground">
					{@html Heart}
				</div>
			</div>
		</div>
	</div>

	<div
		class="fixed bottom-0 left-0 z-40 w-full rounded-b-[1em] bg-black px-[0.5em] py-[0.5em] text-gray-200"
	>
		<div class="">
			<img
				src="/inverted-border.svg"
				alt=""
				class="absolute left-[0.01em] top-[0.02em] w-[1.6em] -translate-y-full transform"
			/>
			<img
				src="/inverted-border.svg"
				alt=""
				class="absolute right-[0.13em] top-[0em] w-[1.6em] -translate-y-full -rotate-90 transform"
			/>
		</div>
		<div class="flex items-center justify-around">
			{#each menuItems as item}
				<div class="relative flex flex-col items-center justify-center">
					<a href={item.path} class="flex flex-col items-center justify-center">
						<div class="size-[1.4em] fill-white">
							{@html item.icon}
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.step {
		@apply flex items-center justify-center m-[0.3em];
	}
	:root {
		--duration: 6s;
	}
	.heart {
		animation: heart;
	}
	.step5 {
		animation: step5;
	}
	.step4 {
		animation: step4;
	}
	.step3 {
		animation: step3;
	}
	.step2 {
		animation: step2;
	}
	.step1 {
		animation: step1;
	}
	.step1,
	.step2,
	.step3,
	.step4,
	.step5,
	.heart {
		animation-duration: var(--duration);
		animation-iteration-count: infinite;
		animation-fill-mode: forwards;
		animation-timing-function: ease-out;
	}
	@keyframes heart {
		0%,
		65% {
			@apply opacity-0;
			transform: scale(0);
		}
		75%,
		90% {
			@apply opacity-100;
			transform: scale(1);
		}
		100% {
			@apply opacity-0;
			transform: scale(0);
		}
	}
	@keyframes step5 {
		0%,27% {
			@apply bg-black opacity-0;
			transform: scale(0);
		}
		35% {
			@apply bg-black opacity-100;
			transform: scale(1);
		}
		40% {
			@apply bg-black;
		}
		41% {
			@apply bg-slate-600;
		}
		42% {
			@apply bg-black;
		}
		55%,100% {
			@apply opacity-0;
		}
	}
	@keyframes step4 {
		0%,
		22.5% {
			transform: scale(0);
			opacity: 0;
		}
		30% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1);
			opacity: 1;
		}
		55%,
		100% {
			transform: scale(0);
			opacity: 0;
		}
	}
	@keyframes step3 {
		0%,
		17.5% {
			transform: scale(0);
			opacity: 0;
		}
		25% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1);
			opacity: 1;
		}
		55%,
		100% {
			transform: scale(0);
			opacity: 0;
		}
	}
	@keyframes step2 {
		0%,
		12.5% {
			transform: scale(0);
			opacity: 0;
		}
		20% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1);
			opacity: 1;
		}
		55%,
		100% {
			transform: scale(0);
			opacity: 0;
		}
	}
	@keyframes step1 {
		0%,
		10% {
			transform: scale(0);
			opacity: 0;
		}
		15% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1);
			opacity: 1;
		}
		55%,
		100% {
			transform: scale(0);
			opacity: 0;
		}
	}
	.pop-in {
		animation: popIn;
		animation-duration: var(--duration);
		animation-iteration-count: infinite;
		animation-fill-mode: forwards;
	}
	@keyframes popIn {
		0% {
			opacity: 0;
			transform: translate(0, 0);
		}
		10% {
			opacity: 1;
			transform: translate(0, 8em);
		}
		15% {
			opacity: 0;
			transform: translate(0, 8em);
		}
		55% {
			opacity: 0;
		}
		65% {
			opacity: 1;
		}
		70% {
			opacity: 0;
		}
		100% {
			opacity: 0;
			transform: translate(0, 8em);
		}
	}
</style>
