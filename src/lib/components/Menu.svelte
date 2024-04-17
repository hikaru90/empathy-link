<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { MixerVertical } from 'radix-icons-svelte';
	import { toggleMode, mode } from 'mode-watcher';
	import Locale from '$lib/components/Locale.svelte';
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

	let navbarHeight = 56;

	// Define component properties
	$: menuItems = [
		{ label: $t('default.page.home.nav') },
		{ label: $t('default.page.contact.nav') }
	];

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

	$: darkMode = $mode === 'dark';

	// Define any component functions or lifecycle hooks
	onMount(() => {
		// Any initialization logic can go here
	});

	// Define any other component-specific functions
	function handleMenuItemClick(item) {
		// Handle click event for menu items
		console.log('Clicked:', item);
	}
</script>

<!-- Component HTML structure -->
<div style="height: {navbarHeight}px" class="flex-shrink-0"></div>
<div bind:clientHeight={navbarHeight} class="fixed left-0 top-0 z-20 w-full">
	<!-- <div bind:clientHeight={navbarHeight} class="fixed left-0 top-0 z-20 w-full py-4 px-4"> -->
	<!-- <nav
		class="flex items-center justify-between px-2 py-2 bg-muted/60 backdrop-blur-xl backdrop-brightness-110 backdrop-hue-rotate-180 rounded-full"
	> -->
	<nav
		class="flex items-center justify-between {$scroll > 50
			? 'bg-offwhite/10 backdrop-blur-2xl'
			: ''}  px-5 py-2 transition-all"
	>
		<a href="/" class="">
			<Logo />
		</a>
		<div class="flex items-center gap-4">
			<Popover.Root>
				<Popover.Trigger>
					<MixerVertical class="h-5 w-5" />
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
					<div class="flex items-center space-x-2">
						<Switch id="lightMode" bind:checked={darkMode} on:click={toggleMode} />
						<Label for="lightMode">Dark Mode</Label>
					</div>
				</Popover.Content>
			</Popover.Root>
			{#if $user}
				<div class="">
					<Avatar />
				</div>
			{/if}
		</div>
		<!-- <div class="flex items-center gap-4">
		<Locale />
    <Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
		<div class="hidden items-center gap-4 lg:flex">
			{#each menuItems as item}
				<button on:click={() => handleMenuItemClick(item)}>{item.label}</button>
			{/each}
		</div>
	</div> -->
	</nav>
</div>
