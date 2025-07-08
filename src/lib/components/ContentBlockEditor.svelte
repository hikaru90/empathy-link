<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { marked } from 'marked';
	import type { ContentBlock } from '$routes/bullshift/learn/[id]/edit/schema';
	import Plus from 'lucide-svelte/icons/plus';
	import Trash from 'lucide-svelte/icons/trash';

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
			onUpdate('items', block.items.filter((_, index) => index !== itemIndex));
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
			onUpdate('items', block.items.filter((_, index) => index !== itemIndex));
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
			onUpdate('questions', block.questions.filter((_, index) => index !== questionIndex));
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
			const newOptions = newQuestions[questionIndex].options.filter((_, index) => index !== optionIndex);
			newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
			onUpdate('questions', newQuestions);
		}
	};
</script>

<div 
	class="mb-3 border rounded-md border-gray-200 bg-gray-50"
	draggable="true"
	role="listitem"
>
	<!-- Block Header -->
	<div class="flex items-center justify-between p-2 bg-gray-100 border-b cursor-pointer hover:bg-gray-200"
	onclick={() => isCollapsed = !isCollapsed}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && (isCollapsed = !isCollapsed)}>
		<div class="flex items-center gap-2">
			<span class="text-gray-400 cursor-move">⋮⋮</span>
			<span class="text-gray-500 text-sm">{isCollapsed ? '▶' : '▼'}</span>
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
	{#if !isCollapsed}
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
						rows={8}
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
			<div class="grid grid-cols-2 gap-4">
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
				<div>
					<div class="block text-sm font-medium mb-2">Preview</div>
					<div class="border rounded p-2 bg-white min-h-[100px] space-y-3">
						{#each block.items as item, itemIndex}
							<div class="p-2 border rounded bg-gray-50">
								<div class="flex items-center gap-2 mb-1">
									<span class="text-xs text-gray-500">#{itemIndex + 1}</span>
									{#if item.title}
										<div class="font-medium text-sm">
											{@html marked(item.title, { breaks: true })}
										</div>
									{/if}
								</div>
								{#if item.text}
									<div class="text-sm text-gray-700 ml-6">
										{@html marked(item.text, { breaks: true })}
									</div>
								{/if}
							</div>
						{/each}
						{#if block.items.length === 0}
							<div class="text-gray-500 text-sm text-center py-4">
								No list items yet
							</div>
						{/if}
					</div>
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
				<div class="border rounded p-2 bg-white">
					<div class="text-sm text-gray-600">Preview: Task completion component with checkbox and {block.allowNotes !== false ? 'notes field' : 'no notes field'}</div>
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
					<label class="block text-sm font-medium mb-1">Items to Sort</label>
					{#each block.items as item, itemIndex}
						<div class="flex items-start gap-2 p-2 border rounded">
							<div class="flex-1">
								<Textarea 
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
				
				<div class="border rounded p-2 bg-white">
					<div class="text-sm text-gray-600">Preview: Sortable with {block.items.length} items between "{block.bucketA}" and "{block.bucketB}"</div>
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
								<label class="block text-sm font-medium mb-1">Options</label>
								{#each question.options as option, optionIndex}
									<div class="flex items-start gap-2 p-2 border rounded {option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'}">
										<div class="flex-1">
											<Textarea 
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

				<div class="border rounded p-2 bg-white">
					<div class="text-sm text-gray-600">Preview: Multiple choice quiz with {block.questions.length} questions{block.allowMultiple ? ' (multiple answers allowed)' : ''}</div>
				</div>
			</div>
		{:else if block.type === 'aiQuestion'}
			<div class="grid grid-cols-2 gap-4">
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
				<div>
					<div class="block text-sm font-medium mb-1">Preview</div>
					<div class="border rounded p-4 bg-white space-y-3">
						<div class="font-medium">
							{@html marked(block.question || 'Question will appear here...')}
						</div>
						<div class="border rounded p-2 bg-gray-50 text-sm text-gray-500">
							{block.placeholder || 'Schreibe deine Antwort hier...'}
						</div>
						<div class="text-xs text-gray-500 border-l-2 border-blue-500 pl-2">
							<strong>System Prompt:</strong> {block.systemPrompt || 'No system prompt set'}
						</div>
					</div>
				</div>
			</div>
		{:else if block.type === 'image'}
			<div class="grid grid-cols-2 gap-4">
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
						<label class="block text-sm font-medium mb-1">Upload Image</label>
						<input 
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
				<div>
					<div class="block text-sm font-medium mb-1">Preview</div>
					<div class="border rounded p-4 bg-white">
						{#if block.src}
							{@const alignmentClass = block.alignment === 'left' ? 'text-left' : block.alignment === 'right' ? 'text-right' : 'text-center'}
							<div class={alignmentClass}>
								<div class="inline-block">
									<img 
										src={block.src}
										alt={block.alt || ''}
										style={block.width ? `max-width: ${block.width}px` : ''}
										class="max-w-full h-auto rounded shadow-sm"
										onerror={() => {}}
									/>
									{#if block.caption}
										<div class="mt-2 text-sm text-gray-600 italic">
											{block.caption}
										</div>
									{/if}
								</div>
							</div>
						{:else}
							<div class="flex items-center justify-center h-32 bg-gray-100 rounded text-gray-500">
								<div class="text-center">
									<div class="text-2xl mb-2">🖼️</div>
									<div class="text-sm">Enter image URL to see preview</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
	{/if}
</div> 