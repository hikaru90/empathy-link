<script lang="ts">
	import { Settings, Bell, Minus, Plus } from 'lucide-svelte/icons';
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  const notifications = [
    {
      id: 1,
      title: 'New message',
      message: 'You have a new message',
    },
  ];
  let isOpen = false;
</script>

<nav class="flex items-center justify-between p-4 absolute top-0 left-0 w-full">
	<a href="/bullshift" class="flex size-8 items-center justify-center rounded-full bg-black">
    <Settings class="size-3 text-white" />
  </a>
  <img src="/bullshift/bullshift-logo.svg" alt="Bullshift Logo" class="h-5" />
  <button class="flex size-8 items-center justify-center rounded-full bg-black relative" on:click={() => isOpen = true}>
    <Bell class="size-3 text-white" />
    {#if notifications.length > 0 }
      <div class="absolute top-1 right-1 bg-bullshift text-white rounded-full text-xs size-3 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
        
      </div>
    {/if}
  </button>
</nav>
<Drawer.Root bind:open={isOpen}>
  <Drawer.Content class="bottom-0">
    <div class="mx-auto w-full max-w-sm">
      <Drawer.Header class="mt-4">
        <Drawer.Title>Benachrichtigungen</Drawer.Title>
      </Drawer.Header>
      <div class="p-4 pb-24">
        {#each notifications as notification}
          <div class="flex flex-col items-center justify-between bg-black/10 rounded-lg px-4 py-2">
            <div class="text-sm font-medium">{notification.title}</div>
            <div class="text-sm text-muted-foreground">{notification.message}</div>
          </div>
        {/each}
      </div>
    </div>
  </Drawer.Content>
</Drawer.Root>


