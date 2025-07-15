<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs } from '$scripts/helpers';
	import { invalidateAll } from '$app/navigation';
	import type { TopicVersion, ContentBlock } from '../../routes/bullshift/learn/[slug]/edit/schema';
	import {
		topicVersionFormSchema,
		type TopicVersionFormSchema
	} from '../../routes/bullshift/learn/[slug]/edit/schema';
	import { type SuperValidated, type Infer, superForm, defaults } from 'sveltekit-superforms';
	import { zodClient, zod } from 'sveltekit-superforms/adapters';
	import VersionSelector from '$lib/components/VersionSelector.svelte';
	import SaveButton from '$lib/components/SaveButton.svelte';
	import BasicInfoForm from '$lib/components/BasicInfoForm.svelte';
	import ContentBlockListEditor from '$lib/components/ContentBlockListEditor.svelte';

	const { currentPage, topicId, onVersionDataChange }: { 
		currentPage: any; 
		topicId: string;
		onVersionDataChange?: (versionData: TopicVersion | null) => void;
	} = $props();

	let liveVersionId: string = $state('');
	let allVersions: TopicVersion[] = $state([]);
	let currentVersionId: string = $state('');
	let formElement: HTMLFormElement | null = null;
	let saveStatus: 'idle' | 'saving' | 'success' | 'error' = $state('idle');

	let currentVersion: TopicVersion | undefined = $derived(
		allVersions.find((version) => version.id === currentVersionId)
	);

	console.log('currentPage', currentPage);

	// Initialize form data
	const data: SuperValidated<Infer<TopicVersionFormSchema>> = defaults(zod(topicVersionFormSchema));

	const form = superForm(data, {
		validators: zodClient(topicVersionFormSchema),
		onSubmit: async ({ formData: submittedFormData, cancel }) => {
			// Cancel the default form submission since we're handling it client-side
			cancel();
			// Set saving status
			saveStatus = 'saving';

			// Handle form submission here
			console.log('Form submitted:', Object.fromEntries(submittedFormData));

			// Use the form store value which includes the content array
			const formValue = get(formData);
			const updatedData = {
				titleDE: formValue.titleDE,
				titleEN: formValue.titleEN,
				descriptionDE: formValue.descriptionDE,
				descriptionEN: formValue.descriptionEN,
				category: formValue.category,
				image: formValue.image,
				content: formValue.content || []
			};

			console.log('Updating with data:', updatedData);
			console.log('currentVersionId:', currentVersionId);

			if (!currentVersionId) {
				console.error('No version selected for update');
				saveStatus = 'error';
				setTimeout(() => {
					saveStatus = 'idle';
				}, 3000);
				return;
			}

			try {
				await pb.collection('topicVersions').update(currentVersionId, updatedData);
				console.log('Update successful');
				
				// Update the current version data to reflect the changes
				const updatedVersion = { ...currentVersion!, ...updatedData };
				
				// Update the allVersions array with the new data
				allVersions = allVersions.map(version => 
					version.id === currentVersionId ? updatedVersion as TopicVersion : version
				);
				
				// Notify parent about the updated version data for preview update
				onVersionDataChange?.(updatedVersion as TopicVersion);
				
				// Set success status
				saveStatus = 'success';
				// Invalidate all load functions to reload the page data
				await invalidateAll();
				// Reset status after 2 seconds
				setTimeout(() => {
					saveStatus = 'idle';
				}, 2000);
			} catch (error) {
				console.error('Error updating topic version:', error);
				// Set error status
				saveStatus = 'error';
				// Reset status after 3 seconds
				setTimeout(() => {
					saveStatus = 'idle';
				}, 3000);
			}
		}
	});

	const { form: formData, errors, enhance, delayed } = form;

	// Handle keyboard shortcuts
	const handleKeyDown = (event: KeyboardEvent) => {
		// Ignore keydown events from text inputs, textareas, and other editable elements
		const target = event.target as HTMLElement;
		if (target.tagName === 'INPUT' || 
		    target.tagName === 'TEXTAREA' || 
		    target.contentEditable === 'true' ||
		    target.closest('input') || 
		    target.closest('textarea')) {
			return;
		}
		
		// Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
		if ((event.ctrlKey || event.metaKey) && event.key === 's') {
			event.preventDefault();
			// Trigger form submission by finding and clicking the submit button
			if (formElement) {
				const submitButton = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
				if (submitButton && saveStatus === 'idle') {
					submitButton.click();
				}
			}
		}
	};

	// Update form data when currentVersion changes
	$effect(() => {
		if (currentVersion) {
			$formData.titleDE = currentVersion.titleDE;
			$formData.titleEN = currentVersion.titleEN;
			$formData.descriptionDE = currentVersion.descriptionDE;
			$formData.descriptionEN = currentVersion.descriptionEN;
			$formData.category = currentVersion.category;
			$formData.image = currentVersion.image;
			// Set content directly (now it's a flat array)
			$formData.content = currentVersion.content || [];
			
			// Notify parent about version data change
			onVersionDataChange?.(currentVersion);
		}
	});

	// Content change handler for ContentBlockListEditor
	const handleContentChange = (newContent: ContentBlock[]) => {
		$formData.content = newContent;
		
		// Update the preview immediately when content changes
		if (currentVersion) {
			const updatedVersion = {
				...currentVersion,
				content: newContent
			};
			onVersionDataChange?.(updatedVersion);
		}
	};

	// Watch for form data changes and update preview (for real-time editing)
	$effect(() => {
		if (currentVersion && $formData) {
			const updatedVersion = {
				...currentVersion,
				titleDE: $formData.titleDE || currentVersion.titleDE,
				titleEN: $formData.titleEN || currentVersion.titleEN,
				descriptionDE: $formData.descriptionDE || currentVersion.descriptionDE,
				descriptionEN: $formData.descriptionEN || currentVersion.descriptionEN,
				category: $formData.category || currentVersion.category,
				image: $formData.image || currentVersion.image,
				content: $formData.content || currentVersion.content || []
			};
			onVersionDataChange?.(updatedVersion);
		}
	});

	// Version selection handler
	const handleVersionSelect = (versionId: string) => {
		currentVersionId = versionId;
	};

	// Create new version handler
	const handleCreateNewVersion = async () => {
		try {
			// Use current version's category if available, otherwise empty string
			const categoryToUse = currentVersion?.category || '';
			
			const newVersion = await pb.collection('topicVersions').create({
				titleDE: 'New Version',
				titleEN: 'New Version',
				descriptionDE: '',
				descriptionEN: '',
				category: categoryToUse,
				image: '',
				content: [],
				topic: topicId
			});

			// Reload versions and select the new one
			await getVersions();
			currentVersionId = newVersion.id;
		} catch (error: any) {
			console.error('Error creating new version:', error);
		}
	};

	// Delete version handler
	const handleDeleteVersion = async (versionId: string) => {
		try {
			await pb.collection('topicVersions').delete(versionId);
			
			// Reload versions
			await getVersions();
			
			// If we deleted the current version, select another one
			if (currentVersionId === versionId) {
				if (allVersions.length > 0) {
					currentVersionId = allVersions[0].id;
				} else {
					currentVersionId = '';
				}
			}
		} catch (error: any) {
			console.error('Error deleting version:', error);
			alert('Failed to delete version. Please try again.');
		}
	};

	// Set version as live handler
	const handleSetAsLive = async (versionId: string) => {
		try {
			// Update the topic's currentVersion field to point to this version
			await pb.collection('topics').update(topicId, {
				currentVersion: versionId
			});
			
			// Update the local liveVersionId
			liveVersionId = versionId;
			
			console.log('Version set as live:', versionId);
			
			// Optionally invalidate to refresh the data
			await invalidateAll();
			
		} catch (error: any) {
			console.error('Error setting version as live:', error);
			alert('Failed to set version as live. Please try again.');
		}
	};

	// Convert old page structure to new flat structure
	const convertToFlatStructure = () => {
		const currentContent = $formData.content || [];
		
		// Check if it's already in the old format (has page objects)
		const isOldFormat = currentContent.some(item => 
			item && typeof item === 'object' && 'page' in item && 'content' in item
		);
		
		if (!isOldFormat) {
			alert('Content is already in the new flat format!');
			return;
		}
		
		// Convert from old format to new format
		const flatContent = [];
		
		// Sort by page number first
		const sortedPages = [...currentContent].sort((a, b) => a.page - b.page);
		
		// Extract all content blocks from all pages
		for (const page of sortedPages) {
			if (page.content && Array.isArray(page.content)) {
				flatContent.push(...page.content);
			}
		}
		
		// Update form data
		$formData.content = flatContent;
		
		// Update preview immediately
		onVersionDataChange?.({
			...currentVersion,
			content: flatContent
		});
		
		console.log('Converted from old format to new flat format:', flatContent);
		alert(`Converted ${currentContent.length} pages to ${flatContent.length} content blocks. Don't forget to save!`);
	};

	const getLiveVersionId = async () => {
		try {
			if (!topicId) {
				console.error('Missing topicId');
				return;
			}
			const record = await pb.collection('topics').getOne(topicId);
			liveVersionId = record.currentVersion || '';
			console.log('liveVersionId', liveVersionId);
		} catch (error) {
			console.error('Error getting live version:', error);
		}
	};

	const getVersions = async () => {
		try {
			if (!topicId) {
				console.error('Cannot get versions: Missing topicId');
				return;
			}
			
			const records = await pb.collection('topicVersions').getFullList({
				filter: `topic = "${topicId}"`,
				sort: '-created' // Sort by creation date, newest first
			});
			const data = serializeNonPOJOs(records) as TopicVersion[];
			allVersions = data;
			
			console.log('Found versions:', data.length);
			console.log('Live version ID from topic:', liveVersionId);
			
			if (data.length === 0) {
				console.error('No versions found for topic:', topicId);
				return;
			}
			
			// First priority: use the live version if it exists and is found
			if (liveVersionId && data.find(v => v.id === liveVersionId)) {
				currentVersionId = liveVersionId;
				console.log('Using live version:', liveVersionId);
			} else {
				// Second priority: use the most recent version (first in sorted list)
				currentVersionId = data[0]?.id || '';
				console.log('Using most recent version:', currentVersionId);
			}
			
			// Ensure we have a valid currentVersionId
			if (!currentVersionId) {
				console.error('Failed to set currentVersionId');
			}
			
			console.log('All versions:', data.map(v => ({ id: v.id, created: v.created })));
		} catch (error) {
			console.error('Error getting versions:', error);
		}
	};

	onMount(async () => {
		// First get the live version ID, then get all versions
		await getLiveVersionId();
		await getVersions();
		// Add global keyboard event listener
		document.addEventListener('keydown', handleKeyDown);
		
		// Debug current state after loading
		console.log('After loading - topicId:', topicId);
		console.log('After loading - allVersions:', allVersions.length);
		console.log('After loading - currentVersionId:', currentVersionId);
		console.log('After loading - liveVersionId:', liveVersionId);
	});

	onDestroy(() => {
		// Remove global keyboard event listener
		document.removeEventListener('keydown', handleKeyDown);
	});
