<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = RangeCalendarPrimitive.NextButtonProps;
	type $$Events = RangeCalendarPrimitive.NextButtonEvents;

	interface Props {
		class?: $$Props["class"];
		children?: import('svelte').Snippet<[any]>;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<RangeCalendarPrimitive.NextButton
	onclick
	class={cn(
		buttonVariants({ variant: "outline" }),
		"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
		className
	)}
	{...rest}
	
>
	{#snippet children({ builder })}
		{#if children}{@render children({ builder, })}{:else}
			<ChevronRight class="h-4 w-4" />
		{/if}
	{/snippet}
</RangeCalendarPrimitive.NextButton>
