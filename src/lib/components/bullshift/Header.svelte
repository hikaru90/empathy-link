<script lang="ts">
	import UserRoundCog from 'lucide-svelte/icons/user-round-cog';
	import Bell from 'lucide-svelte/icons/bell';
	import Minus from 'lucide-svelte/icons/minus';
	import Plus from 'lucide-svelte/icons/plus';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { m } from '$lib/translations';
	import { Button } from '$lib/components/ui/button';
	import LogOut from 'lucide-svelte/icons/log-out';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import { cn } from '$lib/utils';
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
</script>

<nav class={cn(absolute ? 'absolute' : 'absolute', 'left-0 top-0 flex w-full items-center justify-between p-4', className)}>
	<button
		class="flex size-8 items-center justify-center rounded-full bg-black"
		onclick={() => (userMenuIsOpen = true)}
	>
		<UserRoundCog class="size-3 text-white" />
	</button>
	<SparklePill class="w-8 h-4 shadow-md" />
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
			<div class="p-4 pb-24">
				<form action="/app/auth/logout" method="POST" class="w-full">
					<button type="submit" class="w-full">
						<Button
							wrapperClass="w-full"
							class="flex !h-10 w-full items-center justify-between gap-3 border-offwhite bg-red-500 text-red-100 data-[highlighted]:bg-red-200 data-[highlighted]:text-red-500"
						>
							{m.menu_profile_logout()}
							<LogOut class="size-3" /></Button
						>
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