</script>

<div class="h-full">
	<form method="POST" use:enhance class="flex h-full flex-col" bind:this={formElement}>
		<div class="absolute right-0 top-0 mb-4 flex w-full items-center justify-between gap-4 px-4 py-3">
			<VersionSelector
				{allVersions}
				{currentVersionId}
				{liveVersionId}
				onVersionChange={handleVersionSelect}
				onCreateNewVersion={handleCreateNewVersion}
			/>
			<SaveButton {saveStatus} />
		</div>

		<div class="max-container mt-20 flex-grow overflow-y-auto">
			<BasicInfoForm 
				{form} 
				{formData} 
				{currentVersion}
				{liveVersionId}
				onDeleteVersion={handleDeleteVersion}
				onSetAsLive={handleSetAsLive}
				canDelete={allVersions.length > 1}
			/>
			
			<!-- Migration button for old format -->
			{#if $formData.content && $formData.content.some(item => item && typeof item === 'object' && 'page' in item && 'content' in item)}
				<div class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-sm font-medium text-amber-800">Old Format Detected</h3>
							<p class="text-xs text-amber-700 mt-1">
								This content uses the old page structure. Convert it to the new flat structure for better performance.
							</p>
						</div>
						<button
							type="button"
							onclick={convertToFlatStructure}
							class="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 transition-colors"
						>
							Convert to New Format
						</button>
					</div>
				</div>
			{/if}
			
			<ContentBlockListEditor 
				content={$formData.content || []} 
				onContentChange={handleContentChange}
				{currentVersion}
			/>
		</div>
	</form>
</div>
