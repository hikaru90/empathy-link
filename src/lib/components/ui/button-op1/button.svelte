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
	export let decoration;
</script>

{#if decoration === 'op1'}
	<div
		class="relative flex items-center gap-[4px] border border-black/10 bg-black/10 p-[2px] dark:bg-black/20 md:rounded"
	>
	<div class="shadow">
		<div
			class="flex items-center justify-center overflow-hidden rounded shadow-inner shadow-white/40 dark:shadow-white/10"
		>
			<ButtonPrimitive.Root
				{builders}
				class="h-[45.4px] rounded-[2px] bg-offwhite px-2 text-black"
				type="button"
				{...$$restProps}
				on:click
				on:keydown
			>
				<div
					class={cn(
						buttonVariants({ variant, size, className }),
						'skeumorphic-button h-[29.4px] rounded-full border-2 border-offwhite bg-offwhite text-black transition duration-700 hover:bg-offwhite'
					)}
				>
					<slot />
				</div>
			</ButtonPrimitive.Root>
		</div>
	</div>
	</div>
{:else}
	<ButtonPrimitive.Root
		{builders}
		class="h-[45.4px] rounded-[2px] bg-offwhite px-2 text-black"
		type="button"
		{...$$restProps}
		on:click
		on:keydown
	>
		<div
			class={cn(
				buttonVariants({ variant, size, className }),
				'skeumorphic-button h-[29.4px] rounded-full border-2 border-offwhite bg-offwhite text-black transition duration-700 hover:bg-offwhite'
			)}
		>
			<slot />
		</div>
	</ButtonPrimitive.Root>
{/if}

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
