<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { enhance } from '$app/forms';
	import { Person } from 'radix-icons-svelte';
	import { t } from '$lib/translations';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root class="w-8 h-8">
			<!-- <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" /> -->
			<Avatar.Fallback>
				<Person
					class="w-4 h-4 -m-1"
				/>
			</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="bottom" class="mt-1 bg-background">
		<DropdownMenu.Group>
			<DropdownMenu.Label>{$t('default.menu.profile.account')}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<form action="/auth/logout" method="POST" class="w-full">
				<button type="submit" class="w-full">
					<DropdownMenu.Item class="data-[highlighted]:bg-red-200 text-red-500 data-[highlighted]:text-red-500">{$t('default.menu.profile.logout')}</DropdownMenu.Item>
				</button>
			</form>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
