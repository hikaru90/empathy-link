<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import DrawerOverlay from "./drawer-overlay.svelte";
	import { cn } from "$lib/utils.js";

	type $$Props = DrawerPrimitive.ContentProps;

	interface Props {
		class?: $$Props["class"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<DrawerPrimitive.Portal>
	<DrawerOverlay />
		<DrawerPrimitive.Content
		class={cn(
			"fixed inset-x-0 bottom-[68px] z-[1001] mt-24 flex h-auto flex-col rounded-t-[16px] border bg-background",
			className
		)}
		{...rest}
		>
		<div class="mx-auto mt-3 -mb-3 h-1 w-16 rounded-full bg-black bg-opacity-10"></div>
		{@render children?.()}
	</DrawerPrimitive.Content>
</DrawerPrimitive.Portal>
