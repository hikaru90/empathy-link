<script lang="ts">
	import { marked } from 'marked';
	import type { MultipleChoiceBlock } from '$routes/bullshift/learn/[id]/edit/schema';
	import type { LearningSession } from '$routes/bullshift/learn/[id]/edit/schema';

	interface Props {
		content: MultipleChoiceBlock;
		color: string;
		pageIndex: number;
		blockIndex: number;
		session: LearningSession | null;
		onResponse: (response: { questionResponses: Array<{ questionIndex: number; selectedOptions: number[]; isCorrect: boolean; timeSpent: number; }>; completed: boolean; totalTimeSpent: number; }) => void;
		topicVersionId?: string;
		contentBlock?: MultipleChoiceBlock;
	}

	let { content, color, pageIndex, blockIndex, session, onResponse, topicVersionId, contentBlock }: Props = $props();

	let currentQuestionIndex = $state(0);
	let selectedOptions = $state<number[]>([]);
	let questionResponses = $state<Array<{ questionIndex: number; selectedOptions: number[]; isCorrect: boolean; timeSpent: number; }>>([]);
	let startTime = $state<number | null>(null);
	let showResult = $state(false);
	let showSummary = $state(false);
	let totalStartTime = $state<number | null>(null);

	// Load existing response if available
	$effect(() => {
		if (session) {
			const existingResponse = session.responses.find(
				r => r.pageIndex === pageIndex && r.blockIndex === blockIndex && r.blockType === 'multipleChoice'
			);
			if (existingResponse) {
				questionResponses = existingResponse.response.questionResponses || [];
				showSummary = existingResponse.response.completed || false;
				
				// If not completed, find the next unanswered question
				if (!showSummary) {
					const nextUnanswered = content.questions.findIndex((_, index) => 
						!questionResponses.some(r => r.questionIndex === index)
					);
					currentQuestionIndex = nextUnanswered !== -1 ? nextUnanswered : 0;
				}
			}
		}
		totalStartTime = Date.now();
		startTime = Date.now();
	});

	console.log('content',content);

	const currentQuestion = $derived(() => content?.questions?.[currentQuestionIndex]);
	const totalQuestions = $derived(() => content?.questions?.length || 0);
	const completedQuestions = $derived(() => questionResponses.length);
	const progressPercentage = $derived(() => (completedQuestions() / totalQuestions()) * 100);

	const handleOptionSelect = (optionIndex: number) => {
		if (showResult) return;

		if (content.allowMultiple) {
			// Multiple selection mode
			if (selectedOptions.includes(optionIndex)) {
				selectedOptions = selectedOptions.filter(i => i !== optionIndex);
			} else {
				selectedOptions = [...selectedOptions, optionIndex];
			}
		} else {
			// Single selection mode
			selectedOptions = [optionIndex];
		}
	};

	const submitAnswer = () => {
		if (selectedOptions.length === 0 || showResult) return;

		const correctOptions = currentQuestion().options.map((option, index) => option.isCorrect ? index : -1).filter(i => i !== -1);
		const isCorrect = content.allowMultiple 
			? selectedOptions.sort().join(',') === correctOptions.sort().join(',')
			: selectedOptions.length === 1 && correctOptions.includes(selectedOptions[0]);

		const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

		// Add this question's response
		const questionResponse = {
			questionIndex: currentQuestionIndex,
			selectedOptions: [...selectedOptions],
			isCorrect,
			timeSpent
		};

		questionResponses = [...questionResponses, questionResponse];
		showResult = true;

		// Save progress immediately
		saveProgress();
	};

	const nextQuestion = () => {
		if (currentQuestionIndex < totalQuestions() - 1) {
			currentQuestionIndex++;
			selectedOptions = [];
			showResult = false;
			startTime = Date.now();
		} else {
			// All questions completed
			showSummary = true;
			const totalTimeSpent = totalStartTime ? Math.floor((Date.now() - totalStartTime) / 1000) : 0;
			
			onResponse({
				questionResponses,
				completed: true,
				totalTimeSpent
			});
		}
	};

	const saveProgress = () => {
		const totalTimeSpent = totalStartTime ? Math.floor((Date.now() - totalStartTime) / 1000) : 0;
		
		onResponse({
			questionResponses,
			completed: showSummary,
			totalTimeSpent
		});
	};

	const getOptionStyle = (optionIndex: number, isCorrect: boolean) => {
		if (!showResult) {
			return selectedOptions.includes(optionIndex) 
				? `border-2 border-[${color}] bg-[${color}]/10` 
				: 'border border-gray-200 hover:border-gray-300';
		}

		if (selectedOptions.includes(optionIndex)) {
			return isCorrect 
				? 'border-2 border-green-500 bg-green-50' 
				: 'border-2 border-red-500 bg-red-50';
		}

		if (isCorrect) {
			return 'border-2 border-green-500 bg-green-50';
		}

		return 'border border-gray-200 opacity-50';
	};

	const getOptionIcon = (optionIndex: number, isCorrect: boolean) => {
		if (!showResult) return '';
		
		if (selectedOptions.includes(optionIndex)) {
			return isCorrect ? '✓' : '✗';
		}
		
		if (isCorrect) {
			return '✓';
		}
		
		return '';
	};

	// Get current question's result
	const getCurrentQuestionResult = () => {
		const response = questionResponses.find(r => r.questionIndex === currentQuestionIndex);
		return response ? response.isCorrect : false;
	};

	// Calculate overall score
	const getOverallScore = $derived(() => {
		const correctAnswers = questionResponses.filter(r => r.isCorrect).length;
		return Math.round((correctAnswers / totalQuestions()) * 100);
	});
