<script lang="ts">
	import backgroundImage from '$assets/images/holo3.jpg';
	import { t } from '$lib/translations';
	import IconFolder from '$assets/icons/icon-folder.svg?raw';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';
	import { PaperPlane, HeartFilled } from 'radix-icons-svelte';

	let menuItems = [
		{
			slug: 'home',
			name: get(t)('default.menu.bar.home'),
			path: '/dashboard',
			icon: IconFolder,
			available: true
		},
		{
			slug: 'selfempathy',
			name: get(t)('default.menu.bar.selfempathy'),
			path: '/selfempathy',
			icon: IconSelf,
			available: false
		},
		{
			slug: 'fights',
			name: get(t)('default.menu.bar.fights'),
			path: '/fights',
			icon: IconFight,
			available: true
		},
		{
			slug: 'feedback',
			name: get(t)('default.menu.bar.feedback'),
			path: '/feedback',
			icon: IconFeedback,
			available: false
		},
		{
			slug: 'learn',
			name: get(t)('default.menu.bar.learn'),
			path: '/learn',
			icon: IconLearn,
			available: false
		}
	];
	t.subscribe((value) => {
		const newMenuItems = menuItems.map((entry) => {
			const translation = value(`default.menu.bar.${entry.slug}`);
			entry.name = translation;
			return entry;
		});
		menuItems = [...newMenuItems];
	});
</script>

<div class="relative h-full w-full bg-slate-800 p-2 sm:p-3 text-[3px] sm:text-base">
	<div class="absolute left-1/2 top-1.5 sm:top-3 transform -translate-x-1/2 -translate-y-1/2 w-5 sm:w-14 h-1.5 sm:h-4 bg-black rounded-full flex items-center justify-end px-[4px] pt-[2px]">
		<img src="phone-lens.jpg" alt="Phone Lens" class="w-1 h-1 sm:w-3 sm:h-3 rounded-full">
	</div>
	<div class="pop-in">
		<div class="flex items-center justify-center">
			<div
				style="background-image: url('{backgroundImage}'); background-size: 300% 100%"
				class="animate-bg-fast flex h-1 w-2 sm:h-3 sm:w-6 flex-col items-center justify-center rounded-md"
			>
				<!-- <div class="mt-1.5 flex items-center gap-1">
					<div class="h-1 w-1 rounded-full bg-white"></div>
					<div class="h-1 w-1 rounded-full bg-white"></div>
				</div>
				<div class="mt-0.5 h-[3px] w-1.5 rounded-b-full bg-black"></div> -->
			</div>
		</div>
	</div>

	<div class="relative flex h-full flex-col justify-between sm:pb-[50px]">
		<div class="flex flex-col gap-px sm:gap-1">
			<div
				class="step1 flex items-center justify-center rounded-sm bg-observation-background p-[0.3em] shadow-lg"
			>
				<div class="w-[2em] fill-observation-foreground">
					{@html IconEye}
				</div>
			</div>
			<div
				class="step2 flex items-center justify-center rounded-sm bg-feelings-background p-[0.3em] shadow-lg"
			>
				<div class="w-[2em] fill-feelings-foreground">
					{@html IconHeart}
				</div>
			</div>
			<div class="step3 flex items-center justify-center rounded-sm bg-needs-background p-[0.3em] shadow-lg">
				<div class="w-[2em] fill-needs-foreground">
					{@html IconSwirl}
				</div>
			</div>
			<div
				class="step4 flex items-center justify-center rounded-sm bg-request-background p-[0.3em] shadow-lg"
			>
				<div class="w-[2em] fill-request-foreground">
					{@html IconSteps}
				</div>
			</div>
		</div>
		<div class="step5 flex items-center justify-center rounded p-[0.2em] shadow-lg">
			<div class="flex w-full items-center justify-between fill-observation-foreground">
				<div class="h-[0.5em] w-[3em] rounded bg-slate-600"></div>
				<PaperPlane class="text-slate-500" />
			</div>
		</div>

		<div class="absolute w-full h-full flex items-center justify-center pb-16">
			<div class="heart">
				<HeartFilled class="w-[4em] h-[4em] text-red-400" />
			</div>
		</div>
	</div>

	<div class="fixed bottom-0 left-0 z-40 w-full bg-black px-1 sm:px-2 pb-1 sm:pb-4 pt-1 text-gray-200">
		<div class="absolute left-0 top-0 h-[0.5px] w-full -translate-y-full transform bg-black"></div>
		<div class="flex items-center justify-around">
			{#each menuItems as item}
				<div class="relative flex flex-col items-center justify-center">
					<a href={item.path} class="flex flex-col items-center justify-center">
						<div class="h-1.5 w-1.5 sm:h-3 sm:w-3 fill-white">
							{@html item.icon}
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
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
			transform: scale(0)
		}
		75%, 90%{
			@apply opacity-100;
			transform: scale(1)
		}
		100%{
			@apply opacity-0;
			transform: scale(0)
		}
	}
	@keyframes step5 {
		0%,
		27.5% {
			@apply bg-slate-700 opacity-0;
			transform: scale(0);
		}
		35% {
			@apply bg-slate-700 opacity-100;
			transform: scale(1);
		}
		40% {
			@apply bg-slate-700;
		}
		40.1% {
			@apply bg-white;
		}
		50% {
			@apply bg-slate-700;
		}
		55% {
			@apply opacity-0;
		}
		100% {
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
