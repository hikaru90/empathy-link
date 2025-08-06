<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';

	interface Props {
		onClick: () => void;
		children: any;
		target?: string;
		href?: string;
		variant?: undefined | 'primary' | 'secondary' | 'link';
		displayBackButton?: boolean | undefined;
		backButtonText?: string | undefined;
		onPrev?: undefined | (() => void);
		disabled?: boolean;
		displaySkipButton?: boolean | undefined;
		onSkip?: undefined | (() => void);
	}

	let {
		onClick,
		children,
		variant = 'primary',
		target,
		href,
		displayBackButton = false,
		backButtonText = '',
		onPrev,
		disabled = false,
		displaySkipButton = false,
		onSkip
	}: Props = $props();
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
	<a
		target={target ? target : '_self'}
		href={href ? href : '#'}
		class="flex h-10 w-full items-center justify-between gap-2 rounded-full bg-black py-3 pl-6 pr-2 font-medium text-white"
	>
		{@render children?.()}
		<div class="flex size-6 items-center justify-center rounded-full bg-white/20">
			<ArrowRight class="h-4 w-4" />
		</div>
	</a>
{:else}
	<div class="flex flex-row gap-2 w-full">
		{#if displaySkipButton}
		<Button
		onclick={onSkip}
		class="flex h-10 items-center justify-between gap-2 rounded-full bg-white py-3 pl-4 pr-2 font-medium text-white"
	>
	<span class="text-black">Überspringen</span>
	<div class="flex size-6 items-center justify-center rounded-full bg-black/10">
		<ArrowRight class="size-4" />
	</div>
	</Button>
		{/if}
		{#if displayBackButton}
			<Button
				onclick={onPrev}
				class="flex h-10 items-center justify-between gap-2 rounded-full bg-white py-3 pl-2 pr-6 font-medium text-white"
			>
				<div class="flex size-6 items-center justify-center rounded-full bg-black/10">
					<ArrowLeft class="size-4" />
				</div>
				<span class="text-black">{backButtonText}</span>
			</Button>
		{/if}
		<Button
			onclick={onClick}
			class="flex h-10 w-full flex-grow items-center justify-between gap-2 rounded-full bg-black py-3 pl-6 pr-2 font-medium text-white {disabled ? 'opacity-50' : ''}"
		>
			{@render children?.()}
			<div class="flex size-6 items-center justify-center rounded-full bg-white/20">
				<ArrowRight class="size-4" />
			</div>
		</Button>
	</div>
{/if}
