<script lang="ts">
	import { pb } from '$scripts/pocketbase';
	import type { TopicVersion } from '$routes/bullshift/learn/[id]/edit/schema';
	import { Button } from '$lib/components/ui/button';
	import Upload from 'lucide-svelte/icons/upload';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	interface Props {
		imageUrl?: string;
		currentVersion?: TopicVersion;
		onImageChange?: (filename: string) => void;
	}

	let { imageUrl, currentVersion, onImageChange }: Props = $props();

	let fileInput: HTMLInputElement;
	let uploading = $state(false);
	let deleting = $state(false);

	const handleFileUpload = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file || !currentVersion) return;

		uploading = true;

		try {
			const formData = new FormData();
			formData.append('image', file);

			// Update the current version record with the new image
			const updatedVersion = await pb
				.collection('topicVersions')
				.update(currentVersion.id, formData);

			// Call the callback to update the form data
			if (onImageChange && updatedVersion.image) {
				onImageChange(updatedVersion.image);
			}
		} catch (error) {
			console.error('Error uploading image:', error);
		} finally {
			uploading = false;
		}
	};

	const handleDeleteImage = async () => {
		if (!currentVersion) return;

		deleting = true;
		
		try {
			// Clear the image field in the database
			await pb.collection('topicVersions').update(currentVersion.id, {
				image: null
			});
			
			// Call the callback to update the form data
			if (onImageChange) {
				onImageChange('');
			}
		} catch (error) {
			console.error('Error deleting image:', error);
		} finally {
			deleting = false;
		}
	};

	const triggerFileInput = () => {
		fileInput.click();
	};
</script>

<div class="mb-4 flex items-center justify-between border rounded-lg p-2 bg-black/5">
	{#if imageUrl}
		<div class="flex-shrink-0 relative flex items-center justify-center rounded-lg">
			<img
				src={currentVersion
					? `${pb.baseUrl}/api/files/topicVersions/${currentVersion.id}/${imageUrl}`
					: ''}
				alt="Topic preview"
				class="h-16 max-w-full rounded"
			/>
		</div>
	{:else}
		<div
			class="flex h-16 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-100"
		>
			<span class="text-sm text-gray-500">None</span>
		</div>
	{/if}
	<div class="flex-shrink flex items-center justify-between gap-4">
		<div class="text-sm font-medium flex-shrink hidden md:block">{imageUrl}</div>
		<div class="flex items-center gap-2 flex-shrink-0">
			{#if imageUrl}
				<Button
					type="button"
					variant="destructive"
					size="sm"
					onclick={handleDeleteImage}
					disabled={deleting || uploading || !currentVersion}
					class="flex items-center gap-2"
				>
					<Trash2 class="h-4 w-4" />
					<div class="hidden md:block">
						{deleting ? 'Deleting...' : 'Löschen'}
					</div>
				</Button>
			{/if}
			<Button
				type="button"
				variant="outline"
				size="sm"
				onclick={triggerFileInput}
				disabled={uploading || deleting || !currentVersion}
				class="flex items-center gap-2"
			>
				<Upload class="h-4 w-4" />
				<div class="hidden md:block">
					{uploading ? 'Uploading...' : 'Upload'}
				</div>
			</Button>
		</div>
	</div>
	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		onchange={handleFileUpload}
		style="display: none;"
	/>
</div>
