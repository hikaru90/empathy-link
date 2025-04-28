<script lang="ts">
	import { Button } from '$lib/components/ui/button-sparkle';
	import { Button as ButtonOp1 } from '$lib/components/ui/button-op1/index.js';
	import * as Sheet from '$lib/components/ui/sheet';
	import Cross1 from 'svelte-radix/Cross1.svelte';
	import { t } from '$lib/translations';
	import { backgroundColor } from '$store/page';
	import { scrollToElement } from '$scripts/helpers';
	import { HamburgerMenu, CaretRight } from 'radix-icons-svelte';
	import { goto } from '$app/navigation';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import { toggleMode, mode } from 'mode-watcher';
	import * as Select from '$lib/components/ui/select/index.js';
	import { locale, locales } from '$lib/translations';
	import { setCookie } from '$scripts/helpers';

	export let menuItems: any;
	let dialogOpen = false;

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

	const scrollToTarget = (target) => {
		dialogOpen = false;
		const targetDiv = document.getElementById(target);
		scrollToElement(targetDiv, 400);
		setTimeout(() => {
			window.scrollBy(0, -0.1);
		}, 500);
	};
</script>

<Sheet.Root bind:open={dialogOpen}>
	<button on:click={() => (dialogOpen = true)} class="flex items-center">
		<HamburgerMenu class="size-6" />
	</button>
	<Sheet.Content class="{$backgroundColor} z-[1003] flex flex-col border-muted">
		<Sheet.Header
			class="flex flex-row items-center justify-between border-b border-black/10 px-5 py-2.5"
		>
			<Sheet.Title class="pt-0.5">{$t('default.menu.title')}</Sheet.Title>
			<Sheet.Close class="!m-0" on:click={() => (dialogOpen = false)}>
				<ButtonOp1
					decoration="floating-op1"
					class="-mr-2 flex items-center justify-center border-neutral-200 bg-background p-1.5 text-sm text-neutral-800 transition hover:bg-offwhite dark:border-neutral-800 dark:bg-muted dark:text-white"
				>
					<Cross1 class="size-4 text-red-600" />
				</ButtonOp1>
			</Sheet.Close>
		</Sheet.Header>
		<div class="flex h-full flex-col justify-between gap-2 p-5">
			<div class="mb-10 flex flex-col items-start gap-2">
				{#each menuItems as item}
					<button
						on:click={scrollToTarget(item.target)}
						class="flex w-full items-center justify-between gap-2 text-lg font-bold"
					>
						{item.label}
						<div class="mr-[2px] flex size-6 items-center justify-center rounded-full">
							<CaretRight class="size-4" />
						</div>
					</button>
				{/each}
			</div>
			<div class="flex flex-col gap-5">
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
				<div class="mb-4 flex items-center space-x-2">
					<Switch
						id="lightMode"
						bind:checked={darkMode}
						on:click={toggleMode}
						class="bg-gray-500"
					/>
					<Label for="lightMode">Dark Mode</Label>
				</div>
				<div class="mb-3 border-b border-gray-300/30 dark:border-gray-300/20"></div>
				<Button on:click={() => goto('/app/auth/login')} variant="outline" class="w-full font-bold dark:text-black rounded-lg">
					{$t('default.page.login.heading')}
				</Button>
			</div>
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
