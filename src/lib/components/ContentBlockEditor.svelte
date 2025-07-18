<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { marked } from 'marked';
	import type { ContentBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
	import Plus from 'lucide-svelte/icons/plus';
	import Trash from 'lucide-svelte/icons/trash';
	import Copy from 'lucide-svelte/icons/copy';
	import ChevronsUp from 'lucide-svelte/icons/chevron-up';
	import ChevronsDown from 'lucide-svelte/icons/chevron-down';
	import GripVertical from 'lucide-svelte/icons/grip-vertical';
	import AudioUpload from '$lib/components/AudioUpload.svelte';

	const { 
		block, 
		pageIndex, 
		blockIndex,
		currentVersion,
		onUpdate,
		onBlockClick,
		onDuplicate,
		onMoveUp,
		onMoveDown,
		onRemove,
		canMoveUp,
		canMoveDown,
		onDragStart,
		onDragEnd
	}: {
		block: ContentBlock;
		pageIndex: number;
		blockIndex: number;
		currentVersion?: any;
		onUpdate: (field: string, value: any) => void;
		onBlockClick?: () => void;
		onDuplicate?: () => void;
		onMoveUp?: () => void;
		onMoveDown?: () => void;
		onRemove?: () => void;
		canMoveUp?: boolean;
		canMoveDown?: boolean;
		onDragStart?: (e: DragEvent) => void;
		onDragEnd?: () => void;
	} = $props();

	let isCollapsed = $state(true);

	const updateListItem = (itemIndex: number, field: 'title' | 'text', value: string) => {
		if (block.type === 'list') {
			const newItems = [...block.items];
			newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
			onUpdate('items', newItems);
		}
	};

	const addListItem = () => {
		if (block.type === 'list') {
			onUpdate('items', [...block.items, { title: '', text: '' }]);
		}
	};

	const removeListItem = (itemIndex: number) => {
		if (block.type === 'list') {
			onUpdate('items', block.items.filter((_: any, index: number) => index !== itemIndex));
		}
	};

	const moveListItemUp = (itemIndex: number) => {
		if (block.type === 'list' && itemIndex > 0) {
			const newItems = [...block.items];
			[newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]];
			onUpdate('items', newItems);
		}
	};

	const moveListItemDown = (itemIndex: number) => {
		if (block.type === 'list' && itemIndex < block.items.length - 1) {
			const newItems = [...block.items];
			[newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];
			onUpdate('items', newItems);
		}
	};

	// Sortable block functions
	const updateSortableItem = (itemIndex: number, field: 'text' | 'correctBucket', value: string) => {
		if (block.type === 'sortable') {
			const newItems = [...block.items];
			newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
			onUpdate('items', newItems);
		}
	};

	const addSortableItem = () => {
		if (block.type === 'sortable') {
			onUpdate('items', [...block.items, { text: '', correctBucket: 'A' }]);
		}
	};

	const removeSortableItem = (itemIndex: number) => {
		if (block.type === 'sortable') {
			onUpdate('items', block.items.filter((_: any, index: number) => index !== itemIndex));
		}
	};

	const moveSortableItemUp = (itemIndex: number) => {
		if (block.type === 'sortable' && itemIndex > 0) {
			const newItems = [...block.items];
			[newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]];
			onUpdate('items', newItems);
		}
	};

	const moveSortableItemDown = (itemIndex: number) => {
		if (block.type === 'sortable' && itemIndex < block.items.length - 1) {
			const newItems = [...block.items];
			[newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];
			onUpdate('items', newItems);
		}
	};

	// Multiple choice block functions
	const updateMultipleChoiceQuestion = (questionIndex: number, field: 'question' | 'explanation', value: string) => {
		if (block.type === 'multipleChoice') {
			const newQuestions = [...block.questions];
			newQuestions[questionIndex] = { ...newQuestions[questionIndex], [field]: value };
			onUpdate('questions', newQuestions);
		}
	};

	const updateMultipleChoiceOption = (questionIndex: number, optionIndex: number, field: 'text' | 'isCorrect', value: string | boolean) => {
		if (block.type === 'multipleChoice') {
			const newQuestions = [...block.questions];
			const newOptions = [...newQuestions[questionIndex].options];
			newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
			newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
			onUpdate('questions', newQuestions);
		}
	};

	const addMultipleChoiceQuestion = () => {
		if (block.type === 'multipleChoice') {
			const newQuestion = {
				question: '',
				options: [
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false }
				],
				explanation: ''
			};
			onUpdate('questions', [...block.questions, newQuestion]);
		}
	};

	const removeMultipleChoiceQuestion = (questionIndex: number) => {
		if (block.type === 'multipleChoice') {
			onUpdate('questions', block.questions.filter((_: any, index: number) => index !== questionIndex));
		}
	};

	const addMultipleChoiceOption = (questionIndex: number) => {
		if (block.type === 'multipleChoice') {
			const newQuestions = [...block.questions];
			const newOptions = [...newQuestions[questionIndex].options, { text: '', isCorrect: false }];
			newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
			onUpdate('questions', newQuestions);
		}
	};

	const removeMultipleChoiceOption = (questionIndex: number, optionIndex: number) => {
		if (block.type === 'multipleChoice') {
			const newQuestions = [...block.questions];
			const newOptions = newQuestions[questionIndex].options.filter((_: any, index: number) => index !== optionIndex);
			newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
			onUpdate('questions', newQuestions);
		}
	};
