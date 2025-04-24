<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

  const getTraceColor = (functionName: string) => {
const options = [
  {name: 'shouldAnalyzeFeelingsTool', color: 'text-blue-600'},
  {name: 'analyzeAndSaveFeelings', color: 'text-green-600'},
]

    return options.find(option => option.name === functionName)?.color || 'text-gray-600';
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

	{#if data.traces?.length > 0}
		<div class="mb-10">
			<h2 class="font-bold">Traces</h2>
			<div class="flex flex-col gap-2">
				{#each data.traces as trace}
					<div
						class="-mb-1 mt-2 flex justify-between rounded-md bg-black/10 p-1 text-xs text-white/60"
					>
						<div class="{getTraceColor(trace.functionName)}">
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
						<div class="relative p-2">
							<div class="absolute right-2 top-0 text-2xs text-black/30">Question</div>
							{trace.message}
						</div>
						<div class="rounded-b-md bg-white/60 p-2 relative">
              <div class="absolute right-2 top-0 text-2xs text-black/30">Answer</div>
              {trace.response}</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
