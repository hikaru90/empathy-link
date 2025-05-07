<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import SlidersVertical from 'lucide-svelte/icons/sliders-vertical'
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { t } from '$lib/translations';
	import { user } from '$store/auth';
	import * as Popover from '$lib/components/ui/popover';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { locale, locales } from '$lib/translations';
	import { setCookie } from '$scripts/helpers';
	import { scroll } from '$store/page';
	import { goto } from '$app/navigation';
	import { debounce } from '$scripts/helpers'
	interface Props {
		submenu?: import('svelte').Snippet;
	}

	let { submenu }: Props = $props();

	let navbarHeight = $state(96);
	let scrollValue = 0;
	let scrollingUp = $state(false);

	let menuItems = $derived([
		{ label: $t('default.page.home.nav') },
		{ label: $t('default.page.contact.nav') }
	]);

	const langs = [
		{ value: 'en', label: 'English' },
		{ value: 'de', label: 'German' }
	];

	const handleSelect: (event: SelectedChangeEvent) => void = (event) => {
		if (event) {
			setCookie('locale', event.value);
			locale.update(() => event.value);
		}
	};

	const handleScroll = (value) => {
			if (value > scrollValue) {
				scrollingUp = false;
				scrollValue = value;
				return;
			}
			scrollingUp = true;
			scrollValue = value;
	}
	scroll.subscribe((value) => {
		debounce(handleScroll(value), 300);
	});

	onMount(() => {});

	function handleMenuItemClick(item) {
		console.log('Clicked:', item);
	}
</script>

<!-- <div style="height: {navbarHeight}px" class="flex-shrink-0"></div> -->
<div
	bind:clientHeight={navbarHeight}
	class="fixed left-0 top-0 z-[100] w-full border-b border-black/20 bg-offwhite shadow-xl shadow-offwhite/20"
>
	<div class="{scrollingUp ? 'max-h-96' : 'max-h-0'} transition-all overflow-hidden">
		<nav
			class="flex items-center justify-between {$scroll > 5
				? 'bg-offwhite/10 backdrop-blur-2xl'
				: ''}  px-5 py-2 transition-all"
		>
			<a href="/" class="">
				<Logo />
			</a>
			<div class="flex items-center gap-4">
				<Popover.Root>
					<Popover.Trigger>
						<SlidersVertical class="h-5 w-5" />
					</Popover.Trigger>
					<Popover.Content class="mt-[10px] w-40 bg-background">
						<div class="mb-3 border-b border-gray-300/60 pb-3 dark:border-gray-300/20">
							<Select.Root
								selected={langs.find((lang) => lang.value === $locale)}
								onSelectedChange={handleSelect}
							>
								<Select.Trigger class="">
									<Select.Value placeholder="Language" />
								</Select.Trigger>
								<Select.Content>
									{#each langs as lang}
										<Select.Item value={lang.value} label={lang.label}>{lang.label}</Select.Item>
									{/each}
								</Select.Content>
								<Select.Input name="favoriteFruit" />
							</Select.Root>
						</div>
					</Popover.Content>
				</Popover.Root>
				{#if $user}
					<div class="">
						<Avatar />
					</div>
				{:else}
					<Button onclick={() => goto('/app/auth/login')} variant="outline">
						{$t('default.page.login.heading')}
					</Button>
				{/if}
			</div>
		</nav>
	</div>
	{@render submenu?.()}
</div>
