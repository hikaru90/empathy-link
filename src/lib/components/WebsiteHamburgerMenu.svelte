<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import * as Sheet from '$lib/components/ui/sheet';
	import Cross1 from 'svelte-radix/Cross1.svelte';
	import { t } from '$lib/translations';
	import { backgroundColor, currentSection } from '$store/page';
	import { scrollToElement } from '$scripts/helpers';
	import { HamburgerMenu } from 'radix-icons-svelte';

	export let menuItems: any;
	let dialogOpen = false;

	const scrollToTarget = (target) => {
		dialogOpen = false
		const targetDiv = document.getElementById(target);
		scrollToElement(targetDiv, 400);
	};
</script>

<Sheet.Root bind:open={dialogOpen}>
	<button on:click={() => (dialogOpen = true)} class="flex items-center">
		<HamburgerMenu class="size-6" />
	</button>
	<Sheet.Content class="{$backgroundColor} z-[1003] flex flex-col">
		<Sheet.Header
			class="flex flex-row items-center justify-between border-b border-black/10 px-5 py-3.5"
		>
		<div></div>
			<!-- <Sheet.Title class="pt-0.5">{$t('default.menu.profile.sheet.header')}</Sheet.Title> -->
			<Sheet.Close class="!m-0" on:click={() => (dialogOpen = false)}>
				<div class="label bg-feelings-background">
					<div class="icon flex items-center justify-center fill-feelings-foreground">
						<!-- {@html row.icon} -->
						<Cross1 class="text-red-600" />
					</div>
				</div>
			</Sheet.Close>
		</Sheet.Header>
		<div class="p-5 flex flex-col gap-2 items-start">
			{#each menuItems as item}
				<button on:click={scrollToTarget(item.target)} class="font-bold text-lg">{item.label}</button>
			{/each}
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
