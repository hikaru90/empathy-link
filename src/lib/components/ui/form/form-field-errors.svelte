<script lang="ts">
	import * as FormPrimitive from "formsnap";
	import { cn } from "$lib/utils.js";

	type $$Props = FormPrimitive.FieldErrorsProps & {
		errorClasses?: string | undefined | null;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
	export let errorClasses: $$Props["class"] = undefined;
</script>

<FormPrimitive.FieldErrors
	class={cn("text-[0.8rem] font-medium text-destructive bg-red-200 rounded !mb-4", className)}
	{...$$restProps}
	let:errors
	let:fieldErrorsAttrs
	let:errorAttrs
>
	<slot {errors} {fieldErrorsAttrs} {errorAttrs}>
		{#each errors as error}
			<div {...errorAttrs} class={cn("px-2 py-1",errorClasses)}>{error}</div>
		{/each}
	</slot>
</FormPrimitive.FieldErrors>
