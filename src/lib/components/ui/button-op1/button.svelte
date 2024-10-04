<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { type Events, type Props, buttonVariants } from './index.js';
	import { cn } from '$lib/utils.js';
	import { BorderAll } from 'radix-icons-svelte';

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props['class'] = undefined;
	export let variant: $$Props['variant'] = 'default';
	export let size: $$Props['size'] = 'default';
	export let builders: $$Props['builders'] = [];
	export { className as class };
	export let decoration: string = 'default';
	export let wrapperClass: string;
	export let noInnerShadow: boolean = false;
</script>

{#if decoration === 'op1'}
	<div
		class={cn(
			'op1 relative flex items-center gap-[4px] border border-black/10 bg-black/10 p-[2px] dark:bg-black/20 md:rounded',
			wrapperClass
		)}
	>
		<div class="shadow">
			<div
				class="flex items-center justify-center overflow-hidden rounded shadow-inner shadow-white/40 dark:shadow-white/10"
			>
				<ButtonPrimitive.Root
					{builders}
					class="h-[45.4px] rounded-[2px] px-2 text-black"
					type="button"
					{...$$restProps}
					on:click
					on:keydown
				>
					<div
						class={cn(
							buttonVariants({ variant, size, className }),
							'skeumorphic-button h-[29.4px] rounded-full border-2 border-offwhite bg-offwhite text-black transition duration-700 '
						)}
					>
						<slot />
					</div>
				</ButtonPrimitive.Root>
			</div>
		</div>
	</div>
{:else if decoration === 'dark-op1'}
	<div class={cn('dark-op1 relative flex items-center gap-[4px]', wrapperClass)}>
		<div class="flex w-full items-center justify-center">
			<ButtonPrimitive.Root
				{builders}
				class="p-1.5 w-full"
				type="button"
				{...$$restProps}
				on:click
				on:keydown
			>
				<div
					class={cn(
						buttonVariants({ variant, size, className }),
						'skeumorphic-button-dark h-[29.4px] w-full rounded-full border-2 transition duration-700 dark:hover:bg-muted'
					)}
				>
					<slot />
				</div>
			</ButtonPrimitive.Root>
		</div>
	</div>
{:else if decoration === 'floating-op1'}
	<div class={cn('floating-op1 relative flex items-center gap-[4px]', wrapperClass)}>
		<div class="flex w-full flex-grow items-center justify-center">
			<ButtonPrimitive.Root
				{builders}
				class="w-full p-1.5"
				type="button"
				{...$$restProps}
				on:click
				on:keydown
			>
				<div
					class={cn(
						buttonVariants({ variant, size, className }),
						'h-[29.4px] rounded-full border-2 transition duration-700',
						noInnerShadow ? 'skeumorphic-button-no-inner-shadow' : 'skeumorphic-button'
					)}
				>
					<slot />
				</div>
			</ButtonPrimitive.Root>
		</div>
	</div>
{:else}
	<ButtonPrimitive.Root
		{builders}
		class="h-[45.4px] rounded-[2px] px-2 text-black"
		type="button"
		{...$$restProps}
		on:click
		on:keydown
	>
		<div
			class={cn(
				buttonVariants({ variant, size, className }),
				'skeumorphic-button h-[29.4px] rounded-full border-2 border-offwhite bg-offwhite text-black transition duration-700 dark:hover:bg-muted'
			)}
		>
			<slot />
		</div>
	</ButtonPrimitive.Root>
{/if}

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow:
			inset 0 0 8px 0 rgba(0, 0, 0, 0.2),
			var(--skeumorphic-shadow-light);
	}
	.skeumorphic-button-dark {
		transition: box-shadow 50ms;
		box-shadow:
			inset 0 0 8px 0 rgba(0, 0, 0, 0.2),
			var(--skeumorphic-shadow);
	}
	.skeumorphic-button-no-inner-shadow {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
