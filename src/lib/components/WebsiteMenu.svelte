<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { HamburgerMenu } from 'radix-icons-svelte';
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
	import { scroll, windowHeight, windowWidth } from '$store/page';

	let navbarHeight = 96;
	let scrollValue = 0;
	let scrollingUp = false;
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
		scrollToElement('scrollContainer', targetDiv, 400);
	};

	const handleScroll = (value) => {
		if (value > scrollValue) {
			// scrollingUp = false;
			scrollValue = value;
			return;
		}
		// scrollingUp = true;
		scrollValue = value;
	};
	scroll.subscribe((value) => {
		debounce(handleScroll(value), 300);
	});

	onMount(() => {});

	function handleMenuItemClick(item) {
		console.log('Clicked:', item);
	}
</script>

<div
	bind:clientHeight={navbarHeight}
	style="width:{$windowWidth}px;"
	class="fixed left-0 top-0 z-[100] border-b border-black/20 bg-offwhite shadow-xl shadow-offwhite/20"
>
	<div class="{!scrollingUp ? 'max-h-96' : 'max-h-0'} overflow-hidden transition-all">
		<nav
			class="flex items-center justify-between {$scroll > 5
				? 'bg-offwhite/10 backdrop-blur-2xl'
				: ''}  px-5 py-2 transition-all"
		>
			<a href="/" class="w-1 overflow-visible">
				<div>
					<Logo />
				</div>
			</a>
			<div class="hidden md:flex items-center gap-6">
				{#each menuItems() as item}
					<button on:click={scrollToTarget(item.target)} class="">
						{item.label}
					</button>
				{/each}
			</div>
			<div class="flex w-1 items-center justify-end gap-4">
				<Button on:click={() => goto('/app/auth/login')} variant="outline">
					{$t('default.page.login.heading')}
				</Button>
				<div>
					<HamburgerMenu class="size-6" />
				</div>
			</div>
		</nav>
	</div>
	<slot name="submenu" />
</div>
