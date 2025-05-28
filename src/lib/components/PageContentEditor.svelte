<script lang="ts">
	import type { Content, ContentBlock } from '$routes/bullshift/learn/[id]/edit/schema';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import ContentBlockEditor from '$lib/components/ContentBlockEditor.svelte';
	import BlockTypeSelector from '$lib/components/BlockTypeSelector.svelte';
	import Plus from 'lucide-svelte/icons/plus';
	import Trash from 'lucide-svelte/icons/trash';
	import ChevronsUp from 'lucide-svelte/icons/chevron-up';
	import ChevronsDown from 'lucide-svelte/icons/chevron-down';

	interface Props {
		content: Content[];
		onContentChange: (content: Content[]) => void;
	}

	let { content, onContentChange }: Props = $props();

	let draggedBlockIndex: number | null = $state(null);
	let draggedPageIndex: number | null = $state(null);
	let openPageAccordions: Set<number> = $state(new Set([0])); // First page open by default

	// Content Management Functions
	const addPage = () => {
		const newPageNumber = content.length + 1;
		const newContent = [...content, { 
			page: newPageNumber, 
			name: `Page ${newPageNumber}`,
			content: [] 
		}];
		onContentChange(newContent);
		openPageAccordions.add(newPageNumber - 1);
	};

	const removePage = (pageIndex: number) => {
		const newContent = content.filter((_, index) => index !== pageIndex);
		// Renumber pages
		const renumberedContent = newContent.map((page, index) => ({ 
			...page, 
			page: index + 1,
			name: page.name || `Page ${index + 1}`
		}));
		onContentChange(renumberedContent);
		openPageAccordions.delete(pageIndex);
	};

	const updatePageName = (pageIndex: number, name: string) => {
		const newContent = [...content];
		newContent[pageIndex].name = name;
		onContentChange(newContent);
	};

	const addContentBlock = (pageIndex: number, blockType: ContentBlock['type']) => {
		let newBlock: ContentBlock;
		switch (blockType) {
			case 'text':
				newBlock = { type: 'text', content: '' };
				break;
			case 'list':
				newBlock = { type: 'list', items: [{ title: '', text: '' }] };
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
			case 'taskCompletion':
				newBlock = { type: 'taskCompletion', allowNotes: true };
				break;
			case 'sortable':
				newBlock = { 
					type: 'sortable', 
					bucketA: 'Bucket A', 
					bucketB: 'Bucket B', 
					items: [{ text: '', correctBucket: 'A' }] 
				};
				break;
			case 'multipleChoice':
				newBlock = { 
					type: 'multipleChoice', 
					questions: [{
						question: '', 
						options: [
							{ text: '', isCorrect: false },
							{ text: '', isCorrect: false },
							{ text: '', isCorrect: false },
							{ text: '', isCorrect: false }
						],
						explanation: ''
					}],
					allowMultiple: false
				};
				break;
			default:
				return;
		}

		const newContent = [...content];
		newContent[pageIndex].content = [...newContent[pageIndex].content, newBlock];
		onContentChange(newContent);
	};

	const removeContentBlock = (pageIndex: number, blockIndex: number) => {
		const newContent = [...content];
		newContent[pageIndex].content = newContent[pageIndex].content.filter(
			(_, index) => index !== blockIndex
		);
		onContentChange(newContent);
	};

	const moveBlockUp = (pageIndex: number, blockIndex: number) => {
		if (blockIndex === 0) return;
		const newContent = [...content];
		const blocks = [...newContent[pageIndex].content];
		[blocks[blockIndex - 1], blocks[blockIndex]] = [blocks[blockIndex], blocks[blockIndex - 1]];
		newContent[pageIndex].content = blocks;
		onContentChange(newContent);
	};

	const moveBlockDown = (pageIndex: number, blockIndex: number) => {
		if (blockIndex === content[pageIndex].content.length - 1) return;
		const newContent = [...content];
		const blocks = [...newContent[pageIndex].content];
		[blocks[blockIndex], blocks[blockIndex + 1]] = [blocks[blockIndex + 1], blocks[blockIndex]];
		newContent[pageIndex].content = blocks;
		onContentChange(newContent);
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
		if (draggedBlockIndex === null || draggedPageIndex === null) return;

		const newContent = [...content];
		const draggedBlock = newContent[draggedPageIndex].content[draggedBlockIndex];

		// Remove from source
		newContent[draggedPageIndex].content = newContent[draggedPageIndex].content.filter(
			(_, index) => index !== draggedBlockIndex
		);

		// Add to target
		newContent[targetPageIndex].content.splice(targetBlockIndex, 0, draggedBlock);

		onContentChange(newContent);
		draggedBlockIndex = null;
		draggedPageIndex = null;
	};

	const handlePageDrop = (event: DragEvent, targetPageIndex: number) => {
		event.preventDefault();
		if (draggedPageIndex === null) return;

		const newContent = [...content];
		const draggedPage = newContent[draggedPageIndex];

		// Remove from source
		const filteredContent = newContent.filter((_, index) => index !== draggedPageIndex);

		// Add to target
		filteredContent.splice(targetPageIndex, 0, draggedPage);

		// Renumber pages
		const renumberedContent = filteredContent.map((page, index) => ({ 
			...page, 
			page: index + 1,
			name: page.name || `Page ${index + 1}`
		}));

		onContentChange(renumberedContent);
		draggedPageIndex = null;
	};

	// Helper function to update block content
	const updateBlockContent = (pageIndex: number, blockIndex: number, field: string, value: any) => {
		const newContent = [...content];
		newContent[pageIndex].content[blockIndex] = {
			...newContent[pageIndex].content[blockIndex],
			[field]: value
		};
		onContentChange(newContent);
	};
</script>

<div class="mt-8">
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-lg font-semibold">Content Pages</h3>
		<button
			type="button"
			onclick={addPage}
			class="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600 flex items-center gap-2"
		>
			Add Page
			<Plus class="size-4 -ml-1" />
		</button>
	</div>

	{#if content && content.length > 0}
		{#each content as page, pageIndex (page.page)}
			<div
				class="mb-4 rounded-lg border bg-gray-50 overflow-hidden"
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
							class="size-6 rounded bg-red-500 p-1 text-xs text-white hover:bg-red-600 flex items-center justify-center gap-2"
						>
							<Trash class="size-3" />
						</button>
						<span class="text-gray-500">
							{#if openPageAccordions.has(pageIndex)}
								<ChevronsUp class="size-4" />
							{:else}
								<ChevronsDown class="size-4" />
							{/if}
						</span>
					</div>
				</div>

				<!-- Page Content (Accordion) -->
				{#if openPageAccordions.has(pageIndex)}
					<div class="border-t bg-white p-4">
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
						<!-- Add Block Buttons -->
						<div class="mb-4 flex flex-wrap gap-2">
							<BlockTypeSelector onAddBlock={(type) => addContentBlock(pageIndex, type)} />
						</div>
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