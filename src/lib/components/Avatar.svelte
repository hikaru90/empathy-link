<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { enhance } from '$app/forms';
	import { Person } from 'radix-icons-svelte';
	import { t } from '$lib/translations';
	import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>


<Sheet.Root>
  <Sheet.Trigger asChild let:builder class="">
		<Button decoration="floating-op1" builders={[builder]} class="flex items-center justify-center px-1.5 text-sm bg-background text-neutral-800 border-neutral-200 hover:bg-offwhite transition -mr-2">
			<Person class="h-4 w-4" />
	</Button>
  </Sheet.Trigger>
  <Sheet.Content side="right" class="z-[1003]">
    <Sheet.Header>
      <Sheet.Title>Edit profile</Sheet.Title>
      <Sheet.Description>
        Make changes to your profile here. Click save when you're done.
      </Sheet.Description>
    </Sheet.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-right">Name</Label>
        <Input id="name" value="Pedro Duarte" class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="username" class="text-right">Username</Label>
        <Input id="username" value="@peduarte" class="col-span-3" />
      </div>
    </div>
    <Sheet.Footer>
      <Sheet.Close asChild let:builder>
        <Button builders={[builder]} type="submit">Save changes</Button>
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>

<!-- <DropdownMenu.Root preventScroll={false}>
	<DropdownMenu.Trigger class="-mr-2">
			<Button decoration="floating-op1" class="flex items-center justify-center px-1.5 text-sm bg-background text-neutral-800 border-neutral-200 hover:bg-offwhite transition">
					<Person class="h-4 w-4" />
			</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="bottom" class="mt-1 bg-background">
		<DropdownMenu.Group>
			<DropdownMenu.Label>{$t('default.menu.profile.account')}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<form action="/auth/logout" method="POST" class="w-full">
				<button type="submit" class="w-full">
					<DropdownMenu.Item
						class="text-red-500 data-[highlighted]:bg-red-200 data-[highlighted]:text-red-500"
						>{$t('default.menu.profile.logout')}</DropdownMenu.Item
					>
				</button>
			</form>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root> -->
