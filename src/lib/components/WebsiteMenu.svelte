<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { m } from '$lib/translations';
	import { setCookie, scrollToElement } from '$scripts/helpers';
	import { goto } from '$app/navigation';
	import { scroll, windowHeight, windowWidth, backgroundColor, currentSection } from '$store/page';
	import WebsiteHamburgerMenu from '$lib/components/WebsiteHamburgerMenu.svelte';

	interface Props {
		user: App.User;
	}

	let { user }: Props = $props();

	let lastScrollValue = 0;
	let menuIsVisible = $state(true);
	const scrollThreshold = 50;
	let scrollbarOffset = $state(16);

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

	let scrollbarWidth = $derived(() => {
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
	});
	let menuItems = $derived(() => [
		{ label: m.menu_sections_the4steps(), target: 'stepsTarget' },
		{ label: m.menu_sections_modules(), target: 'modulesTarget' },
		{ label: m.menu_sections_selfempathy(), target: 'selfempathyTarget' },
		{ label: m.menu_sections_fight(), target: 'fightTarget' },
		{ label: m.menu_sections_feedback(), target: 'feedbackTarget' },
		{ label: m.menu_sections_learn(), target: 'learnTarget' }
	]);

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
				: 'bg-white-background'} flex items-center justify-between px-5 py-3 transition-all duration-500 lg:py-3"
		>
			<a href="/" class="w-1 overflow-visible">
				<div>
					<Logo />
				</div>
			</a>
			<div class="hidden items-center gap-7 lg:flex">
				{#each menuItems() as item}
					<button onclick={scrollToTarget(item.target)} class="group relative">
						<div
							class="shadow-x absolute -bottom-1 -left-3 -right-3 -top-1 z-0 rounded-md bg-white-background/30 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
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
				<a href="/app/auth/login" class="hidden lg:block px-5 py-2 rounded-md bg-black text-white">
					{m.page_login_heading()}
				</a>
				<div class="lg:hidden">
					<WebsiteHamburgerMenu user={user} menuItems={menuItems()} />
				</div>
			</div>
		</nav>
	</div>
	<!-- <slot name="submenu" /> -->
</div>
