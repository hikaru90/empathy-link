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
			class="-mr-2 flex items-center justify-center border-neutral-200 dark:border-neutral-800 bg-background dark:bg-muted px-1.5 text-sm text-neutral-800 dark:text-white transition hover:bg-offwhite"
		>
			<Person class="h-4 w-4" />
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right" class="z-[1003] flex flex-col">
		<Sheet.Header
			class="flex flex-row items-center justify-between border-b border-black/10 px-5 py-3.5"
		>
			<Sheet.Title class="pt-0.5">{$t('default.menu.profile.sheet.header')}</Sheet.Title>
			<Sheet.Close class="!m-0">
				<div class="label bg-feelings-background">
					<div class="icon flex items-center justify-center fill-feelings-foreground">
						<!-- {@html row.icon} -->
						<Cross1 class="text-red-600" />
					</div>
				</div>
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
					<Switch id="lightMode" bind:checked={darkMode} on:click={toggleMode} class="bg-gray-500" />
					<Label for="lightMode">Dark Mode</Label>
				</div>
			</div>
			<Sheet.Footer class="w-full">
				<!-- <Sheet.Close asChild let:builder>
					<Button builders={[builder]} type="submit">Save changes</Button>
				</Sheet.Close> -->

				<form action="/app/auth/logout" method="POST" class="w-full">
					<button type="submit" class="w-full">
						<Button wrapperClass="w-full"
							decoration="floating-op1"
							class="flex w-full items-center gap-3 border-offwhite bg-orange-900 text-red-300 data-[highlighted]:bg-red-200 data-[highlighted]:text-red-500 justify-between !h-10"
							>
								{$t('default.menu.profile.logout')}
							 <Exit class="size-3" /></Button
						>
					</button>
				</form>
			</Sheet.Footer>
		</div>
	</Sheet.Content>
</Sheet.Root>

<style lang="scss">
	.label {
		box-shadow:
			0 0 8px 0 rgba(74, 0, 0, 0.3) inset,
			4px 4px 8px 0 rgba(0, 0, 0, 0.4);
		@apply relative h-7 w-7 flex-shrink-0 rounded-full border-2 border-offwhite;
	}
	.label:after {
		content: '';
		box-shadow: /*inset 0 0 4px rgba(0, 0, 0, 0.4),*/ -4px -4px 8px 0 rgba(white, 1);
		@apply block h-full w-full rounded-full;
	}
	.icon {
		@apply absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 transform;
	}
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
