<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs } from '$scripts/helpers';
	import { invalidateAll } from '$app/navigation';
	import type { TopicVersion, Content } from '$routes/bullshift/learn/[id]/edit/schema';
	import {
		topicVersionFormSchema,
		type TopicVersionFormSchema
	} from '$routes/bullshift/learn/[id]/edit/schema';
	import { type SuperValidated, type Infer, superForm, defaults } from 'sveltekit-superforms';
	import { zodClient, zod } from 'sveltekit-superforms/adapters';
	import VersionSelector from '$lib/components/VersionSelector.svelte';
	import SaveButton from '$lib/components/SaveButton.svelte';
	import BasicInfoForm from '$lib/components/BasicInfoForm.svelte';
	import PageContentEditor from '$lib/components/PageContentEditor.svelte';

	const { currentPage, topicId } = $props();

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

			try {
				await pb.collection('topicVersions').update(currentVersionId, updatedData);
				console.log('Update successful');
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
		// Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
		if ((event.ctrlKey || event.metaKey) && event.key === 's') {
			event.preventDefault();
			// Trigger form submission by finding and clicking the submit button
			const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
			if (submitButton && saveStatus === 'idle') {
				submitButton.click();
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
			// Ensure all pages have names, add default names if missing
			$formData.content = (currentVersion.content || []).map((page, index) => ({
				...page,
				name: page.name || `Page ${page.page || index + 1}`
			}));
		}
	});

	// Content change handler for PageContentEditor
	const handleContentChange = (newContent: Content[]) => {
		$formData.content = newContent;
	};

	// Version selection handler
	const handleVersionSelect = (versionId: string) => {
		currentVersionId = versionId;
	};

	const getLiveVersionId = async () => {
		try {
			const record = await pb.collection('topics').getOne(topicId);
			liveVersionId = record.currentVersion || '';
			console.log('liveVersionId', liveVersionId);
		} catch (error) {
			console.error('Error getting live version:', error);
		}
	};

	const getVersions = async () => {
		try {
			const records = await pb.collection('topicVersions').getFullList({
				filter: `topic = "${topicId}"`
			});
			const data = serializeNonPOJOs(records) as TopicVersion[];
			allVersions = data;
			currentVersionId = data[data.length - 1]?.id || '';
			console.log('data', data);
		} catch (error) {
			console.error('Error getting versions:', error);
		}
	};

	onMount(async () => {
		await getLiveVersionId();
		await getVersions();
		// Add global keyboard event listener
		document.addEventListener('keydown', handleKeyDown);
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
			/>
			<SaveButton {saveStatus} />
		</div>

		<div class="max-container mt-20 flex-grow overflow-y-auto">
			<BasicInfoForm {form} {formData} {currentVersion} />
			<PageContentEditor content={$formData.content || []} onContentChange={handleContentChange} />
		</div>
	</form>
</div>
