<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import type { TopicVersion } from '../../routes/bullshift/learn/[slug]/edit/schema';

	interface Props {
		allVersions: TopicVersion[];
		currentVersionId: string;
		liveVersionId: string;
		onVersionChange: (versionId: string) => void;
		onCreateNewVersion?: () => void;
	}

	let { allVersions, currentVersionId, liveVersionId, onVersionChange, onCreateNewVersion }: Props = $props();

	// Debug logging
	$effect(() => {
		console.log('VersionSelector - allVersions:', allVersions.length);
		console.log('VersionSelector - currentVersionId:', currentVersionId);
		console.log('VersionSelector - liveVersionId:', liveVersionId);
	});

	// Derived value for the selected version display
	let selectedVersionDisplay = $derived(
		!currentVersionId || !allVersions.length
			? 'Select a version'
			: (() => {
					const version = allVersions.find((v) => v.id === currentVersionId);
					if (!version) return 'Select a version';
					const isLive = version.id === liveVersionId;
					return `${version.id}${isLive ? ' (Live)' : ''}`;
				})()
	);
</script>

<div class="flex items-center gap-2">
	<span class="text-sm">Version</span>
	<Select.Root
		selected={currentVersionId ? { value: currentVersionId, label: selectedVersionDisplay } : undefined}
		onSelectedChange={(selected) => {
			if (selected) {
				console.log('Version changed to:', selected.value);
				onVersionChange(selected.value);
			}
		}}
	>
		<Select.Trigger class="max-w-[300px]">
			{selectedVersionDisplay}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Versionen</Select.Label>
				{#each allVersions as version}
					<Select.Item value={version.id} label={version.titleDE}>
						{version.id}
						{#if version.id === liveVersionId}
							<span class="ml-2 text-green-500">(Live)</span>
						{/if}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
		<Select.Input name="currentVersionId" value={currentVersionId} />
	</Select.Root>
	
	{#if onCreateNewVersion}
		<button
			onclick={onCreateNewVersion}
			class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
		>
			+ New Version
		</button>
	{/if}
</div> 