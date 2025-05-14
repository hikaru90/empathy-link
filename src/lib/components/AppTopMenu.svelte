<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import Locale from '$lib/components/Locale.svelte';
	import { onMount } from 'svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import { t } from '$lib/translations';
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
		user: App.User;
		submenu?: import('svelte').Snippet;
	}

	let { submenu, user }: Props = $props();

	let navbarHeight = $state(96);
	let scrollValue = 0;
	let scrollingUp = false;

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


	// const handleScroll = (value) => {
	// 		if (value > scrollValue) {
	// 			scrollingUp = false;
	// 			scrollValue = value;
	// 			return;
	// 		}
	// 		scrollingUp = true;
	// 		scrollValue = value;
	// }
	// scroll.subscribe((value) => {
	// 	debounce(handleScroll(value), 300);
	// });

	onMount(() => {});

	function handleMenuItemClick(item) {
		console.log('Clicked:', item);
	}
</script>

<!-- <div style="height: {navbarHeight}px" class="flex-shrink-0"></div> -->
<div
	bind:clientHeight={navbarHeight}
	class="left-0 top-0 z-[100] w-full border-b border-black/10"
>
		<nav
			class="flex items-center justify-between px-5 py-2 transition-all"
		>
			<a href="/" class="">
				<Logo simplified />
			</a>
			<div class="flex items-center gap-4">
				{#if user}
					<div class="">
						<Avatar user={user} />
					</div>
				{:else}
					<Button onclick={() => goto('/app/auth/login')} decoration="op1" class="dark:text-white">
						{$t('default.page.login.heading')}
					</Button>
				{/if}
			</div>
		</nav>
	{@render submenu?.()}
</div>
