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

<div class="relative h-full w-full bg-observation-background">
	<div
		class="absolute left-1/2 top-0.5 h-2.5 w-9 -translate-x-1/2 transform rounded-full bg-black"
	></div>
	<div class="pop-in">
		<div class="flex items-center justify-center">
			<div
				style="background-image: url('{backgroundImage}'); background-size: 300% 100%"
				class="animate-bg-fast rounded-md p-2 text-sm"
			>
				...
			</div>
		</div>
	</div>

	<div
		class="fixed bottom-0 left-0 z-40 w-full bg-black px-2 pb-4 pt-1 text-gray-200"
	>
		<div class="absolute left-0 top-0 h-[0.5px] w-full -translate-y-full transform bg-black"></div>
		<div class="flex items-center justify-around">
			{#each menuItems as item}
				<div class="relative flex flex-col items-center justify-center">
					<a href={item.path} class="flex flex-col items-center justify-center">
						<div class="h-3 w-3 fill-white">
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
		--duration: 10s;
		--keyframe1: 10%;
	}
	.pop-in {
		animation: popIn;
		animation-duration: 3s;
		animation-iteration-count: infinite;
	}
	@keyframes popIn {
		0% {
			opacity: 0;
			transform: translate(0, 0);
		}
		100% {
			opacity: 1;
			transform: translate(0, 100px);
		}
	}
</style>
