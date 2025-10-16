<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
		fast?: boolean;
		children?: import('svelte').Snippet;
	}

	let { class: className = undefined, fast = false, children = undefined }: Props = $props();
	
	let width = $state(0);
	let duration = $state(fast ? 1 : 3);
	let containerElement: HTMLElement;
	let animationId = $state(Math.random().toString(36).substr(2, 9));
	let animationReady = $state(false);

	const colors = $derived([
		{ colorName: 'rose', color: '#F0BADA', size: 2, x: 0, y: 50, z: 1, delay: 0, opacity: 1 },
		{ colorName: 'forest', color: '#17545A', size: 3, x: 0, y: 150, z: 0, delay: (duration * 1) / 3, opacity: 0.4 },
		{ colorName: 'orange', color: '#FF9C34', size: 3, x: 50, y: 0, z: 2, delay: (duration * 2) / 3, opacity: 0.8 }



		// { colorName: 'pink', color: '#DB79AA', size: 1, x: 100, y: 0, z:0 },
		// { colorName: 'lilac', color: '#D8BEFF', size: 1, x: 50, y: 100, z: 2, delay: 3 }
		// { colorName: 'cream', color: '#FFEFF0', size: 100, x: 100, y: 50 },
	]);
	onMount(() => {
		if (containerElement) {
			width = containerElement.offsetWidth;
		}

		// Create instance-specific keyframes
		const style = document.createElement('style');
		style.id = `gradient-animation-${animationId}`;
		style.textContent = `
			@keyframes fly-${animationId} {
				0% { opacity: 0; transform: translateX(${width * -1.5}px); }
				5% { opacity: 1; transform: translateX(${width * -1.5}px); }
				95% { opacity: 1; transform: translateX(${width * 1.5}px); }
				100% { opacity: 0; transform: translateX(${width * 1.5}px); }
			}
		`;
		document.head.appendChild(style);
		
		// Mark animation as ready
		animationReady = true;
	});
</script>

<div bind:this={containerElement} class={cn('gradient-image relative overflow-hidden bg-lilac', className)}>
	{#if animationReady}
		{#each colors as color}
			<div
				class="absolute"
				style="left: {color.x}%; top: {color.y}%; animation-delay: {color.delay}s; animation-duration: {duration}s; animation-timing-function: linear; animation-iteration-count: infinite; animation-direction: forward; animation-name: fly-{animationId}; transform: translateX({width * -1.5}px); opacity: 0;"
			>
				<div class="relative w-1 h-1 ">
					<div
						class="absolute -translate-x-1/2 -translate-y-1/2 transform"
						style="width: {width * color.size}px; height: {width *
							color.size}px; background: radial-gradient(circle, {color.color} 0%, transparent 40%); z-index: {color.z}; opacity: {color.opacity};"
					></div>
				</div>
			</div>
		{/each}
	{/if}
	{#if children}
		{@render children?.()}
	{/if}
</div>
