<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import { invalidateAll } from '$app/navigation';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import type {
		TopicVersion,
		Content,
		ContentBlock
	} from '$routes/bullshift/learn/[id]/edit/schema';
	import {
		topicVersionFormSchema,
		type TopicVersionFormSchema
	} from '$routes/bullshift/learn/[id]/edit/schema';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { type SuperValidated, type Infer, superForm, defaults } from 'sveltekit-superforms';
	import { zodClient, zod } from 'sveltekit-superforms/adapters';
	import * as Select from '$lib/components/ui/select/index.js';
	import { marked } from 'marked';
	import ContentBlockEditor from '$lib/components/ContentBlockEditor.svelte';
	import BlockTypeSelector from '$lib/components/BlockTypeSelector.svelte';

	const { currentPage, topicId } = $props();

	let liveVersionId: string = $state('');
	let allVersions: TopicVersion[] = $state([]);
	let currentVersionId: string = $state('');
	let draggedBlockIndex: number | null = $state(null);
	let draggedPageIndex: number | null = $state(null);
	let openPageAccordions: Set<number> = $state(new Set([0])); // First page open by default
	let formElement: HTMLFormElement | null = null;
	let saveStatus: 'idle' | 'saving' | 'success' | 'error' = $state('idle');
	let imageLoading: boolean = $state(false);
	let imageError: boolean = $state(false);

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
	// Content Management Functions
	const addPage = () => {
		if (!$formData.content) $formData.content = [];
		const newPageNumber = $formData.content.length + 1;
		$formData.content = [...$formData.content, { 
			page: newPageNumber, 
			name: `Page ${newPageNumber}`,
			content: [] 
		}];
		openPageAccordions.add(newPageNumber - 1);
	};
	const removePage = (pageIndex: number) => {
		if (!$formData.content) return;
		$formData.content = $formData.content.filter(
			(_, index) => index !== pageIndex
		);
		// Renumber pages
		$formData.content = $formData.content.map((page, index) => ({ 
			...page, 
			page: index + 1,
			name: page.name || `Page ${index + 1}` // Ensure name exists
		}));
		openPageAccordions.delete(pageIndex);
	};
	const updatePageName = (pageIndex: number, name: string) => {
		if (!$formData.content) return;
		$formData.content[pageIndex].name = name;
	};
	const addContentBlock = (pageIndex: number, blockType: ContentBlock['type']) => {
		if (!$formData.content) $formData.content = [];

		let newBlock: ContentBlock;
		switch (blockType) {
			case 'text':
				newBlock = { type: 'text', content: '' };
				break;
			case 'list':
				newBlock = { type: 'list', items: [''] };
				break;
			case 'heading':
				newBlock = { type: 'heading', hierarchy: 1, content: '' };
				break;
			case 'task':
				newBlock = { type: 'task', duration: 0, content: '' };
				break;
			case 'timer':
				newBlock = { type: 'timer', duration: 60 };
				break;
			case 'bodymap':
				newBlock = { type: 'bodymap' };
				break;
			default:
				return;
		}

		$formData.content[pageIndex].content = [...$formData.content[pageIndex].content, newBlock];
	};
	const removeContentBlock = (pageIndex: number, blockIndex: number) => {
		if (!$formData.content) return;
		$formData.content[pageIndex].content = $formData.content[pageIndex].content.filter(
			(_, index) => index !== blockIndex
		);
	};
	const moveBlockUp = (pageIndex: number, blockIndex: number) => {
		if (!$formData.content || blockIndex === 0) return;
		const blocks = [...$formData.content[pageIndex].content];
		[blocks[blockIndex - 1], blocks[blockIndex]] = [blocks[blockIndex], blocks[blockIndex - 1]];
		$formData.content[pageIndex].content = blocks;
	};
	const moveBlockDown = (pageIndex: number, blockIndex: number) => {
		if (!$formData.content || blockIndex === $formData.content[pageIndex].content.length - 1)
			return;
		const blocks = [...$formData.content[pageIndex].content];
		[blocks[blockIndex], blocks[blockIndex + 1]] = [blocks[blockIndex + 1], blocks[blockIndex]];
		$formData.content[pageIndex].content = blocks;
	};
	const addListItem = (pageIndex: number, blockIndex: number) => {
		if (!$formData.content) return;
		const block = $formData.content[pageIndex].content[blockIndex];
		if (block.type === 'list') {
			block.items = [...block.items, ''];
		}
	};
	const removeListItem = (pageIndex: number, blockIndex: number, itemIndex: number) => {
		if (!$formData.content) return;
		const block = $formData.content[pageIndex].content[blockIndex];
		if (block.type === 'list') {
			block.items = block.items.filter((_, index) => index !== itemIndex);
		}
	};
	const togglePageAccordion = (pageIndex: number) => {
		if (openPageAccordions.has(pageIndex)) {
			openPageAccordions.delete(pageIndex);
		} else {
			openPageAccordions.add(pageIndex);
		}
		openPageAccordions = new Set(openPageAccordions);
	};
	// Drag and Drop Functions
	const handleDragStart = (
		event: DragEvent,
		type: 'block' | 'page',
		pageIndex: number,
		blockIndex?: number
	) => {
		if (type === 'block' && blockIndex !== undefined) {
			draggedBlockIndex = blockIndex;
			draggedPageIndex = pageIndex;
		} else if (type === 'page') {
			draggedPageIndex = pageIndex;
		}
		event.dataTransfer!.effectAllowed = 'move';
	};
	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'move';
	};
	const handleBlockDrop = (event: DragEvent, targetPageIndex: number, targetBlockIndex: number) => {
		event.preventDefault();
		if (!$formData.content || draggedBlockIndex === null || draggedPageIndex === null) return;

		const draggedBlock = $formData.content[draggedPageIndex].content[draggedBlockIndex];

		// Remove from source
		$formData.content[draggedPageIndex].content = $formData.content[
			draggedPageIndex
		].content.filter((_, index) => index !== draggedBlockIndex);

		// Add to target
		$formData.content[targetPageIndex].content.splice(targetBlockIndex, 0, draggedBlock);

		draggedBlockIndex = null;
		draggedPageIndex = null;
	};
	const handlePageDrop = (event: DragEvent, targetPageIndex: number) => {
		event.preventDefault();
		if (!$formData.content || draggedPageIndex === null) return;

		const draggedPage = $formData.content[draggedPageIndex];

		// Remove from source
		$formData.content = $formData.content.filter((_, index) => index !== draggedPageIndex);

		// Add to target
		$formData.content.splice(targetPageIndex, 0, draggedPage);

		// Renumber pages
		$formData.content = $formData.content.map((page, index) => ({ 
			...page, 
			page: index + 1,
			name: page.name || `Page ${index + 1}` // Ensure name exists
		}));

		draggedPageIndex = null;
	};
	// Helper function to update block content
	const updateBlockContent = (pageIndex: number, blockIndex: number, field: string, value: any) => {
		if (!$formData.content) return;
		$formData.content[pageIndex].content[blockIndex] = {
			...$formData.content[pageIndex].content[blockIndex],
			[field]: value
		};
	};
	const updateListItem = (
		pageIndex: number,
		blockIndex: number,
		itemIndex: number,
		value: string
	) => {
		if (!$formData.content) return;
		const block = $formData.content[pageIndex].content[blockIndex];
		if (block.type === 'list') {
			const newItems = [...block.items];
			newItems[itemIndex] = value;
			updateBlockContent(pageIndex, blockIndex, 'items', newItems);
		}
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
	const handleVersionSelect = (value: string) => {
		currentVersionId = value;
	};

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

	const handleImageLoad = () => {
		imageLoading = false;
		imageError = false;
	};

	const handleImageError = () => {
		imageLoading = false;
		imageError = true;
	};

	const handleImageStart = () => {
		if ($formData.image) {
			imageLoading = true;
			imageError = false;
		}
	};

	// Derived value to check if image URL is valid
	let isValidImageUrl = $derived(
		$formData.image && 
		$formData.image.trim().length > 0
	);

	// Reset image loading state when URL changes
	$effect(() => {
		if ($formData.image) {
			handleImageStart();
		} else {
			imageLoading = false;
			imageError = false;
		}
	});

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
		<div class="absolute right-0 top-0 mb-4 flex w-full items-center justify-between gap-4">
			<div>
				<div class="flex items-center gap-2">
					<span>Version</span>
					<Select.Root
						type="single"
						bind:value={currentVersionId}
						onValueChange={handleVersionSelect}
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
						<Select.Input name="currentVersionId" bind:value={currentVersionId} />
					</Select.Root>
				</div>
			</div>
			<button
				type="submit"
				disabled={saveStatus === 'saving'}
				class="flex items-center gap-2 rounded px-4 py-2 text-white transition-all duration-200 {saveStatus ===
				'saving'
					? 'cursor-not-allowed bg-blue-400'
					: saveStatus === 'success'
						? 'bg-green-500 hover:bg-green-600'
						: saveStatus === 'error'
							? 'bg-red-500 hover:bg-red-600'
							: 'bg-blue-500 hover:bg-blue-600'}"
			>
				{#if saveStatus === 'saving'}
					<Loader2 class="h-4 w-4 animate-spin" />
					Saving...
				{:else if saveStatus === 'success'}
					<Check class="h-4 w-4" />
					Saved!
				{:else if saveStatus === 'error'}
					<X class="h-4 w-4" />
					Error
				{:else}
					Save Topic Version
				{/if}
			</button>
		</div>

		<div class="max-container mt-20 flex-grow overflow-y-auto">
			<Form.Field {form} name="titleDE">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>German Title</Form.Label>
						<Input {...attrs} bind:value={$formData.titleDE} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="titleEN">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>English Title</Form.Label>
						<Input {...attrs} bind:value={$formData.titleEN} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="descriptionDE">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>German Description</Form.Label>
						<Textarea {...attrs} bind:value={$formData.descriptionDE} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="descriptionEN">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>English Description</Form.Label>
						<Textarea {...attrs} bind:value={$formData.descriptionEN} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="category">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Category</Form.Label>
						<Input {...attrs} bind:value={$formData.category} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="image">
				<Form.Control>
					{#snippet children({ attrs }: { attrs: any })}
						<Form.Label>Image URL</Form.Label>
						<Input {...attrs} bind:value={$formData.image} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<!-- Image Preview -->
			{#if $formData.image}
				<div class="mb-4">
					<div class="text-sm font-medium mb-2">Image Preview</div>
					<img 
						src={currentVersion ? `${pb.baseUrl}/api/files/topicVersions/${currentVersion.id}/${$formData.image}` : ''} 
						alt="Topic preview" 
						class="max-w-full max-h-64 rounded border"
					/>
				</div>
			{/if}

			<!-- Content Editor -->
			<div class="mt-8">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-semibold">Content Pages</h3>
					<button
						type="button"
						onclick={addPage}
						class="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
					>
						Add Page
					</button>
				</div>

				{#if $formData.content && $formData.content.length > 0}
					{#each $formData.content as page, pageIndex (page.page)}
						<div
							class="mb-4 rounded-lg border bg-gray-50"
							draggable="true"
							role="listitem"
							ondragstart={(e: DragEvent) => handleDragStart(e, 'page', pageIndex)}
							ondragover={handleDragOver}
							ondrop={(e: DragEvent) => handlePageDrop(e, pageIndex)}
						>
							<!-- Page Header -->
							<div
								class="flex cursor-pointer items-center justify-between p-3 hover:bg-gray-100"
								tabindex="0"
								role="button"
								onclick={() => togglePageAccordion(pageIndex)}
								onkeydown={(e: KeyboardEvent) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										togglePageAccordion(pageIndex);
									}
								}}
							>
								<div class="flex items-center gap-2">
									<span class="text-gray-400">⋮⋮</span>
									<div class="flex items-center gap-2">
										<span class="text-sm text-gray-500">#{page.page}</span>
										<Input
											value={page.name}
											oninput={(e: Event) => {
												e.stopPropagation();
												const target = e.target as HTMLInputElement;
												updatePageName(pageIndex, target.value);
											}}
											onclick={(e: Event) => e.stopPropagation()}
											onkeydown={(e: KeyboardEvent) => e.stopPropagation()}
											class="h-6 text-sm font-medium border-none bg-transparent px-1 hover:bg-white focus:bg-white"
											placeholder="Page name..."
										/>
									</div>
									<span class="text-sm text-gray-500">({page.content.length} blocks)</span>
								</div>
								<div class="flex items-center gap-2">
									<button
										type="button"
										onclick={(e: Event) => {
											e.stopPropagation();
											removePage(pageIndex);
										}}
										class="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
									>
										Delete
									</button>
									<span class="text-gray-500">
										{openPageAccordions.has(pageIndex) ? '▼' : '▶'}
									</span>
								</div>
							</div>

							<!-- Page Content (Accordion) -->
							{#if openPageAccordions.has(pageIndex)}
								<div class="border-t bg-white p-4">
									<!-- Add Block Buttons -->
									<div class="mb-4 flex flex-wrap gap-2">
										<span class="text-sm font-medium text-gray-600">Add Block:</span>
										<BlockTypeSelector onAddBlock={(type) => addContentBlock(pageIndex, type)} />
									</div>

									<!-- Content Blocks -->
									{#if page.content.length === 0}
										<p class="py-8 text-center text-gray-500">
											No content blocks yet. Add one above!
										</p>
									{:else}
										{#each page.content as block, blockIndex (blockIndex)}
											<ContentBlockEditor
												{block}
												{pageIndex}
												{blockIndex}
												onUpdate={(field, value) =>
													updateBlockContent(pageIndex, blockIndex, field, value)}
												onMoveUp={() => moveBlockUp(pageIndex, blockIndex)}
												onMoveDown={() => moveBlockDown(pageIndex, blockIndex)}
												onRemove={() => removeContentBlock(pageIndex, blockIndex)}
												canMoveUp={blockIndex > 0}
												canMoveDown={blockIndex < page.content.length - 1}
											/>
										{/each}
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				{:else}
					<div class="py-8 text-center text-gray-500">
						<p>No content pages yet.</p>
						<button
							type="button"
							onclick={addPage}
							class="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						>
							Create First Page
						</button>
					</div>
				{/if}
			</div>
		</div>
	</form>
</div>
