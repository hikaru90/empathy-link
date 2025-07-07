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
		if (percentage === 100) return 'Perfekt';
		if (percentage >= 80) return 'Super gemacht';
		if (percentage >= 60) return 'Stark';
		return 'Bleib dran';
	};
</script>

<div class="space-y-6 mb-10">
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

</div> 