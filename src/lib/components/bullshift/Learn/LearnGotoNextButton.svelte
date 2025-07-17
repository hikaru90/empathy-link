<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';

	interface Props {
		onClick: () => void;
		children: any;
		target?: string;
		href?: string;
		variant?: undefined | 'primary' | 'secondary' | 'link';
	}

	let { onClick, children, variant = 'primary', target, href }: Props = $props();
</script>

{#if variant === 'secondary'}
	<Button
		onclick={onClick}
		class="flex h-7 items-center justify-between gap-2 rounded-full bg-white/90 py-0.5 pl-3 pr-1 text-xs"
	>
		{@render children?.()}
		<div class="flex size-5 items-center justify-center rounded-full bg-black/5">
			<ArrowRight class="size-3" />
		</div>
	</Button>
{:else if variant === 'link'}
	<a target={target ? target : '_self'}
		href={href ? href : '#'}
		class="flex h-10 w-full items-center justify-between gap-2 rounded-full bg-black py-3 pl-6 pr-2 font-medium text-white"
	>
		{@render children?.()}
    <div class="flex size-6 items-center justify-center rounded-full bg-white/20">
			<ArrowRight class="h-4 w-4" />
		</div>
</a>
{:else}
	<Button
		onclick={onClick}
		class="flex h-10 w-full items-center justify-between gap-2 rounded-full bg-black py-3 pl-6 pr-2 font-medium text-white"
	>
		{@render children?.()}
		<div class="flex size-6 items-center justify-center rounded-full bg-white/20">
			<ArrowRight class="h-4 w-4" />
		</div>
	</Button>
{/if}
