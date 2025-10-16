<script lang="ts">
	import { Button } from '$lib/components/ui/button-sparkle';
	import { Button as ButtonOp1 } from '$lib/components/ui/button-op1/index.js';
	import * as Sheet from '$lib/components/ui/sheet';
	import X from 'lucide-svelte/icons/x';
	import { m } from '$lib/translations';
	import { backgroundColor } from '$store/page';
	import { scrollToElement } from '$scripts/helpers';
	import Menu from 'lucide-svelte/icons/menu'
	import ChevronRight from 'lucide-svelte/icons/chevron-right'
	import { goto } from '$app/navigation';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import * as Select from '$lib/components/ui/select/index.js';
	import { setCookie } from '$scripts/helpers';
	import { getLocale } from '$src/paraglide/runtime';
	const locale = $derived(getLocale());

	interface Props {
		menuItems: any;
		user: App.User;
	}

	let { menuItems, user }: Props = $props();
	let dialogOpen = $state(false);

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

	const scrollToTarget = (target) => {
		dialogOpen = false;
		const targetDiv = document.getElementById(target);
		scrollToElement(targetDiv, 400);
		setTimeout(() => {
			window.scrollBy(0, -0.1);
		}, 500);
	};
</script>





<!-- <Sheet.Root bind:open={dialogOpen}>
	
	<Sheet.Content class="{$backgroundColor} z-[1003] flex flex-col border-muted">
		<Sheet.Header
			class="flex flex-row items-center justify-between border-b border-black/10 px-5 py-2.5"
		>
			<Sheet.Title class="pt-0.5">{m.menu_title()}</Sheet.Title>
			<Sheet.Close class="!m-0" onclick={() => (dialogOpen = false)}>
				<ButtonOp1
					decoration="floating-op1"
					class="-mr-2 flex items-center justify-center border-neutral-200 bg-background p-1.5 text-sm text-neutral-800 transition hover:bg-offwhite dark:border-neutral-800 dark:bg-muted dark:text-white"
				>
					<X class="size-4 text-red-600" />
				</ButtonOp1>
			</Sheet.Close>
		</Sheet.Header>
		<div class="flex h-full flex-col justify-between gap-2 p-5">
			<div class="mb-10 flex flex-col items-start gap-2">
				{#each menuItems as item}
					<button
						onclick={scrollToTarget(item.target)}
						class="flex w-full items-center justify-between gap-2 text-lg font-bold"
					>
						{item.label}
						<div class="mr-[2px] flex size-6 items-center justify-center rounded-full">
							<ChevronRight class="size-4" />
						</div>
					</button>
				{/each}
			</div>
			<div class="flex flex-col gap-5">
				<Select.Root
					selected={langs.find((lang) => lang.value === locale)}
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
				<div class="mb-3 border-b border-gray-300/30 dark:border-gray-300/20"></div>
				<Button onclick={() => goto('/app/auth/login')} variant="outline" class="w-full font-bold dark:text-black rounded-lg">
					{m.page_login_heading()}
				</Button>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root> -->