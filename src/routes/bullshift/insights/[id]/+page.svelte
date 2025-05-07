<script lang="ts">
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const getTraceColor = (functionName: string) => {
		const options = [
			{ name: 'shouldAnalyzeFeelingsTool', color: 'text-blue-600' },
			{ name: 'analyzeAndSaveFeelings', color: 'text-green-600' }
		];

		return options.find((option) => option.name === functionName)?.color || 'text-gray-600';
	};

	const getTokenPriceInCents = (tokens: number) => {
		const inputTokenPrice = 0.075 / 1000000;
		const outputTokenPrice = 0.3 / 1000000;
		return (tokens * inputTokenPrice) + (tokens * outputTokenPrice) * 100;
	};

	const getTotalTokenPriceInCents = () => {
		return data.traces?.reduce((acc, trace) => acc + getTokenPriceInCents(trace.inputTokens + trace.outputTokens), 0) || 0;
	};
</script>

<div class="max-container py-10">
	<div class="mb-10">
		<h1 class="text-lg font-bold">Chat Trace</h1>
		<p>chatId: {data.record.id}</p>
	</div>

	{#if data.record.feelings?.length > 0}
		<div class="mb-10">
			<h2 class="font-bold">Feelings</h2>
			<div class="flex flex-wrap justify-start gap-1 text-sm">
				{#each data.record.feelings as feeling}
					<div class="rounded-md bg-black/10 px-2 py-0.5">{feeling}</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if data.record.needs?.length > 0}
		<div class="mb-10">
			<h2 class="font-bold">Needs</h2>
			<div class="flex flex-wrap justify-start gap-1 text-sm">
				{#each data.record.needs as need}
					<div class="rounded-md bg-black/10 px-2 py-0.5">{need}</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="flex justify-start">
		<div class="flex justify-start items-center gap-2 bg-blue-200 rounded-md px-4 py-2 shadow-md mb-2">
			<h2 class="font-bold">Total Token Price</h2>
			<div class="text-sm">
				{getTotalTokenPriceInCents().toFixed(2)} Cents
			</div>
		</div>
	</div>

	{#if data.traces?.length > 0}
		<div class="mb-10">
			<h2 class="font-bold mb-2 mt-4">Traces</h2>
			<div class="flex flex-col gap-4">
				{#each data.traces as trace}
					<div>
						<div class="flex justify-between gap-2 rounded-md bg-blue-200 p-1 text-xs">
							<div class="flex gap-2">
								<div>
									inputTokens: {trace.inputTokens}
								</div>
								<div>
									outputTokens: {trace.outputTokens}
								</div>
							</div>
							<div>
								{getTokenPriceInCents(trace.inputTokens + trace.outputTokens).toFixed(4)} Cents
							</div>
						</div>
						<div class="flex justify-between rounded-md bg-black/10 p-1 text-xs text-white/60">
							<div class={getTraceColor(trace.functionName)}>
								{trace.functionName}
							</div>
							<div class="flex items-center gap-2">
								<div class="flex gap-1 text-2xs text-white/60">
									<span>
										{new Date(trace.created).toLocaleString('de-DE', {
											year: 'numeric',
											month: '2-digit',
											day: '2-digit'
										})}
									</span>
									<span>
										{new Date(trace.created).toLocaleString('de-DE', {
											hour: '2-digit',
											minute: '2-digit',
											second: '2-digit'
										})}
									</span>
								</div>
								<div class="text-2xs">
									{trace.id}
								</div>
							</div>
						</div>
						<div class="flex flex-col justify-start gap-1 rounded-md bg-white/60 text-sm">
							<div class="min-h-10 relative bg-white/60 px-2 pb-2 pt-5">
								<div class="absolute right-1 top-1 text-2xs text-black/30 bg-green-300 leading-tight rounded-md px-1 py-0.5">System Instruction</div>
								{trace.systemInstruction}
							</div>
							<div class="relative px-2 pb-2 pt-5">
								<div class="absolute right-1 top-1 text-2xs text-black/30 bg-red-200 leading-tight rounded-md px-1 py-0.5">Question</div>
								{trace.message}
							</div>
							<div class="relative rounded-b-md bg-white/60 px-2 pb-2 pt-5">
								<div class="absolute right-1 top-1 text-2xs text-black/30 bg-blue-200 leading-tight rounded-md px-1 py-0.5">Answer</div>
								{trace.response}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
