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

	interface Props {
		absolute?: boolean;
		class?: string;
		user: any;
	}

	let { absolute = false, class: className, user }: Props = $props();

	const notifications = [
		{
			id: 1,
			title: 'New message',
			message: 'You have a new message'
		}
	];

	let isOpen = $state(false);
	let userMenuIsOpen = $state(false);

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
		{#if notifications.length > 0}
			<div
				class="absolute right-1 top-1 flex size-3 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-bullshift text-xs text-white"
			></div>
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
	<Drawer.Content class="bottom-0">
		<div class="mx-auto w-full max-w-sm">
			<Drawer.Header class="mt-4">
				<Drawer.Title>Benachrichtigungen</Drawer.Title>
			</Drawer.Header>
			<div class="p-4 pb-24">
				{#each notifications as notification}
					<div class="flex flex-col items-center justify-between rounded-lg bg-black/10 px-4 py-2">
						<div class="text-sm font-medium">{notification.title}</div>
						<div class="text-sm text-muted-foreground">{notification.message}</div>
					</div>
				{/each}
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
