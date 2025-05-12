<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		value: number;
		min: number;
		max: number;
		label: string;
		class?: string;
	}

	let { class: className = undefined, value, min, max, label }: Props = $props();

	const percentage = $derived(Math.round(((value - min) / (max - min)) * 100));
	const rotation = $derived(percentage * 1.8 - 140);
</script>

<div class={cn('flex flex-col p-2', className)}>
	<div class="flex flex-col rounded-lg bg-white/40 px-2 pb-2 pt-4 items-center justify-center">
		<div class="relative size-10 rounded-full bg-black">
			<div style="transform: rotate({rotation}deg)" class="absolute h-full w-full">
				<div
					class="absolute left-1/2 top-2 h-3 w-1 -translate-x-1/2 rounded-full bg-bullshift"
				></div>
			</div>
			<div style="transform: rotate(-140deg)" class="absolute h-full w-full">
				<div
					class="absolute left-1/2 -top-1 h-1 w-1 -translate-x-1/2 -translate-y-full rounded-full bg-black"
				></div>
			</div>
      <div style="transform: rotate(140deg)" class="absolute h-full w-full">
				<div
					class="absolute left-1/2 -top-1 h-1 w-1 -translate-x-1/2 -translate-y-full rounded-full bg-black"
				></div>
			</div>
		</div>
		<div class="text-xs text-gray-800 min-h-8 flex items-end justify-center text-center mt-2">
			{label}
		</div>
	</div>
</div>
