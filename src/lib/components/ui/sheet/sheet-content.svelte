<script lang="ts">
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import { fly } from 'svelte/transition';
	import {
		SheetOverlay,
		SheetPortal,
		type Side,
		sheetTransitions,
		sheetVariants
	} from './index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = SheetPrimitive.ContentProps & {
		side?: Side;
	};

	
	interface Props {
		class?: $$Props['class'];
		side?: $$Props['side'];
		inTransition?: $$Props['inTransition'];
		inTransitionConfig?: $$Props['inTransitionConfig'];
		outTransition?: $$Props['outTransition'];
		outTransitionConfig?: $$Props['outTransitionConfig'];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		class: className = undefined,
		side = 'right',
		inTransition = fly,
		inTransitionConfig = sheetTransitions[side ?? 'right'].in,
		outTransition = fly,
		outTransitionConfig = sheetTransitions[side ?? 'right'].out,
		children,
		...rest
	}: Props = $props();
</script>

<SheetPortal>
	<SheetOverlay />
	<SheetPrimitive.Content
		{inTransition}
		{inTransitionConfig}
		{outTransition}
		{outTransitionConfig}
		class={cn(sheetVariants({ side }), className)}
		{...rest}
	>
		{@render children?.()}
		
	</SheetPrimitive.Content>
</SheetPortal>

