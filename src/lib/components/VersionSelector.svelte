<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import type { TopicVersion } from '$routes/bullshift/learn/[id]/edit/schema';

	interface Props {
		allVersions: TopicVersion[];
		currentVersionId: string;
		liveVersionId: string;
		onVersionChange: (versionId: string) => void;
	}

	let { allVersions, currentVersionId, liveVersionId, onVersionChange }: Props = $props();

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
		onSelectedChange={(selected) => {
			if (selected) {
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
</div> 