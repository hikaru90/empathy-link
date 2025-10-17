<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
		shape?: number;
		blur?: boolean;
	}

	let { class: className = undefined, shape = 1, blur = false }: Props = $props();

	const colors = [
		{ color: '#080638', size: 80, x: 100, y: 0 }, //blau
		{ color: '#17545A', size: 150, x: 0, y: 0 }, //grün
		{ color: '#080638', size: 100, x: 0, y: 100 }, //blau
		{ color: '#F0BADA', size: 130, x: 60, y: 100 }, //rosa
		{ color: '#D8BEFF', size: 80, x: 100, y: 90 }, //lila
		{ color: '#FF9C34', size: 50, x: 50, y: 0 } //orange
	];

	const scale = 200;
</script>

<div class="relative">

	<img src="/shapes/shape{shape}.png" alt="shape" class="w-full" />
	<!--{#each Array(3) as _}
		<div
			style="backdrop-filter: blur(8px); mask: linear-gradient(to left, #00000000 0%, #000000ff 100%);"
			class="absolute inset-0 z-10 bg-white/0"
		></div>
	{/each}
	<div
		style="mask-image: url('/shapes/shape{shape}.svg'); mask-repeat: no-repeat; mask-position: center;"
		class={cn('m-6 overflow-hidden', className)}
	>
		<div style="background-color: #F0BADA; " class="absolute inset-0"></div>
		{#each colors as color}
			<div
				style="width: {(scale / 100) * color.size}%; height: {(scale / 100) *
					color.size}%; left: {color.x}%; top: {color.y}%;"
				class="absolute -translate-x-1/2 -translate-y-1/2 transform rounded-full"
			>
				<div
					class="h-full w-full"
					style="background-image: radial-gradient(circle, {color.color}ff 0%, {color.color}44 40%, {color.color}00 60%);"
				></div>
			</div>
		{/each}
	</div>
-->
</div>

<style lang="scss">
	.animate-waber {
		animation: waber 1s infinite alternate;
	}
	@keyframes waber {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(1.2);
		}
	}
</style>
