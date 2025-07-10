<script lang="ts">
	import { pb } from '$scripts/pocketbase';
	import type { TopicVersion } from '$routes/bullshift/learn/[slug]/edit/schema';
	import { Button } from '$lib/components/ui/button';
	import Upload from 'lucide-svelte/icons/upload';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import Play from 'lucide-svelte/icons/play';

	interface Props {
		currentVersion?: TopicVersion;
		onAudioUploaded?: (filename: string) => void;
	}

	let { currentVersion, onAudioUploaded }: Props = $props();

	let fileInput: HTMLInputElement;
	let uploading = $state(false);
	let uploadProgress = $state(0);

	const handleFileUpload = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file || !currentVersion) return;

		// Validate file type
		const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a'];
		if (!validTypes.includes(file.type)) {
			console.error('Invalid file type. Please select an audio file.');
			return;
		}

		// Validate file size (max 50MB)
		const maxSize = 50 * 1024 * 1024; // 50MB
		if (file.size > maxSize) {
			console.error('File too large. Maximum size is 50MB.');
			return;
		}

		uploading = true;
		uploadProgress = 0;

		try {
			const formData = new FormData();
			formData.append('media', file);

			// Update the current version record with the new audio file
			const updatedVersion = await pb
				.collection('topicVersions')
				.update(currentVersion.id, formData);

			// Generate the audio file URL
			const audioFilename = Array.isArray(updatedVersion.media) 
				? updatedVersion.media[updatedVersion.media.length - 1] 
				: updatedVersion.media;

			if (audioFilename && onAudioUploaded) {
				const audioUrl = `${pb.baseUrl}/api/files/topicVersions/${currentVersion.id}/${audioFilename}`;
				onAudioUploaded(audioUrl);
			}

			uploadProgress = 100;
		} catch (error) {
			console.error('Error uploading audio:', error);
		} finally {
			uploading = false;
			// Reset file input
			target.value = '';
		}
	};

	const triggerFileInput = () => {
		fileInput.click();
	};
</script>

<div class="mb-4">
	<div class="flex items-center gap-2 mb-2">
		<Button
			type="button"
			variant="outline"
			size="sm"
			onclick={triggerFileInput}
			disabled={uploading || !currentVersion}
			class="flex items-center gap-2"
		>
			<Upload class="h-4 w-4" />
			{uploading ? `Uploading... ${uploadProgress}%` : 'Upload Audio File'}
		</Button>
		
		{#if uploading}
			<div class="flex-1 bg-gray-200 rounded-full h-2">
				<div 
					class="bg-blue-500 h-2 rounded-full transition-all duration-300" 
					style="width: {uploadProgress}%"
				></div>
			</div>
		{/if}
	</div>

	<div class="text-xs text-gray-500">
		Supports MP3, WAV, OGG, M4A formats. Maximum file size: 50MB.
	</div>

	<input
		bind:this={fileInput}
		type="file"
		accept="audio/*"
		onchange={handleFileUpload}
		style="display: none;"
	/>
</div>