<script lang="ts">
	import type { ContentBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
	import ContentBlockEditor from '$lib/components/ContentBlockEditor.svelte';
	import BlockTypeSelector from '$lib/components/BlockTypeSelector.svelte';
	import Plus from 'lucide-svelte/icons/plus';
	import Trash from 'lucide-svelte/icons/trash';
	import ChevronsUp from 'lucide-svelte/icons/chevron-up';
	import ChevronsDown from 'lucide-svelte/icons/chevron-down';
	import GripVertical from 'lucide-svelte/icons/grip-vertical';
	import Copy from 'lucide-svelte/icons/copy';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		content: ContentBlock[];
		onContentChange: (content: ContentBlock[]) => void;
		currentVersion?: any;
		onBlockClick?: (blockIndex: number) => void;
	}

	let { content, onContentChange, currentVersion, onBlockClick }: Props = $props();

	let draggedBlockIndex: number | null = $state(null);
	let dragOverIndex: number | null = $state(null);

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
	const addContentBlock = (blockType: ContentBlock['type']) => {
		let newBlock: ContentBlock;
		switch (blockType) {
			case 'text':
				newBlock = { type: 'text', content: '' };
				break;
			case 'list':
				newBlock = { type: 'list', items: [{ title: '', text: '' }] };
				break;
			case 'task':
				newBlock = { type: 'task', content: '' };
				break;
			case 'timer':
				newBlock = { type: 'timer', duration: 60 };
				break;
			case 'breathe':
				newBlock = { type: 'breathe', duration: 60 };
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

	// Handle keyboard shortcuts
	const handleKeyDown = (event: KeyboardEvent) => {
		// Ignore keydown events from text inputs, textareas, and other editable elements
		const target = event.target as HTMLElement;
		if (target.tagName === 'INPUT' || 
		    target.tagName === 'TEXTAREA' || 
		    target.contentEditable === 'true' ||
		    target.closest('input') || 
		    target.closest('textarea')) {
			// Don't prevent default for input fields, just return early
			return;
		}
		
		// Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
		if ((event.ctrlKey || event.metaKey) && event.key === 's') {
			event.preventDefault();
			event.stopPropagation();
			// Find the form element and trigger save
			const form = document.querySelector('form[method="POST"]') as HTMLFormElement;
			if (form) {
				const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
				if (submitButton) {
					submitButton.click();
				}
			}
		}
	};

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
	});

	onDestroy(() => {
		document.removeEventListener('keydown', handleKeyDown);
	});
</script>

<div class="space-y-4">
	<!-- Header -->

	<BlockTypeSelector onSelectType={addContentBlock} />

	<!-- Content Blocks List -->
	<div class="space-y-1">
		{#each previewContent as block, blockIndex}
			<div
				class="relative"
				class:ring-2={draggedBlockIndex !== null && dragOverIndex === blockIndex}
				class:ring-blue-400={draggedBlockIndex !== null && dragOverIndex === blockIndex}
				class:bg-blue-50={draggedBlockIndex !== null && dragOverIndex === blockIndex}
				data-block-index={blockIndex}
				ondragover={handleDragOver}
				ondrop={handleDrop}
				role="region"
				aria-label="Content block {blockIndex + 1}"
			>
				<ContentBlockEditor
					{block}
					pageIndex={blockIndex}
					{blockIndex}
					{currentVersion}
					onBlockClick={() => onBlockClick?.(blockIndex)}
					onDuplicate={() => duplicateContentBlock(blockIndex)}
					onMoveUp={() => moveContentBlock(blockIndex, blockIndex - 1)}
					onMoveDown={() => moveContentBlock(blockIndex, blockIndex + 1)}
					onRemove={() => removeContentBlock(blockIndex)}
					canMoveUp={blockIndex > 0}
					canMoveDown={blockIndex < content.length - 1}
					onDragStart={(e) => handleDragStart(e, blockIndex)}
					onDragEnd={handleDragEnd}
					onUpdate={(field, value) => {
						const updatedBlock = { ...block, [field]: value };
						updateContentBlock(blockIndex, updatedBlock);
					}}
				/>
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
