<script lang="ts">
	interface Props {
		content: {
			bucketA: string;
			bucketB: string;
			items: {
				text: string;
				correctBucket: "A" | "B";
			}[];
		};
		userSorting: { [itemText: string]: "A" | "B" | null };
		color: string;
		currentCategory: {
			color: string;
		};
	}

	let { content, userSorting, currentCategory, color }: Props = $props();

	// Calculate results
	const getResults = () => {
		let correct = 0;
		let incorrect = 0;
		let unsorted = 0;

		const itemResults = content.items.map(item => {
			const userChoice = userSorting[item.text];
			const isCorrect = userChoice === item.correctBucket;
			const isUnsorted = userChoice === null;

			if (isUnsorted) {
				unsorted++;
				return { ...item, userChoice, isCorrect: false, isUnsorted: true };
			} else if (isCorrect) {
				correct++;
				return { ...item, userChoice, isCorrect: true, isUnsorted: false };
			} else {
				incorrect++;
				return { ...item, userChoice, isCorrect: false, isUnsorted: false };
			}
		});

		return {
			correct,
			incorrect,
			unsorted,
			total: content.items.length,
			percentage: Math.round((correct / content.items.length) * 100),
			itemResults
		};
	};

	const results = getResults();

	const getScoreColor = (percentage: number) => {
		if (percentage >= 80) return 'text-green-600';
		if (percentage >= 60) return 'text-yellow-600';
		return 'text-red-600';
	};

	const getScoreMessage = (percentage: number) => {
		if (percentage === 100) return 'Perfect! 🎉';
		if (percentage >= 80) return 'Great job! 👏';
		if (percentage >= 60) return 'Good effort! 👍';
		return 'Keep practicing! 💪';
	};
</script>

<div class="space-y-6">
	<!-- Score Summary -->
	<div class="text-center p-6 bg-gray-50 rounded-lg">
		<div class="text-3xl font-bold {getScoreColor(results.percentage)} mb-2">
			{results.percentage}%
		</div>
		<div class="text-lg font-medium text-gray-700 mb-2">
			{getScoreMessage(results.percentage)}
		</div>
		<div class="text-sm text-gray-600">
			{results.correct} correct • {results.incorrect} incorrect • {results.unsorted} not sorted
		</div>
	</div>

	<!-- Detailed Results -->
	<div class="space-y-4">
		<h4 class="font-medium text-gray-700">Detailed Results:</h4>
		
		{#each results.itemResults as item}
			<div class="flex items-center justify-between p-3 border rounded-lg {item.isCorrect ? 'bg-green-50 border-green-200' : item.isUnsorted ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}">
				<div class="flex-1">
					<span class="font-medium">{item.text}</span>
				</div>
				<div class="flex items-center gap-4 text-sm">
					<div class="text-gray-600">
						Correct: <span class="font-medium">{item.correctBucket === 'A' ? content.bucketA : content.bucketB}</span>
					</div>
					<div class="text-gray-600">
						Your choice: 
						<span class="font-medium {item.isCorrect ? 'text-green-600' : item.isUnsorted ? 'text-gray-500' : 'text-red-600'}">
							{item.isUnsorted ? 'Not sorted' : (item.userChoice === 'A' ? content.bucketA : content.bucketB)}
						</span>
					</div>
					<div class="text-lg">
						{#if item.isCorrect}
							✅
						{:else if item.isUnsorted}
							⚪
						{:else}
							❌
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Bucket Summary -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<!-- Bucket A Summary -->
		<div class="border rounded-lg p-4">
			<h5 class="font-medium mb-3" style="color: {currentCategory.color};">
				{content.bucketA}
			</h5>
			<div class="space-y-2">
				<div class="text-sm text-gray-600">
					Correct items: {results.itemResults.filter(item => item.correctBucket === 'A').length}
				</div>
				<div class="space-y-1">
					{#each results.itemResults.filter(item => item.correctBucket === 'A') as item}
						<div class="text-sm flex items-center gap-2">
							<span class="{item.isCorrect ? 'text-green-600' : 'text-red-600'}">
								{item.isCorrect ? '✓' : '✗'}
							</span>
							<span>{item.text}</span>
							{#if !item.isCorrect && !item.isUnsorted}
								<span class="text-xs text-gray-500">
									(placed in {item.userChoice === 'A' ? content.bucketA : content.bucketB})
								</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Bucket B Summary -->
		<div class="border rounded-lg p-4">
			<h5 class="font-medium mb-3" style="color: {currentCategory.color};">
				{content.bucketB}
			</h5>
			<div class="space-y-2">
				<div class="text-sm text-gray-600">
					Correct items: {results.itemResults.filter(item => item.correctBucket === 'B').length}
				</div>
				<div class="space-y-1">
					{#each results.itemResults.filter(item => item.correctBucket === 'B') as item}
						<div class="text-sm flex items-center gap-2">
							<span class="{item.isCorrect ? 'text-green-600' : 'text-red-600'}">
								{item.isCorrect ? '✓' : '✗'}
							</span>
							<span>{item.text}</span>
							{#if !item.isCorrect && !item.isUnsorted}
								<span class="text-xs text-gray-500">
									(placed in {item.userChoice === 'A' ? content.bucketA : content.bucketB})
								</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div> 