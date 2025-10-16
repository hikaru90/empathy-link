<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { m } from '$lib/translations';
	import { setCookie, scrollToElement } from '$scripts/helpers';
	import { goto } from '$app/navigation';
	import { scroll, windowHeight, windowWidth, backgroundColor, currentSection } from '$store/page';
	import { setLocale } from '$lib/translations';
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

	const handleSelect = (event: any) => {
		if (event) {
			setCookie('locale', event.value);
			setLocale(event.value);
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
		{ label: m.menu_sections_selfempathy(), target: 'functionSectionTarget' },
		{ label: m.menu_sections_the4steps(), target: 'moduleSectionTarget' },
		{ label: m.menu_sections_fight(), target: 'privacySectionTarget' },
		{ label: m.menu_sections_learn(), target: 'aboutSectionTarget' },
		{ label: m.menu_sections_faq(), target: 'faqSectionTarget' }
	]);

	const scrollToTarget = (target: string) => {
		const targetDiv = document.getElementById(target);
		if (targetDiv) {
			scrollToElement(targetDiv, 400);
		} else {
			console.warn(`Target element with id "${target}" not found`);
		}
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
	<div class="p-4 rounded-xl">
		<div
			class="{menuIsVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} {$scroll > 5
				? 'shadow-xl shadow-black/5 delay-150'
				: ''} overflow-hidden transition-all rounded-2xl"
		>
			<nav
				class="{$scroll > 5
					? $backgroundColor/95
					: 'bg-white-background/80'} flex items-center justify-between px-3.5 py-3 transition-all duration-500 lg:py-3 backdrop-blur-2xl backdrop-brightness-110"
			>
				<button onclick={() => scrollToTarget('topTarget')} class="w-1 overflow-visible px-3">
					<div>
						<Logo />
					</div>
				</button>
				<div class="hidden items-center gap-7 lg:flex">
					{#each menuItems() as item}
						<button onclick={() => scrollToTarget(item.target)} class="group relative">
							<div class="relative z-10 {item.target === $currentSection ? 'underline underline-offset-2' : ''}">
								{item.label}
							</div>
						</button>
					{/each}
				</div>
				<div class="flex w-0 items-center justify-end gap-4">
					<a
						href="/app/auth/login"
						class="hidden rounded-md bg-lilac px-5 py-2 font-bold text-black lg:block shadow-lg shadow-black/10"
					>
						{m.page_login_heading()}
					</a>
					<div class="lg:hidden">
						<WebsiteHamburgerMenu {user} menuItems={menuItems()} />
					</div>
				</div>
			</nav>
		</div>
	</div>
	<!-- <slot name="submenu" /> -->
</div>
