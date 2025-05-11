<script lang="ts">
	import { t } from '$lib/translations';
	import BotMessageSquare from 'lucide-svelte/icons/bot-message-square';
	import ChartColumnDecreasing from 'lucide-svelte/icons/chart-column-decreasing';
	import Book from 'lucide-svelte/icons/book';
	import Users from 'lucide-svelte/icons/users';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	type MenuItem = {
		slug: string;
		heading: string;
		path: string;
		icon: typeof BotMessageSquare;
		available: boolean;
		name?: string;
	};

	let menuItems: MenuItem[] = $state([
		{
			slug: 'chat',
			heading: 'Chat',
			path: '/bullshift',
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
			available: false
		},
		{
			slug: 'community',
			heading: 'Community',
			path: '/bullshift/community',
			icon: Users,
			available: false
		}
	]);
	let footerVisible = false;

	const isCurrentRoute = (path: string) => {
		const sanitizedRoute = page.data.route.split('/')[2];
		if (!sanitizedRoute && path === '/bullshift') return true;
		return path.includes(sanitizedRoute);
	};

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
<div class="fixed bottom-0 left-0 z-[1000] w-full bg-offwhite px-4 pb-4 pt-2 text-black">
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
	<div class="absolute left-0 top-0 h-[0.5px] w-full -translate-y-full transform bg-offwhite"></div>
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
					<div class="size-8 flex items-center justify-center {isCurrentRoute(item.path) ? 'text-black' : 'text-black/60'}">
						<item.icon class="size-5" />
					</div>
					<span class="text-2xs lg:mt-2 lg:text-xs {isCurrentRoute(item.path) ? 'text-black' : 'text-black/60'}">
						{item.heading}
					</span>
				</a>
				{#if isCurrentRoute(item.path)}
					<div class="absolute -bottom-2 flex justify-center">
						<div class="h-1 w-1 rounded-full bg-black"></div>
					</div>
				{/if}
				{#if !item.available}
					<div
						class="absolute bottom-2.5 left-1/3 translate-x-1/2 transform rounded-full bg-red-400 px-1 text-[6px] text-white"
					>
						{$t('default.menu.soon')}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>