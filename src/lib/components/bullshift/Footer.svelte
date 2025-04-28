<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import { t } from '$lib/translations';
	import BotMessageSquare from 'lucide-svelte/icons/bot-message-square';
	import ChartColumnDecreasing from 'lucide-svelte/icons/chart-column-decreasing';
	import Book from 'lucide-svelte/icons/book';
	import Users from 'lucide-svelte/icons/users';
	import IconFolder from '$assets/icons/icon-folder.svg?raw';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let user;

	let menuItems = [
		{
			slug: 'chat',
			heading: 'Chat',
			path: '/bullshift/',
			icon: BotMessageSquare,
			available: true
		},
		{
			slug: 'stats',
			heading: 'Statistik',
			path: '/bullshift/stats',
			icon: ChartColumnDecreasing,
			available: true
		},
		{
			slug: 'learn',
			heading: 'Lernen',
			path: '/bullshift/learn',
			icon: Book,
			available: true
		},
		{
			slug: 'community',
			heading: 'Community',
			path: '/bullshift/community',
			icon: Users,
			available: true
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

<!-- <div class="inverted-border fixed bottom-0 left-0 w-full bg-black text-gray-200 px-4 pb-4 pt-2 z-[1002]"> -->
<div class="fixed bottom-0 left-0 z-[1002] w-full bg-white px-4 pb-4 pt-2 text-black">
	<img
		src="/inverted-border-white.svg"
		alt=""
		class="absolute left-0 top-0 w-7 -translate-y-full transform"
	/>
	<img
		src="/inverted-border-white.svg"
		alt=""
		class="absolute right-0 top-0 w-7 -translate-y-full -rotate-90 transform"
	/>
	<div class="absolute left-0 top-0 h-[0.5px] w-full -translate-y-full transform bg-white"></div>
	<div class="flex items-center justify-around">
		{#each menuItems as item}
			<div
				class="relative flex flex-col items-center justify-center {item.available
					? ''
					: 'opacity-40'} last:mr-2"
			>
				<a
					href={item.path}
					class="flex flex-col items-center justify-center {item.available
						? ''
						: 'pointer-events-none'}"
				>
					<div class="size-8 fill-black flex items-center justify-center">
						<svelte:component this={item.icon} class="size-5" />
					</div>
					<span class="text-2xs lg:mt-2 lg:text-xs">
						{item.heading}
					</span>
				</a>
				{#if $page.data.route.includes(item.path)}
					<div class="absolute -bottom-2 flex justify-center">
						<div class="h-1 w-1 rounded-full bg-bullshift"></div>
					</div>
				{/if}
				{#if !item.available}
					<div
						class="absolute bottom-2.5 left-1/3 translate-x-1/2 transform rounded-full bg-bullshift px-1 text-[6px]"
					>
						{$t('default.menu.soon')}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	// .inverted-border:before{
	//   @apply w-4 h-40 rounded-bl-full md:w-8 absolute -z-10 top-0 left-0 transform -translate-y-full pointer-events-none;
	//   content: '';
	//   box-shadow: 0 50px 0 0 black;
	// }
	// .inverted-border:after{
	//   @apply w-4 h-40 rounded-br-full md:w-8 absolute -z-10 top-0 right-0 transform -translate-y-full pointer-events-none;
	//   content: '';
	//   box-shadow: 0 50px 0 0 black;
	// }
	.inverted-border-white {
		@apply fill-white;
	}
</style>
