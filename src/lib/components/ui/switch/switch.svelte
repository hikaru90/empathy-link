<script lang="ts">
	import { Switch as SwitchPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = SwitchPrimitive.Props;
	type $$Events = SwitchPrimitive.Events;

	interface Props {
		class?: $$Props["class"];
		checked?: $$Props["checked"];
		[key: string]: any
	}

	let { class: className = undefined, checked = $bindable(undefined), ...rest }: Props = $props();
	
</script>

<SwitchPrimitive.Root
	bind:checked
	class={cn(
		"peer inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer items-center rounded-full p-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-neutral-400 data-[state=unchecked]:bg-opacity-50 shadow-inner shadow-black/20",
		className
	)}
	{...rest}
	onclick
	on:keydown
>
	<SwitchPrimitive.Thumb
		class={cn(
			"pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
		)}
	/>
</SwitchPrimitive.Root>
