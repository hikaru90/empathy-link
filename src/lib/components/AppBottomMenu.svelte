<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Locale from '$lib/components/Locale.svelte';
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { m } from '$lib/translations';
	import * as Popover from '$lib/components/ui/popover';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { setCookie } from '$scripts/helpers';
	import { scroll } from '$store/page';
	import { goto } from '$app/navigation';
	import { debounce } from '$scripts/helpers'
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let navbarHeight = $state(96);
	let scrollValue = 0;
	let scrollingUp = false;

	let menuItems = $derived([
		{ label: m.page_home_nav() },
		{ label: m.page_contact_nav() }
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
	 class="fixed left-3 right-3 bottom-[72px] lg:bottom-[86px] z-[100] rounded-full p-2 backdrop-blur-lg backdrop-brightness-[0.3] shadow-xl shadow-black/20 dark:shadow-white/10 dark:shadow-2xl max-w-[1200px] mx-auto"
	 >
	 {@render children?.()}
</div>
