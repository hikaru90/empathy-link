<script lang="ts">
	import type { ContentBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
	import ContentBlockEditor from '$lib/components/ContentBlockEditor.svelte';
	import BlockTypeSelector from '$lib/components/BlockTypeSelector.svelte';
	import Plus from 'lucide-svelte/icons/plus';
	import Trash from 'lucide-svelte/icons/trash';
	import ChevronsUp from 'lucide-svelte/icons/chevron-up';
	import ChevronsDown from 'lucide-svelte/icons/chevron-down';
	import GripVertical from 'lucide-svelte/icons/grip-vertical';

	interface Props {
		content: ContentBlock[];
		onContentChange: (content: ContentBlock[]) => void;
		currentVersion?: any;
	}

	let { content, onContentChange, currentVersion }: Props = $props();

	let draggedBlockIndex: number | null = $state(null);
	let dragOverIndex: number | null = $state(null);
	let collapsedBlocks: boolean[] = $state(new Array(content.length).fill(true));

	// Create preview array while dragging
	let previewContent = $state(content);

	$effect(() => {
		if (draggedBlockIndex === null || dragOverIndex === null) {
			previewContent = content;
		} else {
			const newContent = [...content];
			const [draggedItem] = newContent.splice(draggedBlockIndex, 1);
			newContent.splice(dragOverIndex, 0, draggedItem);
			previewContent = newContent;
		}
	});

	// Content Management Functions
	// Update collapsed state when content changes
	$effect(() => {
		collapsedBlocks = new Array(content.length).fill(true);
	});

	const toggleBlockCollapse = (blockIndex: number) => {
		collapsedBlocks[blockIndex] = !collapsedBlocks[blockIndex];
	};

	const addContentBlock = (blockType: ContentBlock['type']) => {
		let newBlock: ContentBlock;
		switch (blockType) {
			case 'text':
				newBlock = { type: 'text', content: '' };
				break;
			case 'list':
				newBlock = { type: 'list', items: [{ title: '', text: '' }] };
				break;
			case 'heading':
				newBlock = { type: 'heading', hierarchy: 1, content: '', subheading: '' };
				break;
			case 'task':
				newBlock = { type: 'task', content: '' };
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
					items: [{ text: 'Item 1', correctBucket: 'A' }]
				};
				break;
			case 'multipleChoice':
				newBlock = {
					type: 'multipleChoice',
					questions: [
						{
							question: 'Question?',
							options: [
								{ text: 'Option 1', isCorrect: true },
								{ text: 'Option 2', isCorrect: false }
							]
						}
					]
				};
				break;
			case 'aiQuestion':
				newBlock = {
					type: 'aiQuestion',
					question: 'Your question here?',
					systemPrompt:
						"You are a helpful learning assistant. Provide constructive feedback on the user's answer.",
					placeholder: 'Write your answer here...'
				};
				break;
			case 'aiQuestionStep':
				newBlock = {
					type: 'aiQuestionStep',
					question: 'Your question here?',
					systemPrompt:
						"You are a helpful learning assistant. Provide constructive feedback on the user's answer.",
					placeholder: 'Write your answer here...'
				};
				break;
			case 'aiResponseStep':
				newBlock = {
					type: 'aiResponseStep',
					question: 'Your question here?',
					systemPrompt:
						"You are a helpful learning assistant. Provide constructive feedback on the user's answer.",
					placeholder: 'Write your answer here...'
				};
				break;
			case 'image':
				newBlock = { type: 'image', src: '', alt: 'Image description' };
				break;
			case 'audio':
				newBlock = {
					type: 'audio',
					src: '',
					title: 'Audio Title',
					content: 'Audio description',
					controls: true,
					autoplay: false,
					loop: false
				};
				break;
			case 'nextPage':
				newBlock = { type: 'nextPage', text: 'Next' };
				break;
			case 'pageNavigation':
				newBlock = { type: 'pageNavigation', showNext: true, showPrev: false };
				break;
			default:
				newBlock = { type: 'text', content: 'New content block' };
		}

		const newContent = [...content, newBlock];
		onContentChange(newContent);
	};

	const removeContentBlock = (blockIndex: number) => {
		const newContent = content.filter((_, index) => index !== blockIndex);
		onContentChange(newContent);
	};

	const updateContentBlock = (blockIndex: number, updatedBlock: ContentBlock) => {
		const newContent = [...content];
		newContent[blockIndex] = updatedBlock;
		onContentChange(newContent);
	};

	const moveContentBlock = (fromIndex: number, toIndex: number) => {
		if (toIndex < 0 || toIndex >= content.length) return;

		const newContent = [...content];
		const [movedBlock] = newContent.splice(fromIndex, 1);
		newContent.splice(toIndex, 0, movedBlock);
		onContentChange(newContent);
	};

	const duplicateContentBlock = (blockIndex: number) => {
		const blockToDuplicate = content[blockIndex];
		const duplicatedBlock = JSON.parse(JSON.stringify(blockToDuplicate));

		const newContent = [...content];
		newContent.splice(blockIndex + 1, 0, duplicatedBlock);
		onContentChange(newContent);
	};

	// Drag and Drop functions
	const handleDragStart = (e: DragEvent, blockIndex: number) => {
		console.log('🎯 Drag started for block:', blockIndex);
		draggedBlockIndex = blockIndex;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', '');
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		const target = e.currentTarget as HTMLElement;
		const overIndex = parseInt(target.dataset.blockIndex || '0');
		dragOverIndex = overIndex;
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		const target = e.currentTarget as HTMLElement;
		const dropIndex = parseInt(target.dataset.blockIndex || '0');
		if (draggedBlockIndex !== null && draggedBlockIndex !== dropIndex) {
			moveContentBlock(draggedBlockIndex, dropIndex);
		}
		draggedBlockIndex = null;
		dragOverIndex = null;
	};

	const handleDragEnd = () => {
		draggedBlockIndex = null;
		dragOverIndex = null;
	};
