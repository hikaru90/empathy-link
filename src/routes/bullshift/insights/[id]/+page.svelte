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

	const getTokenPriceInCents = (inputTokens: number, outputTokens: number) => {
		const inputTokenPrice = 0.075 / 1000000; // $0.075 per 1M input tokens
		const outputTokenPrice = 0.3 / 1000000;  // $0.30 per 1M output tokens
		return (inputTokens * inputTokenPrice + outputTokens * outputTokenPrice) * 100;
	};

	const getPathColor = (pathId: string) => {
		const colors: Record<string, string> = {
			'self_empathy': 'bg-blue-100 text-blue-800',
			'other_empathy': 'bg-green-100 text-green-800', 
			'action_planning': 'bg-purple-100 text-purple-800',
			'conflict_resolution': 'bg-orange-100 text-orange-800'
		};
		return colors[pathId] || 'bg-gray-100 text-gray-800';
	};

	const formatDuration = (ms: number) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${minutes}m ${seconds}s`;
	};

	const getTransitionIcon = (type: string) => {
		switch(type) {
			case 'start': return '🚀';
			case 'end': return '✅';
			case 'switch': return '🔄';
			default: return '📍';
		}
	};
</script>

<div class="max-container py-10">
	<div class="mb-10">
		<h1 class="text-lg font-bold">Chat Insights & Path Analysis</h1>
		<p class="text-sm text-muted-foreground">chatId: {data.record.id}</p>
		{#if data.pathAnalysis?.currentPath}
			<div class="mt-2">
				<div class="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium {getPathColor(data.pathAnalysis.currentPath)}">
					Current Path: {data.availablePaths?.find(p => p.id === data.pathAnalysis.currentPath)?.name || data.pathAnalysis.currentPath}
				</div>
			</div>
		{/if}
		
		<!-- Debug info -->
		<details class="mt-4 text-xs">
			<summary class="cursor-pointer text-muted-foreground">Debug Info (click to expand)</summary>
			<div class="mt-2 p-2 bg-gray-100 rounded text-xs space-y-1">
				<div>Chat has history: {data.record.history?.length || 0} messages</div>
				<div>Chat has pathState: {data.record.pathState ? 'Yes' : 'No'}</div>
				<div>Path analysis found: {data.pathAnalysis ? 'Yes' : 'No'}</div>
				{#if data.pathAnalysis}
					<div>Transitions: {data.pathAnalysis.transitions?.length || 0}</div>
					<div>Segments: {data.pathAnalysis.segments?.length || 0}</div>
					<div>Statistics: {data.pathAnalysis.statistics?.length || 0}</div>
				{/if}
				<div>Available paths: {data.availablePaths?.length || 0}</div>
			</div>
		</details>
	</div>

	<!-- Available Paths (always show) -->
	{#if data.availablePaths?.length > 0}
		<div class="mb-10">
			<h2 class="text-lg font-bold mb-4">Available Conversation Paths</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each data.availablePaths as path}
					<div class="p-4 border rounded-lg {getPathColor(path.id)}">
						<h3 class="font-semibold mb-2">{path.name}</h3>
						<p class="text-sm mb-2">{path.entryCondition}</p>
						<p class="text-xs text-muted-foreground">Exit: {path.exitCondition}</p>
						{#if path.suggestedNext?.length}
							<div class="mt-2">
								<span class="text-xs">→ </span>
								<span class="text-xs">{path.suggestedNext.join(', ')}</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>
			
			{#if !data.pathAnalysis?.segments?.length}
				<div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<h4 class="font-semibold text-blue-800 mb-2">💡 To see path analysis:</h4>
					<ol class="text-sm text-blue-700 space-y-1">
						<li>1. Start a new chat conversation</li>
						<li>2. The new path system will automatically track conversation stages</li>
						<li>3. Come back to this insights page to see the path analysis</li>
					</ol>
					<p class="text-xs text-blue-600 mt-2">
						Note: Existing chats created before the path system won't have path data.
					</p>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Path Analysis Section -->
	{#if data.pathAnalysis && (data.pathAnalysis.segments?.length > 0 || data.pathAnalysis.transitions?.length > 0)}
		<div class="mb-10">
			<h2 class="text-lg font-bold mb-4">Conversation Path Analysis</h2>
			
			<!-- Path Statistics -->
			{#if data.pathAnalysis.statistics?.length > 0}
				<div class="mb-6">
					<h3 class="font-semibold mb-3">Path Usage Statistics</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each data.pathAnalysis.statistics as stat}
							<div class="p-4 border rounded-lg {getPathColor(stat.path)}">
								<div class="font-medium">{stat.name}</div>
								<div class="text-sm space-y-1 mt-2">
									<div>Sessions: {stat.sessions}</div>
									<div>Messages: {stat.messageCount}</div>
									{#if stat.avgSessionLength > 0}
										<div>Avg Duration: {formatDuration(stat.avgSessionLength)}</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Path Timeline -->
			{#if data.pathAnalysis.transitions?.length > 0}
				<div class="mb-6">
					<h3 class="font-semibold mb-3">Path Transition Timeline</h3>
					<div class="space-y-2">
						{#each data.pathAnalysis.transitions as transition}
							<div class="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
								<div class="text-lg">{getTransitionIcon(transition.type)}</div>
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<div class="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium {getPathColor(transition.path)}">
											{data.availablePaths?.find(p => p.id === transition.path)?.name || transition.path}
										</div>
										<span class="text-sm capitalize">{transition.type}</span>
									</div>
									{#if transition.previousPath}
										<div class="text-xs text-muted-foreground mt-1">
											From: {data.availablePaths?.find(p => p.id === transition.previousPath)?.name || transition.previousPath}
										</div>
									{/if}
								</div>
								<div class="text-xs text-muted-foreground">
									{new Date(transition.timestamp).toLocaleString()}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Path Segments -->
			{#if data.pathAnalysis.segments?.length > 0}
				<div class="mb-6">
					<h3 class="font-semibold mb-3">Conversation Segments</h3>
					<div class="space-y-3">
						{#each data.pathAnalysis.segments as segment, index}
							<div class="p-4 border rounded-lg {getPathColor(segment.path)}">
								<div class="flex justify-between items-start mb-2">
									<div class="font-medium">
										Segment {index + 1}: {data.availablePaths?.find(p => p.id === segment.path)?.name || segment.path}
									</div>
									<div class="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
										{segment.messageCount} messages
									</div>
								</div>
								<div class="text-sm space-y-1">
									<div>Started: {new Date(segment.startTime).toLocaleString()}</div>
									{#if segment.endTime}
										<div>Ended: {new Date(segment.endTime).toLocaleString()}</div>
										<div>Duration: {formatDuration(segment.endTime - segment.startTime)}</div>
									{:else}
										<div class="text-orange-600">Active (ongoing)</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Path History -->
			{#if data.pathAnalysis.pathHistory?.length > 0}
				<div class="mb-6">
					<h3 class="font-semibold mb-3">Path Journey</h3>
					<div class="flex flex-wrap gap-2">
						{#each data.pathAnalysis.pathHistory as pathId, index}
							<div class="flex items-center gap-1">
								<div class="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium {getPathColor(pathId)}">
									{data.availablePaths?.find(p => p.id === pathId)?.name || pathId}
								</div>
								{#if index < data.pathAnalysis.pathHistory.length - 1}
									<span class="text-muted-foreground">→</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Visual Path Flow -->
			{#if data.pathAnalysis.segments?.length > 1}
				<div class="mb-6">
					<h3 class="font-semibold mb-3">Visual Path Flow</h3>
					<div class="relative">
						<!-- Timeline line -->
						<div class="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
						
						<div class="space-y-6">
							{#each data.pathAnalysis.segments as segment, index}
								<div class="relative flex items-start gap-4">
									<!-- Timeline dot -->
									<div class="relative z-10 w-12 h-12 rounded-full border-4 border-background flex items-center justify-center {getPathColor(segment.path)}">
										<span class="text-xs font-bold">{index + 1}</span>
									</div>
									
									<!-- Content -->
									<div class="flex-1 min-w-0 pb-6">
										<div class="flex items-center gap-2 mb-2">
											<h4 class="font-medium">
												{data.availablePaths?.find(p => p.id === segment.path)?.name || segment.path}
											</h4>
											<div class="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
												{segment.messageCount} msgs
											</div>
										</div>
										
										<div class="text-sm text-muted-foreground space-y-1">
											<div>Started: {new Date(segment.startTime).toLocaleString('en-US', { 
												month: 'short', 
												day: 'numeric', 
												hour: '2-digit', 
												minute: '2-digit' 
											})}</div>
											{#if segment.endTime}
												<div>Duration: {formatDuration(segment.endTime - segment.startTime)}</div>
											{:else}
												<div class="text-orange-600 font-medium">Ongoing</div>
											{/if}
										</div>
										
										<!-- Path description -->
										{#if data.availablePaths?.find(p => p.id === segment.path)?.entryCondition}
											<div class="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
												{data.availablePaths.find(p => p.id === segment.path)?.entryCondition}
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}

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

	<!-- Token Usage & Cost Summary -->
	{#if data.tokenCostBreakdown}
		<div class="mb-10">
			<h2 class="text-lg font-bold mb-4">Token Usage & Cost Summary</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<!-- Input Tokens -->
				<div class="p-4 border rounded-lg bg-green-50 border-green-200">
					<div class="text-sm text-green-600 font-medium mb-1">Input Tokens</div>
					<div class="text-2xl font-bold text-green-800">{data.tokenCostBreakdown.inputTokens.toLocaleString()}</div>
					<div class="text-xs text-green-600 mt-1">${data.tokenCostBreakdown.inputCostUSD.toFixed(4)} USD</div>
				</div>

				<!-- Output Tokens -->
				<div class="p-4 border rounded-lg bg-blue-50 border-blue-200">
					<div class="text-sm text-blue-600 font-medium mb-1">Output Tokens</div>
					<div class="text-2xl font-bold text-blue-800">{data.tokenCostBreakdown.outputTokens.toLocaleString()}</div>
					<div class="text-xs text-blue-600 mt-1">${data.tokenCostBreakdown.outputCostUSD.toFixed(4)} USD</div>
				</div>

				<!-- Total Tokens -->
				<div class="p-4 border rounded-lg bg-purple-50 border-purple-200">
					<div class="text-sm text-purple-600 font-medium mb-1">Total Tokens</div>
					<div class="text-2xl font-bold text-purple-800">{data.tokenCostBreakdown.totalTokens.toLocaleString()}</div>
					<div class="text-xs text-purple-600 mt-1">Combined usage</div>
				</div>

				<!-- Total Cost -->
				<div class="p-4 border rounded-lg bg-orange-50 border-orange-200">
					<div class="text-sm text-orange-600 font-medium mb-1">Total Cost</div>
					<div class="text-2xl font-bold text-orange-800">{data.tokenCostBreakdown.totalCostCents.toFixed(2)}¢</div>
					<div class="text-xs text-orange-600 mt-1">${data.tokenCostBreakdown.totalCostUSD.toFixed(4)} USD</div>
				</div>
			</div>

			<!-- Cost Breakdown -->
			<div class="p-4 border rounded-lg bg-gray-50">
				<h3 class="font-semibold mb-3">Cost Breakdown</h3>
				<div class="space-y-2 text-sm">
					<div class="flex justify-between">
						<span>Input tokens ({data.tokenCostBreakdown.inputTokens.toLocaleString()}) @ $0.075/1M:</span>
						<span class="font-mono">${data.tokenCostBreakdown.inputCostUSD.toFixed(4)}</span>
					</div>
					<div class="flex justify-between">
						<span>Output tokens ({data.tokenCostBreakdown.outputTokens.toLocaleString()}) @ $0.30/1M:</span>
						<span class="font-mono">${data.tokenCostBreakdown.outputCostUSD.toFixed(4)}</span>
					</div>
					<hr class="my-2">
					<div class="flex justify-between font-semibold">
						<span>Total Cost:</span>
						<span class="font-mono">${data.tokenCostBreakdown.totalCostUSD.toFixed(4)} ({data.tokenCostBreakdown.totalCostCents.toFixed(2)}¢)</span>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if data.traces?.length > 0}
		<div class="mb-10">
			<h2 class="font-bold mb-2 mt-4">AI Interaction Traces</h2>
			<div class="flex flex-col gap-4">
				{#each data.traces as trace}
					{@const traceTime = new Date(trace.created).getTime()}
					{@const activeSegment = data.pathAnalysis?.segments?.find(segment => 
						segment.startTime <= traceTime && (!segment.endTime || segment.endTime >= traceTime)
					)}
					<div>
						<div class="flex justify-between gap-2 rounded-md bg-blue-200 p-1 text-xs">
							<div class="flex gap-2">
								<div>
									inputTokens: {trace.inputTokens}
								</div>
								<div>
									outputTokens: {trace.outputTokens}
								</div>
								{#if activeSegment}
									<div class="inline-flex items-center rounded px-1.5 py-0.5 text-2xs font-medium {getPathColor(activeSegment.path)}">
										{data.availablePaths?.find(p => p.id === activeSegment.path)?.name || activeSegment.path}
									</div>
								{/if}
							</div>
							<div>
								{getTokenPriceInCents(trace.inputTokens, trace.outputTokens).toFixed(4)} Cents
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
