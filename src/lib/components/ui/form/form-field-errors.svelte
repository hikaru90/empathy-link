<script lang="ts">
	import * as FormPrimitive from "formsnap";
	import { cn } from "$lib/utils.js";

	type $$Props = FormPrimitive.FieldErrorsProps & {
		errorClasses?: string | undefined | null;
	};

	
	interface Props {
		class?: $$Props["class"];
		errorClasses?: $$Props["class"];
		children?: import('svelte').Snippet<[any]>;
		[key: string]: any
	}

	let { class: className = undefined, errorClasses = undefined, children, ...rest }: Props = $props();
</script>

<FormPrimitive.FieldErrors
	class={cn("text-[0.8rem] font-medium text-destructive bg-red-200 rounded !mb-4", className)}
	{...rest}
	
	
	
>
	{#snippet children({ errors, fieldErrorsAttrs, errorAttrs })}
		{#if children}{@render children({ errors, fieldErrorsAttrs, errorAttrs, })}{:else}
			{#each errors as error}
			<div {...errorAttrs} class={cn("px-2 py-1 border border-red-600/10",errorClasses)}>{error}</div>
			{/each}
		{/if}
	{/snippet}
</FormPrimitive.FieldErrors>
