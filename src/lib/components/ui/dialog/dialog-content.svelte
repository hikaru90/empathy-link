<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import X from 'lucide-svelte/icons/x';
	import * as Dialog from "./index.js";
	import { cn, flyAndScale } from "$lib/utils.js";

	type $$Props = DialogPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export let transition: $$Props["transition"] = flyAndScale;
	export let transitionConfig: $$Props["transitionConfig"] = {
		duration: 200,
	};
	export { className as class };
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		{transition}
		{transitionConfig}
		class={cn(
			"fixed left-[50%] top-[50%] z-[1002] grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-offwhite p-6 shadow-lg sm:rounded-lg md:w-full max-w-[90vw] md:max-w-lg rounded-2xl",
			className
		)}
		{...$$restProps}
	>
		<slot />
		<DialogPrimitive.Close
			class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
		<div class="label bg-feelings-background">
			<div class="icon fill-feelings-foreground">
				<!-- {@html row.icon} -->
				<X class="text-red-600" />
			</div>
		</div>
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close>
	</DialogPrimitive.Content>
</Dialog.Portal>

<style lang="scss">
	.label {
		box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.4);
		@apply relative h-7 w-7 flex-shrink-0 rounded-full border border-white;
	}
	.label:after {
		content: '';
		box-shadow: /*inset 0 0 4px rgba(0, 0, 0, 0.4),*/ -4px -4px 8px 0 rgba(white, 1);
		@apply block h-full w-full rounded-full;
	}
	.icon {
		@apply absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 transform flex items-center justify-center;
	}
</style>