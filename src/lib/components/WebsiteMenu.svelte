<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
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
	import { setCookie, scrollToElement } from '$scripts/helpers';
	import { goto } from '$app/navigation';
	import { debounce } from '$scripts/helpers';
	import { scroll, windowHeight, windowWidth, backgroundColor, currentSection } from '$store/page';
	import backgroundImage from '$assets/images/holo3.jpg';
	import WebsiteHamburgerMenu from '$lib/components/WebsiteHamburgerMenu.svelte';

	let lastScrollValue = 0;
	let menuIsVisible = true;
	const scrollThreshold = 50;
	let scrollbarOffset = 16;

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
	$: scrollbarWidth = () => {
		const scrollDiv = document.createElement('div');

		// Apply styles to ensure it has a scrollbar
		scrollDiv.style.visibility = 'hidden';
		scrollDiv.style.overflow = 'scroll'; // Force a scrollbar
		scrollDiv.style.position = 'absolute'; // Remove from document flow
		scrollDiv.style.top = '-9999px'; // Position off-screen

		// Add a child div inside the scrollDiv
		scrollDiv.style.width = '100px';
		scrollDiv.style.height = '100px';
		document.body.appendChild(scrollDiv);

		const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

		// Remove the div after measuring
		document.body.removeChild(scrollDiv);

		scrollbarOffset = scrollbarWidth;
		return scrollbarWidth;
	};
	$: menuItems = () => [
		{ label: $t('default.menu.sections.the4steps'), target: 'stepsTarget' },
		{ label: $t('default.menu.sections.modules'), target: 'modulesTarget' },
		{ label: $t('default.menu.sections.selfempathy'), target: 'selfempathyTarget' },
		{ label: $t('default.menu.sections.fight'), target: 'fightTarget' },
		{ label: $t('default.menu.sections.feedback'), target: 'feedbackTarget' },
		{ label: $t('default.menu.sections.learn'), target: 'learnTarget' }
	];

	const scrollToTarget = (target) => {
		const targetDiv = document.getElementById(target);
		scrollToElement(targetDiv, 400);
	};

	const handleScroll = (value: number) => {
		if ($windowWidth > 768) {
			return;
		}
		console.log('scrollValue', value, 'lastScrollValue', lastScrollValue);
		if (value > lastScrollValue) {
			menuIsVisible = false;
		} else {
			menuIsVisible = true;
		}
		lastScrollValue = value;
	};

	onMount(() => {
		const unsubscribe = scroll.subscribe((value) => handleScroll(value));
		return unsubscribe;
	});

	function handleMenuItemClick(item) {
		console.log('Clicked:', item);
	}
</script>

<div style="width:{$windowWidth}px;" class="fixed left-0 top-0 z-[100]">
	<div
		class="{menuIsVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} {$scroll > 5
			? 'shadow-xl shadow-black/5 delay-150'
			: ''} overflow-hidden transition-all"
	>
		<nav
			class="{$scroll > 5
				? $backgroundColor
				: 'bg-white'} flex items-center justify-between px-5 py-3 transition-all duration-500 lg:py-3"
		>
			<a href="/" class="w-1 overflow-visible">
				<div>
					<Logo />
				</div>
			</a>
			<div class="hidden items-center gap-7 lg:flex">
				{#each menuItems() as item}
					<button on:click={scrollToTarget(item.target)} class="group relative">
						<div
							class="shadow-x absolute -bottom-1 -left-3 -right-3 -top-1 z-0 rounded-md bg-white/30 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
						></div>
						<div
							class="{item.target === $currentSection
								? 'opacity-100'
								: 'opacity-0'} absolute -bottom-1 -left-3 -right-3 -top-1 rounded-md bg-black/5 shadow-inner shadow-black/20 transition-opacity duration-300"
						></div>
						<div class="relative z-10">
							{item.label}
						</div>
					</button>
				{/each}
			</div>
			<div class="flex w-1 items-center justify-end gap-4">
				<Button on:click={() => goto('/app/auth/login')} variant="outline">
					{$t('default.page.login.heading')}
				</Button>
				<div class="lg:hidden">
					<WebsiteHamburgerMenu menuItems={menuItems()} />
				</div>
			</div>
		</nav>
	</div>
	<!-- <slot name="submenu" /> -->
</div>
