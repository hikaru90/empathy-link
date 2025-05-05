<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import Cross1 from 'svelte-radix/Cross1.svelte';
	import Exit from 'svelte-radix/Exit.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { enhance } from '$app/forms';
	import { Person } from 'radix-icons-svelte';
	import { t } from '$lib/translations';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import { toggleMode, mode } from 'mode-watcher';
	import * as Select from '$lib/components/ui/select/index.js';
	import { locale, locales } from '$lib/translations';
	import { setCookie } from '$scripts/helpers';
	import { user } from '$store/auth';
	import backgroundImage from '$assets/images/holo3.jpg';

	const langs = [
		{ value: 'en', label: 'English' },
		{ value: 'de', label: 'German' }
	];

	$: darkMode = $mode === 'dark';

	const handleSelect: (event: SelectedChangeEvent) => void = (event) => {
		if (event) {
			setCookie('locale', event.value);
			locale.update(() => event.value);
		}
	};
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder class="">
		<Button
			decoration="floating-op1"
			builders={[builder]}
			class="-mr-2 flex items-center justify-center border-neutral-200 bg-background p-1.5 text-sm text-neutral-800 transition hover:bg-offwhite dark:border-neutral-800 dark:bg-muted dark:text-white"
		>
			<Person class="h-4 w-4" />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="z-[1003] flex flex-col border-muted">
		<Sheet.Header
			class="flex flex-row items-center justify-between border-b border-black/10 px-5 py-2"
		>
			<Sheet.Title class="pt-0.5">{$t('default.menu.profile.sheet.header')}</Sheet.Title>
			<Sheet.Close class="!m-0">
				<Button
					decoration="floating-op1"
					class="-mr-2 flex items-center justify-center border-neutral-200 bg-background p-1.5 text-sm text-neutral-800 transition hover:bg-offwhite dark:border-neutral-800 dark:bg-muted dark:text-white"
				>
					<Cross1 class="size-4 text-red-600" />
				</Button>
			</Sheet.Close>
		</Sheet.Header>

		<div class="flex flex-grow flex-col justify-between p-5">
			<div>
				<div class="mb-3 border-b border-gray-300/60 pb-3 dark:border-gray-300/20">
					<Select.Root
						selected={langs.find((lang) => lang.value === $locale)}
						onSelectedChange={handleSelect}
					>
						<Select.Trigger class="">
							<Select.Value placeholder="Language" />
						</Select.Trigger>
						<Select.Content>
							{#each langs as lang}
								<Select.Item value={lang.value} label={lang.label}>{lang.label}</Select.Item>
							{/each}
						</Select.Content>
						<Select.Input name="favoriteFruit" />
					</Select.Root>
				</div>
				<div class="flex items-center space-x-2">
					<Switch
						id="lightMode"
						bind:checked={darkMode}
						on:click={toggleMode}
						class="bg-gray-500"
					/>
					<Label for="lightMode">Dark Mode</Label>
				</div>
			</div>
			<Sheet.Footer class="w-full">
				<div class="my-2 flex gap-4 px-6">
					<div class="relative flex items-center justify-center">
						<div
							class="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold uppercase tracking-[-0.12em] relative z-10"
						>
							{$user.firstName.charAt(0)}
							{$user.lastName.charAt(0)}
						</div>
						<div
							style="background-image: url('{backgroundImage}'); background-size: 400% 400%"
							class={'size-[36px] rounded-full bg-center absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0 shadow-lg'}
						></div>
					</div>
					<div class="flex flex-col">
						<div class="font-bold">
							{$user.firstName}
							{$user.lastName}
						</div>
						<div class="text-sm -mt-1">
							{$user.email}
						</div>
					</div>
				</div>

				<form action="/app/auth/logout" method="POST" class="w-full">
					<button type="submit" class="w-full">
						<Button
							wrapperClass="w-full"
							decoration="floating-op1"
							class="flex !h-10 w-full items-center justify-between gap-3 border-offwhite bg-orange-900 text-red-300 data-[highlighted]:bg-red-200 data-[highlighted]:text-red-500"
						>
							{$t('default.menu.profile.logout')}
							<Exit class="size-3" /></Button
						>
					</button>
				</form>


				<!-- <div class="break-all">
					{JSON.stringify($user)}
				</div> -->
			</Sheet.Footer>
		</div>
	</Sheet.Content>
</Sheet.Root>
