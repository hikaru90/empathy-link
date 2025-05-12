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
	<div class="flex flex-col items-center justify-center rounded-lg bg-white/40 p-2">
		<div class="relative h-10 w-full rounded-md bg-black/20 p-1">
			<div class="flex h-full w-full items-center justify-center rounded-lg bg-black">
				<div class="font-bold text-bullshift">
					{value}
				</div>
			</div>
		</div>
		<div class="mt-2 flex min-h-10 items-end justify-center text-center text-xs text-gray-800">
			{label}
		</div>
	</div>
</div>
