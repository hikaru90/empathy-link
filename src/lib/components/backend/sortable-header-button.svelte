<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { ArrowUpDown } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button/index.js";

	interface Props extends ComponentProps<typeof Button> {
		text: string;
	}

	let { variant = "ghost", text, ...restProps }: Props = $props();
</script>

<Button {variant} {...restProps}>
	{text}
	<ArrowUpDown class="ml-2 h-4 w-4" />
</Button>