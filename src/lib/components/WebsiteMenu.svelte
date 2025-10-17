<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { m } from '$lib/translations';
	import { setCookie, scrollToElement } from '$scripts/helpers';
	import { goto } from '$app/navigation';
	import { scroll, windowHeight, windowWidth, backgroundColor, currentSection } from '$store/page';
	import { setLocale } from '$lib/translations';
	import Menu from 'lucide-svelte/icons/menu';
	import X from 'lucide-svelte/icons/x';
	import WebsiteHamburgerMenu from '$lib/components/WebsiteHamburgerMenu.svelte';
	import GradientImage from '$lib/components/GradientImage.svelte';

	interface Props {
		user: App.User;
	}

	let { user }: Props = $props();

	let lastScrollValue = 0;
	let menuIsVisible = $state(true);
	const scrollThreshold = 50;
	let scrollbarOffset = $state(16);
	let dialogOpen = $state(false);

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
		dialogOpen = false;
		const targetDiv = document.getElementById(target);
		if (targetDiv) {
			scrollToElement(targetDiv, 400);
		} else {
			console.warn(`Target element with id "${target}" not found`);
		}
		setTimeout(() => {
			menuIsVisible = true;
		}, 450);
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
	<div class="rounded-xl p-4">
		<div
			class="{menuIsVisible
				? 'max-h-96 translate-y-0 opacity-100'
				: 'max-h-0 -translate-y-20 opacity-0'} {$scroll > 5
				? 'shadow-xl shadow-black/5 delay-150'
				: ''} overflow-hidden rounded-2xl transition-all"
		>
			<nav
				class="{$scroll > 5
					? $backgroundColor / 95
					: 'bg-white-background/80'} flex items-center justify-between px-3.5 py-3 backdrop-blur-2xl backdrop-brightness-110 transition-all duration-500 lg:py-3 shadow-[inset_0_0_2px_0px_rgba(255,255,255,0.8)] rounded-2xl"
			>
				<button onclick={() => scrollToTarget('topTarget')} class="w-1 overflow-visible px-3">
					<div>
						<Logo />
					</div>
				</button>
				<div class="hidden items-center gap-7 lg:flex">
					{#each menuItems() as item}
						<button onclick={() => scrollToTarget(item.target)} class="group relative">
							<div
								class="relative z-10 {item.target === $currentSection
									? 'underline underline-offset-2'
									: ''}"
							>
								{item.label}
							</div>
						</button>
					{/each}
				</div>
				<div class="flex w-0 items-center justify-end gap-4">
					<a
						href="/app/auth/login"
						class="hidden bg-lilac font-bold text-black shadow-lg shadow-black/10 lg:block rounded-md border border-black/5"
					>
					<div class="shadow-inner shadow-white/20 px-5 py-2 rounded-md">
						{m.page_login_heading()}
					</div>
					</a>
					<div class="lg:hidden">
						<button onclick={() => {menuIsVisible = false;(dialogOpen = true)}} class="z-10 flex items-center">
							<Menu class="size-6" />
						</button>
					</div>
				</div>
			</nav>
		</div>
	</div>
	<!-- <slot name="submenu" /> -->
</div>
<div
	class="fixed bottom-0 left-0 right-0 top-0 z-[1003] transform bg-white {dialogOpen
		? 'pointer-events-auto scale-100 opacity-100'
		: 'pointer-events-none scale-90 opacity-0'} p-4 transition-all duration-200 flex flex-col"
>
	<div class="flex items-center justify-end">
		<button onclick={() => {menuIsVisible = true;(dialogOpen = false)}} class="z-10 flex items-center p-3.5">
			<X class="size-6" />
		</button>
	</div>
	<div class="flex flex-col justify-center gap-4 flex-grow">
		<div class="flex flex-col gap-4 flex-grow items-start p-4">
			{#each menuItems() as item, index}
				<button onclick={() => scrollToTarget(item.target)} class="group relative">
					<div
						class="transform transition-all duration-200 {dialogOpen
							? 'translate-y-0 opacity-100'
							: 'translate-y-10 opacity-0'} relative z-10 text-lg {item.target === $currentSection
							? 'underline underline-offset-2'
							: ''}"
						style="transition-delay: {index * 100}ms;"
					>
						{item.label}
					</div>
				</button>
			{/each}
		</div>

		<a href="/app/auth/login" class="flex p-4">
			<GradientImage
				class="rounded-lg bg-lilac p-3 font-bold text-black shadow-lg dark:shadow-gray-300/30 md:rounded-xl lg:px-7 lg:py-5 lg:text-lg"
			>
				<div class="relative z-10">
					{m.page_login_heading()}
				</div>
			</GradientImage>
		</a>
	</div>
</div>