</script>

<div class="space-y-4">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">Content Blocks</h2>
		<div class="flex items-center gap-2">
			<BlockTypeSelector onSelectType={addContentBlock} />
		</div>
	</div>

	<!-- Content Blocks List -->
	<div class="space-y-1">
		{#each previewContent as block, blockIndex}
			<div
				class="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200"
				class:ring-2={draggedBlockIndex !== null && dragOverIndex === blockIndex}
				class:ring-blue-400={draggedBlockIndex !== null && dragOverIndex === blockIndex}
				class:bg-blue-50={draggedBlockIndex !== null && dragOverIndex === blockIndex}
				data-block-index={blockIndex}
				ondragover={handleDragOver}
				ondrop={handleDrop}
				role="region"
				aria-label="Content block {blockIndex + 1}"
			>
				<!-- Collapsible Header -->
				<div
					class="bg-alsmostwhite flex cursor-pointer items-center justify-between border-b p-1 hover:bg-gray-100"
					onclick={() => toggleBlockCollapse(blockIndex)}
					role="button"
					tabindex="0"
					onkeydown={(e) => e.key === 'Enter' && toggleBlockCollapse(blockIndex)}
				>
					<div class="flex items-center gap-2">
						<!-- Drag Handle -->
						<div
							draggable="true"
							ondragstart={(e) => handleDragStart(e, blockIndex)}
							ondragend={handleDragEnd}
							onclick={(e) => e.stopPropagation()}
							onkeydown={(e) => e.stopPropagation()}
							title="Drag to reorder"
							aria-label="Drag to reorder"
							role="button"
							tabindex="0"
							class="rounded p-1 text-black/20 hover:text-black/60 hover:cursor-grab active:cursor-grabbing"
						>
							<GripVertical class="size-4" />
						</div>

						<div class="flex items-center justify-center size-2">
							<span class="text-2xs text-gray-500">{collapsedBlocks[blockIndex] ? '▶' : '▼'}</span>
						</div>
						<span class="text-sm font-medium capitalize">{block.type}</span>
						<span class="text-xs text-gray-400">#{blockIndex + 1}</span>
					</div>
					<div class="flex items-center gap-1 p-1">
						<!-- Move up -->
						<button
							type="button"
							onclick={(e) => {
								e.stopPropagation();
								moveContentBlock(blockIndex, blockIndex - 1);
							}}
							disabled={blockIndex === 0}
							class="rounded bg-gray-200 px-1 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
						>
							↑
						</button>
						<!-- Move down -->
						<button
							type="button"
							onclick={(e) => {
								e.stopPropagation();
								moveContentBlock(blockIndex, blockIndex + 1);
							}}
							disabled={blockIndex === content.length - 1}
							class="rounded bg-gray-200 px-1 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
						>
							↓
						</button>
						<!-- Duplicate -->
						<button
							type="button"
							onclick={(e) => {
								e.stopPropagation();
								duplicateContentBlock(blockIndex);
							}}
							class="rounded bg-gray-200 px-1 py-1 text-xs hover:bg-gray-300"
							title="Duplicate block"
						>
							+
						</button>
						<!-- Delete -->
						<button
							type="button"
							onclick={(e) => {
								e.stopPropagation();
								removeContentBlock(blockIndex);
							}}
							class="rounded bg-red-200 px-1 py-1 text-xs text-red-700 hover:bg-red-300"
						>
							✕
						</button>
					</div>
				</div>

				<!-- Block Editor (conditionally shown) -->
				{#if !collapsedBlocks[blockIndex]}
					<ContentBlockEditor
						{block}
						pageIndex={blockIndex}
						{blockIndex}
						{currentVersion}
						onUpdate={(field, value) => {
							const updatedBlock = { ...block, [field]: value };
							updateContentBlock(blockIndex, updatedBlock);
						}}
						onMoveUp={() => moveContentBlock(blockIndex, blockIndex - 1)}
						onMoveDown={() => moveContentBlock(blockIndex, blockIndex + 1)}
						onRemove={() => removeContentBlock(blockIndex)}
						canMoveUp={blockIndex > 0}
						canMoveDown={blockIndex < content.length - 1}
					/>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Add Block Button -->
	{#if content.length === 0}
		<div class="py-8 text-center">
			<p class="mb-4 text-gray-500">No content blocks yet</p>
			<BlockTypeSelector onSelectType={addContentBlock} />
		</div>
	{/if}
</div>
