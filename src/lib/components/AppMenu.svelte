<script lang="ts">
  import { Button } from '$lib/components/ui/button-op1/index.js';
	import { t } from '$lib/translations';
	import IconFolder from '$assets/icons/icon-folder.svg?raw';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	interface Props {
		user: any;
	}

	let { user }: Props = $props();

	let menuItems = $state([
		{
			slug: 'home',
			name: get(t)('default.menu.bar.home'),
			path: '/app/dashboard',
			icon: IconFolder,
			available: true
		},
		{
			slug: 'selfempathy',
			name: get(t)('default.menu.bar.selfempathy'),
			path: '/app/selfempathy',
			icon: IconSelf,
			available: true
		},
		{
			slug: 'fights',
			name: get(t)('default.menu.bar.fights'),
			path: '/app/fights',
			icon: IconFight,
			available: true
		},
		{
			slug: 'feedback',
			name: get(t)('default.menu.bar.feedback'),
			path: '/app/feedback',
			icon: IconFeedback,
			available: false
		},
		{
			slug: 'learn',
			name: get(t)('default.menu.bar.learn'),
			path: '/app/learn',
			icon: IconLearn,
			available: false
		}
	]);

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
<div class="fixed bottom-0 left-0 z-[1002] w-full bg-black px-4 pb-4 pt-2 text-gray-200">
  {#if !user}
	<div class="w-full h-full bg-black/60 absolute top-0 left-0 z-10 flex items-center justify-center">
    <Button onclick={() => goto('/app/auth/register')} decoration="dark-op1" class="border-neutral-700">
      {$t('default.page.register.text')}
    </Button>
  </div>
{/if}
	<img
		src="/inverted-border.svg"
		alt=""
		class="absolute left-0 top-0 w-5 -translate-y-full transform"
	/>
	<img
		src="/inverted-border.svg"
		alt=""
		class="absolute right-0 top-0 w-5 -translate-y-full -rotate-90 transform"
	/>
	<div class="absolute left-0 top-0 h-[0.5px] w-full -translate-y-full transform bg-black"></div>
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
					<div class="h-6 w-6 fill-white">
						{@html item.icon}
					</div>
					<span class="text-2xs lg:mt-2 lg:text-xs">
						{item.name}
					</span>
				</a>
				{#if $page.data.route.includes(item.path)}
					<div class="absolute -bottom-2 flex justify-center">
						<div class="h-1 w-1 rounded-full bg-neon"></div>
					</div>
				{/if}
				{#if !item.available}
					<div
						class="absolute bottom-2.5 left-1/3 translate-x-1/2 transform rounded-full bg-red-600 px-1 text-[6px]"
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
</style>
