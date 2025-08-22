<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import type { PathDefinition } from '$lib/server/paths';
	
	interface Props {
		availablePaths: PathDefinition[];
		currentPath: string | null;
		pathCompletion?: {
			shouldEnd: boolean;
			confidence: number;
			reason: string;
			suggestedPaths?: string[];
		} | null;
		loading?: boolean;
	}
	
	let { 
		availablePaths, 
		currentPath, 
		pathCompletion = null, 
		loading = false 
	}: Props = $props();
	
	const dispatch = createEventDispatcher<{
		switchPath: { pathId: string };
	}>();
	
	function handleSwitchPath(pathId: string) {
		dispatch('switchPath', { pathId });
	}
	
	// Get suggested paths or all available paths
	const suggestedPaths = $derived(() => {
		if (pathCompletion?.suggestedPaths?.length) {
			return availablePaths.filter(p => 
				pathCompletion.suggestedPaths!.includes(p.id)
			);
		}
		return availablePaths.filter(p => p.id !== currentPath);
	});
	
	const currentPathInfo = $derived(() => 
		availablePaths.find(p => p.id === currentPath)
	);
</script>

<div class="space-y-4 p-4 border rounded-lg bg-muted/50">
	<div class="flex items-center justify-between">
		<h3 class="font-semibold">Conversation Path</h3>
		{#if currentPathInfo}
			<Badge variant="secondary">{currentPathInfo.name}</Badge>
		{/if}
	</div>
	
	{#if pathCompletion?.shouldEnd && pathCompletion.confidence > 60}
		<div class="space-y-3">
			<div class="text-sm text-muted-foreground">
				<p class="font-medium">Path completion detected:</p>
				<p>{pathCompletion.reason}</p>
				<p class="text-xs">Confidence: {pathCompletion.confidence}%</p>
			</div>
			
			{#if suggestedPaths.length > 0}
				<div class="space-y-2">
					<p class="text-sm font-medium">Suggested next steps:</p>
					<div class="flex flex-wrap gap-2">
						{#each suggestedPaths as path}
							<Button
								variant="outline"
								size="sm"
								onclick={() => handleSwitchPath(path.id)}
								disabled={loading}
							>
								{path.name}
							</Button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
	
	<details class="text-sm">
		<summary class="cursor-pointer text-muted-foreground hover:text-foreground">
			Switch to different path
		</summary>
		<div class="mt-3 space-y-2">
			{#each availablePaths.filter(p => p.id !== currentPath) as path}
				<div class="flex items-start justify-between gap-3 p-2 border rounded">
					<div class="flex-1">
						<p class="font-medium">{path.name}</p>
						<p class="text-xs text-muted-foreground">{path.entryCondition}</p>
					</div>
					<Button
						variant="ghost"
						size="sm"
						onclick={() => handleSwitchPath(path.id)}
						disabled={loading}
					>
						Switch
					</Button>
				</div>
			{/each}
		</div>
	</details>
</div>