</script>

<div class="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200">
	<!-- Collapsible Header -->
	<div
		class="bg-alsmostwhite flex cursor-pointer items-center justify-between border-b p-1 hover:bg-gray-100"
		onclick={(e) => {
			// If it's a right click or middle click, don't trigger step jump
			if (e.button === 2 || e.button === 1) return;
			
			// Toggle collapse
			isCollapsed = !isCollapsed;
			
			// Jump to step in preview
			if (onBlockClick) {
				onBlockClick();
			}
		}}
	>
		<div class="flex items-center gap-2">
			<!-- Drag Handle -->
			{#if onDragStart}
				<div
					class="cursor-grab p-1 text-gray-400 hover:text-gray-600"
					draggable="true"
					ondragstart={onDragStart}
					ondragend={onDragEnd}
				>
					<GripVertical class="size-4" />
				</div>
			{/if}

			<!-- Block Type Icon -->
			<img
				src={`/blocks/${block.type}.svg`}
				alt={block.type}
				class="size-6"
			/>

			<!-- Block Type Label -->
			<span class="text-sm font-medium text-gray-700">
				{block.type.charAt(0).toUpperCase() + block.type.slice(1)}
			</span>
		</div>

		<div class="flex items-center gap-1">
			<!-- Action Buttons -->
			{#if onDuplicate}
				<button
					type="button"
					class="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
					onclick={(e) => {
						e.stopPropagation();
						onDuplicate();
					}}
					title="Duplicate block"
				>
					<Copy class="size-4" />
				</button>
			{/if}

			{#if onMoveUp}
				<button
					type="button"
					class="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
					onclick={(e) => {
						e.stopPropagation();
						onMoveUp();
					}}
					disabled={!canMoveUp}
					class:opacity-50={!canMoveUp}
					title="Move up"
				>
					<ChevronsUp class="size-4" />
				</button>
			{/if}

			{#if onMoveDown}
				<button
					type="button"
					class="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
					onclick={(e) => {
						e.stopPropagation();
						onMoveDown();
					}}
					disabled={!canMoveDown}
					class:opacity-50={!canMoveDown}
					title="Move down"
				>
					<ChevronsDown class="size-4" />
				</button>
			{/if}

			{#if onRemove}
				<button
					type="button"
					class="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
					onclick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					title="Remove block"
				>
					<Trash class="size-4" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Collapsible Content -->
	{#if !isCollapsed}
		<div class="p-4">
			{#if block.type === 'text'}
		<div class="flex flex-col gap-2">
			<div>
				<label for="text-content-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Content (Markdown)</label>
				<Textarea 
					id="text-content-{pageIndex}-{blockIndex}"
					value={block.content}
					oninput={(e: Event) => {
						const target = e.target as HTMLTextAreaElement;
						onUpdate('content', target.value);
					}}
					rows={8}
					class="font-mono text-sm"
					placeholder="Enter markdown content..."
				/>
			</div>
		</div>
	
		{:else if block.type === 'list'}
			<div class="flex flex-col gap-2">
				<div>
					<div class="block text-sm font-medium mb-2">List Items</div>
					{#each block.items as item, itemIndex}
						<div class="space-y-2 mb-4 p-3 border rounded bg-gray-50">
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium text-gray-700">Item {itemIndex + 1}</span>
								<div class="flex items-center gap-1">
									<button
										type="button"
										onclick={() => moveListItemUp(itemIndex)}
										disabled={itemIndex === 0}
										class="rounded bg-gray-200 px-1 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
									>
										↑
									</button>
									<button
										type="button"
										onclick={() => moveListItemDown(itemIndex)}
										disabled={itemIndex === block.items.length - 1}
										class="rounded bg-gray-200 px-1 py-1 text-xs hover:bg-gray-300 disabled:opacity-50"
									>
										↓
									</button>
									<button
										type="button"
										onclick={() => removeListItem(itemIndex)}
										class="rounded bg-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-300"
									>
										✕
									</button>
								</div>
							</div>
							<div>
								<label for="list-item-title-{pageIndex}-{blockIndex}-{itemIndex}" class="block text-sm font-medium mb-1">Title</label>
								<Input 
									id="list-item-title-{pageIndex}-{blockIndex}-{itemIndex}"
									value={item.title} 
									oninput={(e: Event) => {
										const target = e.target as HTMLInputElement;
										updateListItem(itemIndex, 'title', target.value);
									}}
									placeholder="List item title..." 
								/>
							</div>
							<div>
								<label for="list-item-text-{pageIndex}-{blockIndex}-{itemIndex}" class="block text-sm font-medium mb-1">Text</label>
								<Textarea rows={6} 
									id="list-item-text-{pageIndex}-{blockIndex}-{itemIndex}"
									value={item.text} 
									oninput={(e: Event) => {
										const target = e.target as HTMLInputElement;
										updateListItem(itemIndex, 'text', target.value);
									}}
									placeholder="List item text..." 
								/>
							</div>
						</div>
					{/each}
					<button
						type="button"
						onclick={addListItem}
						class="rounded bg-blue-200 px-2 py-1 text-xs text-blue-700 hover:bg-blue-300"
					>
						Add Item
					</button>
				</div>
			</div>
		{:else if block.type === 'task'}
			<div class="space-y-2">
				<div class="flex items-center space-x-2">
					<input
						id="task-duration-enabled-{pageIndex}-{blockIndex}"
						type="checkbox"
						checked={block.duration !== undefined}
						onchange={(e: Event) => {
							const target = e.target as HTMLInputElement;
							if (target.checked) {
								onUpdate('duration', 300); // Default 5 minutes
							} else {
								onUpdate('duration', undefined);
							}
						}}
					/>
					<label for="task-duration-enabled-{pageIndex}-{blockIndex}" class="text-sm font-medium">Show duration</label>
				</div>
				
				{#if block.duration !== undefined}
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
				{/if}
				<div class="flex flex-col gap-2">
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
		{:else if block.type === 'breathe'}
			<div class="space-y-4">
				<div>
					<label for="breathe-duration-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Default Duration</label>
					<select 
						id="breathe-duration-{pageIndex}-{blockIndex}"
						value={block.duration || 60}
						onchange={(e: Event) => {
							const target = e.target as HTMLSelectElement;
							onUpdate('duration', parseInt(target.value));
						}}
						class="border rounded px-2 py-1 w-full text-sm"
					>
						<option value="15">15 Sekunden</option>
						<option value="30">30 Sekunden</option>
						<option value="60">1 Minute</option>
						<option value="120">2 Minuten</option>
					</select>
				</div>
				<div class="text-sm text-gray-600 bg-gray-50 p-3 rounded">
					<strong>5-7 Breathing Pattern:</strong> This breathing exercise uses a 5-second inhale, 7-second exhale pattern. 
					Users can choose from 15 seconds, 30 seconds, 1 minute, or 2 minutes.
					<br><br>
					<strong>Audio:</strong> Make sure you have added breathe-in.mp3 and breathe-out.mp3 files to the /static/audio/ directory for synchronized audio feedback.
				</div>
			</div>
		{:else if block.type === 'bodymap'}
			<div class="text-center py-4 text-gray-500">
				<p>Bodymap Component</p>
				<p class="text-sm">This will load a custom bodymap component in the frontend</p>
			</div>
		{:else if block.type === 'taskCompletion'}
			<div class="space-y-2">
				<div>
					<label for="task-completion-taskId-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Task ID (optional)</label>
					<Input 
						id="task-completion-taskId-{pageIndex}-{blockIndex}"
						value={block.taskId || ''} 
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							onUpdate('taskId', target.value || undefined);
						}}
						placeholder="Optional reference to link with specific task..." 
					/>
				</div>
				<div class="flex items-center gap-2">
					<input
						id="task-completion-allowNotes-{pageIndex}-{blockIndex}"
						type="checkbox"
						checked={block.allowNotes !== false}
						onchange={(e: Event) => {
							const target = e.target as HTMLInputElement;
							onUpdate('allowNotes', target.checked);
						}}
						class="rounded"
					/>
					<label for="task-completion-allowNotes-{pageIndex}-{blockIndex}" class="text-sm font-medium">
						Allow notes
					</label>
				</div>
				<div>
					<label for="task-completion-placeholder-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Notes placeholder (optional)</label>
					<Input 
						id="task-completion-placeholder-{pageIndex}-{blockIndex}"
						value={block.notesPlaceholder || ''} 
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							onUpdate('notesPlaceholder', target.value || undefined);
						}}
						placeholder="Custom placeholder for notes field..." 
					/>
				</div>
			</div>
		{:else if block.type === 'sortable'}
			<div class="space-y-4">
				<div>
					<label for="sortable-bucketA-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Bucket A Name</label>
					<Input 
						id="sortable-bucketA-{pageIndex}-{blockIndex}"
						value={block.bucketA} 
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							onUpdate('bucketA', target.value);
						}}
						placeholder="Enter name for bucket A..." 
					/>
				</div>
				<div>
					<label for="sortable-bucketB-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Bucket B Name</label>
					<Input 
						id="sortable-bucketB-{pageIndex}-{blockIndex}"
						value={block.bucketB} 
						oninput={(e: Event) => {
							const target = e.target as HTMLInputElement;
							onUpdate('bucketB', target.value);
						}}
						placeholder="Enter name for bucket B..." 
					/>
				</div>
				
				<div class="space-y-2">
					<div class="block text-sm font-medium mb-1">Items to Sort</div>
					{#each block.items as item, itemIndex}
						<div class="flex items-start gap-2 p-2 border rounded">
							<div class="flex-1">
								<Textarea 
									id="sort-item-{pageIndex}-{blockIndex}-{itemIndex}"
									value={item.text} 
									oninput={(e: Event) => {
										const target = e.target as HTMLTextAreaElement;
										updateSortableItem(itemIndex, 'text', target.value);
									}}
									placeholder="Item text..." 
									class="h-16"
								/>
							</div>
							<div class="flex flex-col gap-2 pt-2">
								<div class="text-xs text-gray-600">Correct bucket:</div>
								<select
									value={item.correctBucket}
									onchange={(e: Event) => {
										const target = e.target as HTMLSelectElement;
										updateSortableItem(itemIndex, 'correctBucket', target.value as 'A' | 'B');
									}}
									class="text-xs border rounded px-1 py-1"
								>
									<option value="A">{block.bucketA}</option>
									<option value="B">{block.bucketB}</option>
								</select>
								<button
									type="button"
									onclick={() => removeSortableItem(itemIndex)}
									class="text-red-500 hover:text-red-700 text-xs"
								>
									Remove
								</button>
							</div>
						</div>
					{/each}
					
					<button
						type="button"
						onclick={addSortableItem}
						class="text-sm text-gray-600 hover:text-gray-800"
					>
						+ Add Item
					</button>
				</div>
				
			</div>
		{:else if block.type === 'multipleChoice'}
			<div class="space-y-6">
				{#each block.questions as question, questionIndex}
					<div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
						<div class="flex items-center justify-between mb-4">
							<h4 class="font-medium">Question {questionIndex + 1}</h4>
							{#if block.questions.length > 1}
								<button
									type="button"
									onclick={() => removeMultipleChoiceQuestion(questionIndex)}
									class="p-1 text-red-500 hover:text-red-700"
								>
									<Trash class="size-4" />
								</button>
							{/if}
						</div>

						<div class="space-y-4">
							<div>
								<label for="multiple-choice-question-{pageIndex}-{blockIndex}-{questionIndex}" class="block text-sm font-medium mb-1">Question</label>
								<Textarea 
									id="multiple-choice-question-{pageIndex}-{blockIndex}-{questionIndex}"
									value={question.question} 
									oninput={(e: Event) => {
										const target = e.target as HTMLTextAreaElement;
										updateMultipleChoiceQuestion(questionIndex, 'question', target.value);
									}}
									placeholder="Enter your question..." 
									class="h-20"
								/>
							</div>

							<div class="space-y-2">
								<div class="block text-sm font-medium mb-1">Options</div>
								{#each question.options as option, optionIndex}
									<div class="flex items-start gap-2 p-2 border rounded {option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'}">
										<div class="flex-1">
											<Textarea 
												id="option-{pageIndex}-{blockIndex}-{questionIndex}-{optionIndex}"
												value={option.text} 
												oninput={(e: Event) => {
													const target = e.target as HTMLTextAreaElement;
													updateMultipleChoiceOption(questionIndex, optionIndex, 'text', target.value);
												}}
												placeholder="Option {optionIndex + 1}..." 
												class="h-16"
											/>
										</div>
										<div class="flex items-center gap-2 pt-2">
											<label class="flex items-center gap-1 text-sm">
												<input
													type="checkbox"
													checked={option.isCorrect}
													onchange={(e: Event) => {
														const target = e.target as HTMLInputElement;
														updateMultipleChoiceOption(questionIndex, optionIndex, 'isCorrect', target.checked);
													}}
													class="rounded"
												/>
												Correct
											</label>
											{#if question.options.length > 2}
												<button
													type="button"
													onclick={() => removeMultipleChoiceOption(questionIndex, optionIndex)}
													class="p-1 text-red-500 hover:text-red-700"
												>
													<Trash class="size-4" />
												</button>
											{/if}
										</div>
									</div>
								{/each}

								{#if question.options.length < 6}
									<button
										type="button"
										onclick={() => addMultipleChoiceOption(questionIndex)}
										class="mt-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
									>
										<Plus class="size-4" />
										Add Option
									</button>
								{/if}
							</div>

							<div>
								<label for="multiple-choice-explanation-{pageIndex}-{blockIndex}-{questionIndex}" class="block text-sm font-medium mb-1">Explanation (optional)</label>
								<Textarea 
									id="multiple-choice-explanation-{pageIndex}-{blockIndex}-{questionIndex}"
									value={question.explanation || ''} 
									oninput={(e: Event) => {
										const target = e.target as HTMLTextAreaElement;
										updateMultipleChoiceQuestion(questionIndex, 'explanation', target.value || '');
									}}
									placeholder="Enter an explanation that will be shown after the user answers..." 
									class="h-20"
								/>
							</div>
						</div>
					</div>
				{/each}

				<div class="flex items-center gap-2">
					<input
						id="multiple-choice-allow-multiple-{pageIndex}-{blockIndex}"
						type="checkbox"
						checked={block.allowMultiple}
						onchange={(e: Event) => {
							const target = e.target as HTMLInputElement;
							onUpdate('allowMultiple', target.checked);
						}}
						class="rounded"
					/>
					<label for="multiple-choice-allow-multiple-{pageIndex}-{blockIndex}" class="text-sm font-medium">
						Allow multiple correct answers
					</label>
				</div>

				<button
					type="button"
					onclick={addMultipleChoiceQuestion}
					class="w-full py-2 px-4 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 flex items-center justify-center gap-2"
				>
					<Plus class="size-4" />
					Add Question
				</button>

			</div>
		{:else if block.type === 'aiQuestion'}
			<div class="flex flex-col gap-2">
				<div class="space-y-4">
					<div>
						<label for="ai-question-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Question (Markdown)</label>
						<Textarea 
							id="ai-question-{pageIndex}-{blockIndex}"
							value={block.question}
							oninput={(e: Event) => {
								const target = e.target as HTMLTextAreaElement;
								onUpdate('question', target.value);
							}}
							rows={3}
							placeholder="Enter the question for users..."
						/>
					</div>
					<div>
						<label for="ai-system-prompt-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">System Prompt</label>
						<Textarea 
							id="ai-system-prompt-{pageIndex}-{blockIndex}"
							value={block.systemPrompt}
							oninput={(e: Event) => {
								const target = e.target as HTMLTextAreaElement;
								onUpdate('systemPrompt', target.value);
							}}
							rows={4}
							placeholder="Define how the AI should respond to user answers..."
							class="font-mono text-sm"
						/>
					</div>
					<div>
						<label for="ai-placeholder-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Answer Placeholder (optional)</label>
						<Input 
							id="ai-placeholder-{pageIndex}-{blockIndex}"
							value={block.placeholder || ''}
							oninput={(e: Event) => {
								const target = e.target as HTMLInputElement;
								onUpdate('placeholder', target.value || undefined);
							}}
							placeholder="Custom placeholder for answer field..."
						/>
					</div>
				</div>
			</div>
		{:else if block.type === 'aiQuestionStep'}
			<div class="flex flex-col gap-2">
				<div class="space-y-4">
					<div>
						<label for="ai-question-step-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Question (Markdown)</label>
						<Textarea 
							id="ai-question-step-{pageIndex}-{blockIndex}"
							value={block.question}
							oninput={(e: Event) => {
								const target = e.target as HTMLTextAreaElement;
								onUpdate('question', target.value);
							}}
							rows={3}
							placeholder="Enter the question for users..."
						/>
					</div>
					<div>
						<label for="ai-system-prompt-step-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">System Prompt</label>
						<Textarea 
							id="ai-system-prompt-step-{pageIndex}-{blockIndex}"
							value={block.systemPrompt}
							oninput={(e: Event) => {
								const target = e.target as HTMLTextAreaElement;
								onUpdate('systemPrompt', target.value);
							}}
							rows={4}
							placeholder="Define how the AI should respond to user answers..."
							class="font-mono text-sm"
						/>
					</div>
					<div>
						<label for="ai-placeholder-step-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Answer Placeholder (optional)</label>
						<Input 
							id="ai-placeholder-step-{pageIndex}-{blockIndex}"
							value={block.placeholder || ''}
							oninput={(e: Event) => {
								const target = e.target as HTMLInputElement;
								onUpdate('placeholder', target.value || undefined);
							}}
							placeholder="Custom placeholder for answer field..."
						/>
					</div>
				</div>
			</div>
		{:else if block.type === 'aiResponseStep'}
			<div class="flex flex-col gap-2">
				<div class="space-y-4">
					<div>
						<label for="ai-response-question-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Question (Markdown) - for context</label>
						<Textarea 
							id="ai-response-question-{pageIndex}-{blockIndex}"
							value={block.question}
							oninput={(e: Event) => {
								const target = e.target as HTMLTextAreaElement;
								onUpdate('question', target.value);
							}}
							rows={2}
							placeholder="Enter the same question from the question step..."
						/>
					</div>
					<div>
						<label for="ai-response-system-prompt-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">System Prompt</label>
						<Textarea 
							id="ai-response-system-prompt-{pageIndex}-{blockIndex}"
							value={block.systemPrompt}
							oninput={(e: Event) => {
								const target = e.target as HTMLTextAreaElement;
								onUpdate('systemPrompt', target.value);
							}}
							rows={4}
							placeholder="Define how the AI should respond to user answers..."
							class="font-mono text-sm"
						/>
					</div>
					<div class="text-sm text-gray-600 bg-gray-50 p-3 rounded">
						<strong>Note:</strong> This block shows the user's answer and AI response. Make sure to place this block after the corresponding AI Question Step block.
					</div>
				</div>
			</div>
		{:else if block.type === 'image'}
			<div class="flex flex-col gap-2">
				<div class="space-y-4">
					<div>
						<label for="image-src-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Image URL</label>
						<Input 
							id="image-src-{pageIndex}-{blockIndex}"
							value={block.src}
							oninput={(e: Event) => {
								const target = e.target as HTMLInputElement;
								onUpdate('src', target.value);
							}}
							placeholder="https://example.com/image.jpg or /path/to/image.jpg"
						/>
					</div>
					<div>
						<label for="image-alt-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Alt Text</label>
						<Input 
							id="image-alt-{pageIndex}-{blockIndex}"
							value={block.alt || ''}
							oninput={(e: Event) => {
								const target = e.target as HTMLInputElement;
								onUpdate('alt', target.value || undefined);
							}}
							placeholder="Description for accessibility..."
						/>
					</div>
					<div>
						<label for="image-caption-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Caption (optional)</label>
						<Input 
							id="image-caption-{pageIndex}-{blockIndex}"
							value={block.caption || ''}
							oninput={(e: Event) => {
								const target = e.target as HTMLInputElement;
								onUpdate('caption', target.value || undefined);
							}}
							placeholder="Image caption..."
						/>
					</div>
					<div class="grid grid-cols-2 gap-2">
						<div>
							<label for="image-width-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Max Width (px)</label>
							<Input 
								id="image-width-{pageIndex}-{blockIndex}"
								type="number"
								value={block.width || ''}
								oninput={(e: Event) => {
									const target = e.target as HTMLInputElement;
									const value = target.value ? parseInt(target.value) : undefined;
									onUpdate('width', value);
								}}
								placeholder="400"
								min="50"
								max="1200"
							/>
						</div>
						<div>
							<label for="image-alignment-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Alignment</label>
							<select 
								id="image-alignment-{pageIndex}-{blockIndex}"
								value={block.alignment || 'center'}
								onchange={(e: Event) => {
									const target = e.target as HTMLSelectElement;
									onUpdate('alignment', target.value as 'left' | 'center' | 'right');
								}}
								class="border rounded px-2 py-1 w-full"
							>
								<option value="left">Left</option>
								<option value="center">Center</option>
								<option value="right">Right</option>
							</select>
						</div>
					</div>
					<div>
						<label for="image-upload-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Upload Image</label>
						<input 
							id="image-upload-{pageIndex}-{blockIndex}"
							type="file"
							accept="image/*"
							onchange={async (e: Event) => {
								const target = e.target as HTMLInputElement;
								const file = target.files?.[0];
								if (file) {
									// You can implement file upload logic here
									// For now, we'll create a local URL
									const localUrl = URL.createObjectURL(file);
									onUpdate('src', localUrl);
									onUpdate('alt', file.name.replace(/\.[^/.]+$/, ""));
								}
							}}
							class="border rounded px-2 py-1 w-full text-sm"
						/>
						<div class="text-xs text-gray-500 mt-1">
							Or enter a URL above
						</div>
					</div>
				</div>
			</div>
		{:else if block.type === 'audio'}
			<div class="flex flex-col gap-2">
				<div class="space-y-4">
					<div>
						<label for="audio-src-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Audio URL</label>
						<Input 
							id="audio-src-{pageIndex}-{blockIndex}"
							value={block.src}
							oninput={(e: Event) => {
								const target = e.target as HTMLInputElement;
								onUpdate('src', target.value);
							}}
							placeholder="https://example.com/audio.mp3 or /path/to/audio.mp3"
						/>
					</div>
					<div>
						<label for="audio-title-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Title (optional)</label>
						<Input 
							id="audio-title-{pageIndex}-{blockIndex}"
							value={block.title || ''}
							oninput={(e: Event) => {
								const target = e.target as HTMLInputElement;
								onUpdate('title', target.value || undefined);
							}}
							placeholder="Audio title..."
						/>
					</div>
					<div>
						<label for="audio-content-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Content (Markdown)</label>
						<Textarea 
							id="audio-content-{pageIndex}-{blockIndex}"
							value={block.content || ''}
							oninput={(e: Event) => {
								const target = e.target as HTMLTextAreaElement;
								onUpdate('content', target.value || undefined);
							}}
							rows={4}
							class="font-mono text-sm"
							placeholder="Enter markdown content to display with the audio..."
						/>
					</div>
					<div>
						<label for="audio-transcript-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Transcript (optional)</label>
						<Textarea 
							id="audio-transcript-{pageIndex}-{blockIndex}"
							value={block.transcript || ''}
							oninput={(e: Event) => {
								const target = e.target as HTMLTextAreaElement;
								onUpdate('transcript', target.value || undefined);
							}}
							rows={4}
							placeholder="Audio transcript for accessibility..."
						/>
					</div>
					<div class="grid grid-cols-3 gap-2">
						<div class="flex items-center space-x-2">
							<input 
								id="audio-controls-{pageIndex}-{blockIndex}"
								type="checkbox"
								checked={block.controls !== false}
								onchange={(e: Event) => {
									const target = e.target as HTMLInputElement;
									onUpdate('controls', target.checked);
								}}
								class="rounded"
							/>
							<label for="audio-controls-{pageIndex}-{blockIndex}" class="text-sm">Show controls</label>
						</div>
						<div class="flex items-center space-x-2">
							<input 
								id="audio-autoplay-{pageIndex}-{blockIndex}"
								type="checkbox"
								checked={block.autoplay || false}
								onchange={(e: Event) => {
									const target = e.target as HTMLInputElement;
									onUpdate('autoplay', target.checked);
								}}
								class="rounded"
							/>
							<label for="audio-autoplay-{pageIndex}-{blockIndex}" class="text-sm">Autoplay</label>
						</div>
						<div class="flex items-center space-x-2">
							<input 
								id="audio-loop-{pageIndex}-{blockIndex}"
								type="checkbox"
								checked={block.loop || false}
								onchange={(e: Event) => {
									const target = e.target as HTMLInputElement;
									onUpdate('loop', target.checked);
								}}
								class="rounded"
							/>
							<label for="audio-loop-{pageIndex}-{blockIndex}" class="text-sm">Loop</label>
						</div>
					</div>
					<div>
						<div class="block text-sm font-medium mb-1">Upload Audio</div>
						<AudioUpload 
							{currentVersion}
							onAudioUploaded={(audioUrl) => {
								onUpdate('src', audioUrl);
								// Extract filename for title if title is empty
								if (!block.title) {
									const filename = audioUrl.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
									onUpdate('title', filename);
								}
							}}
						/>
					</div>
				</div>
			</div>
		{:else if block.type === 'nextPage'}
			<div class="flex flex-col gap-2">
				<div class="space-y-4">
					<div>
						<label for="nextpage-text-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Button Text</label>
						<Input 
							id="nextpage-text-{pageIndex}-{blockIndex}"
							value={block.text || ''}
							oninput={(e: Event) => {
								const target = e.target as HTMLInputElement;
								onUpdate('text', target.value || undefined);
							}}
							placeholder="Next, Continue, Proceed..."
						/>
					</div>
					<div>
						<label for="nextpage-variant-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Button Style</label>
						<select 
							id="nextpage-variant-{pageIndex}-{blockIndex}"
							value={block.variant || 'default'}
							onchange={(e: Event) => {
								const target = e.target as HTMLSelectElement;
								onUpdate('variant', target.value);
							}}
							class="border rounded px-2 py-1 w-full text-sm"
						>
							<option value="default">Default</option>
							<option value="minimal">Minimal</option>
							<option value="floating">Floating</option>
							<option value="large">Large</option>
						</select>
					</div>
					<div class="flex items-center space-x-2">
						<input 
							id="nextpage-disabled-{pageIndex}-{blockIndex}"
							type="checkbox"
							checked={block.disabled || false}
							onchange={(e: Event) => {
								const target = e.target as HTMLInputElement;
								onUpdate('disabled', target.checked);
							}}
							class="rounded"
						/>
						<label for="nextpage-disabled-{pageIndex}-{blockIndex}" class="text-sm">Disabled by default</label>
					</div>
				</div>
			</div>
		{:else if block.type === 'pageNavigation'}
			<div class="flex flex-col gap-2">
				<div class="space-y-4">
					<div class="grid grid-cols-2 gap-2">
						<div class="flex items-center space-x-2">
							<input 
								id="nav-shownext-{pageIndex}-{blockIndex}"
								type="checkbox"
								checked={block.showNext !== false}
								onchange={(e: Event) => {
									const target = e.target as HTMLInputElement;
									onUpdate('showNext', target.checked);
								}}
								class="rounded"
							/>
							<label for="nav-shownext-{pageIndex}-{blockIndex}" class="text-sm">Show Next</label>
						</div>
						<div class="flex items-center space-x-2">
							<input 
								id="nav-showprev-{pageIndex}-{blockIndex}"
								type="checkbox"
								checked={block.showPrev || false}
								onchange={(e: Event) => {
									const target = e.target as HTMLInputElement;
									onUpdate('showPrev', target.checked);
								}}
								class="rounded"
							/>
							<label for="nav-showprev-{pageIndex}-{blockIndex}" class="text-sm">Show Previous</label>
						</div>
					</div>
					<div class="flex flex-col gap-2">
						<div>
							<label for="nav-nexttext-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Next Text</label>
							<Input 
								id="nav-nexttext-{pageIndex}-{blockIndex}"
								value={block.nextText || ''}
								oninput={(e: Event) => {
									const target = e.target as HTMLInputElement;
									onUpdate('nextText', target.value || undefined);
								}}
								placeholder="Next"
							/>
						</div>
						<div>
							<label for="nav-prevtext-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Previous Text</label>
							<Input 
								id="nav-prevtext-{pageIndex}-{blockIndex}"
								value={block.prevText || ''}
								oninput={(e: Event) => {
									const target = e.target as HTMLInputElement;
									onUpdate('prevText', target.value || undefined);
								}}
								placeholder="Previous"
							/>
						</div>
					</div>
					<div>
						<label for="nav-variant-{pageIndex}-{blockIndex}" class="block text-sm font-medium mb-1">Navigation Style</label>
						<select 
							id="nav-variant-{pageIndex}-{blockIndex}"
							value={block.variant || 'default'}
							onchange={(e: Event) => {
								const target = e.target as HTMLSelectElement;
								onUpdate('variant', target.value);
							}}
							class="border rounded px-2 py-1 w-full text-sm"
						>
							<option value="default">Default</option>
							<option value="minimal">Minimal</option>
							<option value="floating">Floating</option>
							<option value="inline">Inline</option>
						</select>
					</div>
				</div>
			</div>
	{/if} 
		</div>
	{/if}
</div>