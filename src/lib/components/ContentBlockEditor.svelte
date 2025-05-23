<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { marked } from 'marked';
	import type { ContentBlock } from '$routes/bullshift/learn/[id]/edit/schema';

	const { 
		block, 
		pageIndex, 
		blockIndex,
		onUpdate,
		onMoveUp,
		onMoveDown,
		onRemove,
		canMoveUp,
		canMoveDown
	}: {
		block: ContentBlock;
		pageIndex: number;
		blockIndex: number;
		onUpdate: (field: string, value: any) => void;
		onMoveUp: () => void;
		onMoveDown: () => void;
		onRemove: () => void;
		canMoveUp: boolean;
		canMoveDown: boolean;
	} = $props();

	const updateListItem = (itemIndex: number, value: string) => {
		if (block.type === 'list') {
			const newItems = [...block.items];
			newItems[itemIndex] = value;
			onUpdate('items', newItems);
		}
	};

	const addListItem = () => {
		if (block.type === 'list') {
			onUpdate('items', [...block.items, '']);
		}
	};

	const removeListItem = (itemIndex: number) => {
		if (block.type === 'list') {
			onUpdate('items', block.items.filter((_, index) => index !== itemIndex));
		}
	};
</script>

<div 
	class="mb-3 border rounded border-gray-200 bg-gray-50"
	draggable="true"
	role="listitem"
>
	<!-- Block Header -->
	<div class="flex items-center justify-between p-2 bg-gray-100 border-b">
		<div class="flex items-center gap-2">
			<span class="text-gray-400 cursor-move">⋮⋮</span>
			<span class="text-sm font-medium capitalize">{block.type}</span>
		</div>
		<div class="flex items-center gap-1">
			<button
				type="button"
				onclick={onMoveUp}
				disabled={!canMoveUp}
				class="rounded bg-gray-200 px-1 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
			>
				↑
			</button>
			<button
				type="button"
				onclick={onMoveDown}
				disabled={!canMoveDown}
				class="rounded bg-gray-200 px-1 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
			>
				↓
			</button>
			<button
				type="button"
				onclick={onRemove}
				class="rounded bg-red-200 px-1 py-1 text-xs text-red-700 hover:bg-red-300"
			>
				✕
			</button>
		</div>
	</div>

	<!-- Block Content Editor -->
	<div class="p-3">
		{#if block.type === 'text'}
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="text-content-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Content (Markdown)</label>
					<Textarea 
						id="text-content-{pageIndex}-{blockIndex}"
						value={block.content}
						oninput={(e: Event) => {
							const target = e.target as HTMLTextAreaElement;
							onUpdate('content', target.value);
						}}
						rows={4}
						class="font-mono text-sm"
						placeholder="Enter markdown content..."
					/>
				</div>
				<div>
					<div class="block text-sm font-medium mb-1">Preview</div>
					<div class="border rounded p-2 bg-white min-h-[100px] prose prose-sm">
						{@html marked(block.content || '')}
					</div>
				</div>
			</div>
		{:else if block.type === 'heading'}
			<div class="space-y-2">
				<div>
					<label for="heading-hierarchy-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Hierarchy</label>
					<select 
						id="heading-hierarchy-{pageIndex}-{blockIndex}"
						value={block.hierarchy} 
						onchange={(e: Event) => {
							const target = e.target as HTMLSelectElement;
							onUpdate('hierarchy', parseInt(target.value));
						}}
						class="border rounded px-2 py-1"
					>
						<option value={1}>H1</option>
						<option value={2}>H2</option>
						<option value={3}>H3</option>
						<option value={4}>H4</option>
						<option value={5}>H5</option>
						<option value={6}>H6</option>
					</select>
				</div>
				<div>
					<label for="heading-content-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Content</label>
					<Input 
						id="heading-content-{pageIndex}-{blockIndex}"
						value={block.content} 
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							onUpdate('content', target.value);
						}}
						placeholder="Heading text..." 
					/>
				</div>
				<div class="border rounded p-2 bg-white">
					<div class="prose">
						{#if block.hierarchy === 1}<h1>{block.content}</h1>
						{:else if block.hierarchy === 2}<h2>{block.content}</h2>
						{:else if block.hierarchy === 3}<h3>{block.content}</h3>
						{:else if block.hierarchy === 4}<h4>{block.content}</h4>
						{:else if block.hierarchy === 5}<h5>{block.content}</h5>
						{:else if block.hierarchy === 6}<h6>{block.content}</h6>{/if}
					</div>
				</div>
			</div>
		{:else if block.type === 'list'}
			<div>
				<div class="block text-sm font-medium mb-2">List Items</div>
				{#each block.items as item, itemIndex}
					<div class="flex items-center gap-2 mb-2">
						<label for="list-item-{pageIndex}-{blockIndex}-{itemIndex}" class="sr-only">List item {itemIndex + 1}</label>
						<Input 
							id="list-item-{pageIndex}-{blockIndex}-{itemIndex}"
							value={block.items[itemIndex]} 
							oninput={(e: Event) => {
								const target = e.target as HTMLInputElement;
								updateListItem(itemIndex, target.value);
							}}
							placeholder="List item..." 
						/>
						<button
							type="button"
							onclick={() => removeListItem(itemIndex)}
							class="rounded bg-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-300"
						>
							Remove
						</button>
					</div>
				{/each}
				<button
					type="button"
					onclick={addListItem}
					class="rounded bg-blue-200 px-2 py-1 text-xs text-blue-700 hover:bg-blue-300"
				>
					Add Item
				</button>
				<div class="mt-2 border rounded p-2 bg-white">
					<ul class="list-disc list-inside">
						{#each block.items as item}
							{@html marked(item, { breaks: true })}
						{/each}
					</ul>
				</div>
			</div>
		{:else if block.type === 'task'}
			<div class="space-y-2">
				<div>
					<label for="task-duration-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Duration (seconds)</label>
					<Input 
						id="task-duration-{pageIndex}-{blockIndex}"
						type="number" 
						value={block.duration} 
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							onUpdate('duration', parseInt(target.value) || 0);
						}}
						min="0" 
					/>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="task-content-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Content (Markdown)</label>
						<Textarea 
							id="task-content-{pageIndex}-{blockIndex}"
							value={block.content}
							oninput={(e: Event) => {
								const target = e.target as HTMLTextAreaElement;
								onUpdate('content', target.value);
							}}
							rows={3}
							class="font-mono text-sm"
							placeholder="Enter task description..."
						/>
					</div>
					<div>
						<div class="block text-sm font-medium mb-1">Preview</div>
						<div class="border rounded p-2 bg-white min-h-[75px] prose prose-sm">
							{@html marked(block.content || '')}
						</div>
					</div>
				</div>
			</div>
		{:else if block.type === 'timer'}
			<div>
				<label for="timer-duration-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Duration (seconds)</label>
				<Input 
					id="timer-duration-{pageIndex}-{blockIndex}"
					type="number" 
					value={block.duration} 
					oninput={(e: Event) => {
						const target = e.target as HTMLInputElement;
						onUpdate('duration', parseInt(target.value) || 0);
					}}
					min="0" 
				/>
				<p class="text-sm text-gray-500 mt-1">
					{Math.floor(block.duration / 60)}m {block.duration % 60}s
				</p>
			</div>
		{:else if block.type === 'bodymap'}
			<div class="text-center py-4 text-gray-500">
				<p>Bodymap Component</p>
				<p class="text-sm">This will load a custom bodymap component in the frontend</p>
			</div>
		{/if}
	</div>
</div> 