</script>

{#if showSummary}
	<!-- Summary View -->
	<div class="mb-6 bg-white/80 rounded-xl p-6 shadow-lg">
		<div class="text-center mb-6">
			<div class="text-3xl font-bold mb-2" class:text-green-600={getOverallScore() >= 80} class:text-yellow-600={getOverallScore() >= 60 && getOverallScore() < 80} class:text-red-600={getOverallScore() < 60}>
				{getOverallScore()}%
			</div>
			<div class="text-lg font-medium text-gray-700 mb-2">
				{#if getOverallScore() === 100}
					Perfect! 🎉
				{:else if getOverallScore() >= 80}
					Great job! 👏
				{:else if getOverallScore() >= 60}
					Good effort! 👍
				{:else}
					Keep practicing! 💪
				{/if}
			</div>
			<div class="text-sm text-gray-600">
				{questionResponses.filter(r => r.isCorrect).length} out of {totalQuestions()} questions correct
			</div>
		</div>

		<!-- Detailed Results -->
		<div class="space-y-4">
			<h4 class="font-medium text-gray-700">Question Results:</h4>
			{#each content.questions as question, index}
				{@const response = questionResponses.find(r => r.questionIndex === index)}
				<div class="p-3 border rounded-lg {response?.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
					<div class="flex items-center justify-between">
						<span class="font-medium">Question {index + 1}</span>
						<div class="flex items-center gap-2">
							<span class="text-sm text-gray-600">
								{response?.timeSpent || 0}s
							</span>
							<span class="text-lg">
								{response?.isCorrect ? '✅' : '❌'}
							</span>
						</div>
					</div>
					<p class="text-sm text-gray-700 mt-1">{@html marked(question.question)}</p>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<!-- Question View -->
	<div class="mb-6 bg-white/80 rounded-xl p-6 shadow-lg">
		<!-- Progress Bar -->
		<div class="mb-6">
			<div class="flex items-center justify-between text-sm text-gray-600 mb-2">
				<span>Question {currentQuestionIndex + 1} of {totalQuestions()}</span>
				<span>{completedQuestions()} completed</span>
			</div>
			<div class="w-full bg-gray-200 rounded-full h-2">
				<div 
					class="h-2 rounded-full transition-all duration-300"
					style="width: {progressPercentage()}%; background-color: {color};"
				></div>
			</div>
		</div>

		<!-- Question -->
		<div class="mb-6">
			<h3 class="text-lg font-bold mb-2">
				{@html marked(currentQuestion().question)}
			</h3>
			{#if content.allowMultiple && !showResult}
				<p class="text-sm text-gray-600">Multiple answers may be correct.</p>
			{/if}
		</div>

		<!-- Options -->
		<div class="space-y-3 mb-6">
			{#each currentQuestion().options as option, index}
				<button
					type="button"
					onclick={() => handleOptionSelect(index)}
					disabled={showResult}
					class="w-full text-left p-4 rounded-lg transition-all duration-200 {getOptionStyle(index, option.isCorrect)} {showResult ? 'cursor-default' : 'cursor-pointer'}"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							{@html marked(option.text)}
						</div>
						<div class="flex items-center gap-2">
							{#if showResult}
								<span class="text-lg font-bold">
									{getOptionIcon(index, option.isCorrect)}
								</span>
							{:else if selectedOptions.includes(index)}
								<div class="w-4 h-4 rounded-full bg-current opacity-60"></div>
							{:else}
								<div class="w-4 h-4 rounded-full border-2 border-gray-300"></div>
							{/if}
						</div>
					</div>
				</button>
			{/each}
		</div>

		<!-- Submit Button -->
		{#if !showResult && selectedOptions.length > 0}
			<button
				type="button"
				onclick={submitAnswer}
				class="w-full py-3 px-6 rounded-lg font-medium text-white transition-colors"
				style="background-color: {color}"
			>
				Submit Answer
			</button>
		{/if}

		<!-- Result and Next Button -->
		{#if showResult}
			<div class="mt-6 p-4 rounded-lg {getCurrentQuestionResult() ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
				<div class="font-medium mb-2">
					{getCurrentQuestionResult() ? '🎉 Correct!' : '❌ Incorrect'}
				</div>
				
				{#if currentQuestion().explanation}
					<div class="text-sm text-gray-700 mb-4">
						{@html marked(currentQuestion().explanation || '')}
					</div>
				{/if}

				<button
					type="button"
					onclick={nextQuestion}
					class="w-full py-2 px-4 rounded-lg font-medium text-white transition-colors"
					style="background-color: {color}"
				>
					{#if currentQuestionIndex < totalQuestions() - 1}
						Next Question
					{:else}
						Show Results
					{/if}
				</button>
			</div>
		{/if}
	</div>
{/if} 