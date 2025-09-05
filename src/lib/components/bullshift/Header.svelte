<script lang="ts">
	import UserRoundCog from 'lucide-svelte/icons/user-round-cog';
	import RotateCcwSquare from 'lucide-svelte/icons/rotate-ccw-square';
	import Bell from 'lucide-svelte/icons/bell';
	import Minus from 'lucide-svelte/icons/minus';
	import Plus from 'lucide-svelte/icons/plus';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { m } from '$lib/translations';
	import { Button } from '$lib/components/ui/button';
	import LogOut from 'lucide-svelte/icons/log-out';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import { cn } from '$lib/utils';
	import ChartColumnDecreasing from 'lucide-svelte/icons/chart-column-decreasing';
	import FileCog from 'lucide-svelte/icons/file-cog';
	import Megaphone from 'lucide-svelte/icons/megaphone';
	import Calendar from 'lucide-svelte/icons/calendar';
	import Inbox from '$lib/components/Inbox.svelte';
	import { onMount } from 'svelte';

	interface Props {
		absolute?: boolean;
		class?: string;
		user: any;
	}

	let { absolute = false, class: className, user }: Props = $props();

	let unreadCount = $state(0);
	let isOpen = $state(false);
	let userMenuIsOpen = $state(false);

	async function fetchUnreadCount() {
		try {
			const response = await fetch('/api/messages?unread=true&perPage=1');
			if (response.ok) {
				const data = await response.json();
				unreadCount = data.unreadCount;
			}
		} catch (error) {
			console.error('Failed to fetch unread count:', error);
		}
	}

	onMount(() => {
		fetchUnreadCount();
		
		// Refresh unread count every 5 minutes
		const interval = setInterval(fetchUnreadCount, 5 * 60 * 1000);
		
		return () => clearInterval(interval);
	});

	function restartOnboarding() {
		console.log('Restarting onboarding...');

		try {
			// Set localStorage to false to restart onboarding
			localStorage.setItem('bullshiftOnboardingCompleted', 'false');

			// Debug: check if localStorage was set
			console.log(
				'localStorage set, current value:',
				localStorage.getItem('bullshiftOnboardingCompleted')
			);
		} catch (error) {
			console.error('Error setting localStorage:', error);
		}

		// Close the user menu
		userMenuIsOpen = false;

		// Reload the page to restart onboarding
		window.location.reload();
	}
</script>

<nav
	class={cn(
		absolute ? 'absolute' : 'absolute',
		'left-0 top-0 flex w-full items-center justify-between p-4',
		className
	)}
>
	<button
		class="flex size-8 items-center justify-center rounded-full bg-black"
		onclick={() => (userMenuIsOpen = true)}
	>
		<UserRoundCog class="size-3 text-white" />
	</button>
	<SparklePill class="h-4 w-8 shadow-md" />
	<!-- <img src="/bullshift/bullshift-logo.svg" alt="Bullshift Logo" class="h-5" /> -->
	<button
		class="relative flex size-8 items-center justify-center rounded-full bg-black"
		onclick={() => (isOpen = true)}
	>
		<Bell class="size-3 text-white" />
		{#if unreadCount > 0}
			<div
				class="absolute right-1 top-1 flex size-4 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-bullshift text-2xs text-white font-bold"
			>
				{unreadCount > 9 ? '9+' : unreadCount}
			</div>
		{/if}
	</button>
</nav>
<!-- user menu -->
<Drawer.Root bind:open={userMenuIsOpen}>
	<Drawer.Content class="bottom-0">
		<div class="mx-auto w-full max-w-sm">
			<Drawer.Header class="mt-4">
				<Drawer.Title>Nutzer</Drawer.Title>
				{#if user}
					<div class="text-sm text-muted-foreground">{user.email}</div>
				{/if}
			</Drawer.Header>
			<div class="flex flex-col gap-2 p-4 pb-24">
				<a
						href="/settings"
						class="flex items-center justify-between rounded-full border border-white/30 bg-offwhite px-3 py-1.5 text-left text-sm shadow-md shadow-black/5"
					>
						Chat-Einstellungen
						<FileCog class="size-4" />
					</a>
				<button
					class="flex items-center justify-between rounded-full border border-white/30 bg-offwhite px-3 py-1.5 text-sm shadow-md shadow-black/5"
					onclick={restartOnboarding}
				>
					Onboarding erneut starten
					<RotateCcwSquare class="size-4" />
				</button>
				{#if user.role === 'admin'}
					<a
						href="/bullshift/backend"
						class="flex items-center justify-between rounded-full border border-white/30 bg-offwhite px-3 py-1.5 text-left text-sm shadow-md shadow-black/5"
					>
						Backend
						<ChartColumnDecreasing class="size-4" />
					</a>
					<a
						href="/bullshift/admin/messages"
						class="flex items-center justify-between rounded-full border border-white/30 bg-offwhite px-3 py-1.5 text-left text-sm shadow-md shadow-black/5"
					>
						Nachrichten-Admin
						<Megaphone class="size-4" />
					</a>
				{/if}
				<form action="/app/auth/logout" method="POST" class="w-full">
					<button
						type="submit"
						class="flex w-full items-center justify-between rounded-full bg-black px-3 py-1.5 text-sm text-white shadow-md shadow-black/5"
					>
						{m.menu_profile_logout()}
						<LogOut class="size-4 text-red-600" />
					</button>
				</form>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>

<!-- notifications menu -->
<Drawer.Root bind:open={isOpen}>
	<Drawer.Content class="bottom-0 h-[80vh]">
		<div class="mx-auto w-full max-w-2xl h-full flex flex-col">
			<Drawer.Header class="mt-4 flex-shrink-0">
				<Drawer.Title>Nachrichten</Drawer.Title>
			</Drawer.Header>
			<div class="flex-1 overflow-hidden">
				<Inbox />
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
