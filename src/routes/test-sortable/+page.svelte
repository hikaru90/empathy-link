<script lang="ts">
	import LearnSortable from '$lib/components/bullshift/Learn/LearnSortable.svelte';

	let userSorting = $state<{ [itemText: string]: "A" | "B" | null }>({});

	const testContent = {
		bucketA: "Healthy Habits",
		bucketB: "Unhealthy Habits",
		items: [
			{ text: "Drinking 8 glasses of water daily", correctBucket: "A" as const },
			{ text: "Smoking cigarettes", correctBucket: "B" as const },
			{ text: "Exercising 30 minutes a day", correctBucket: "A" as const },
			{ text: "Eating fast food every meal", correctBucket: "B" as const },
			{ text: "Getting 7-8 hours of sleep", correctBucket: "A" as const },
			{ text: "Staying up all night scrolling social media", correctBucket: "B" as const }
		]
	};

	const currentCategory = {
		color: "#3B82F6"
	};

	const handleResponse = (response: { userSorting: { [itemText: string]: "A" | "B" | null } }) => {
		userSorting = response.userSorting;
		console.log('Sortable response:', response);
	};

	const resetTest = () => {
		userSorting = {};
	};

	// Simulate loading from saved responses
	const loadSavedState = () => {
		userSorting = {
			"Drinking 8 glasses of water daily": "A",
			"Smoking cigarettes": "B",
			"Exercising 30 minutes a day": "A",
			"Eating fast food every meal": null,
			"Getting 7-8 hours of sleep": null,
			"Staying up all night scrolling social media": null
		};
	};

	// Check if all items are sorted
	const allItemsSorted = $derived(() => {
		return testContent.items.every(item => userSorting[item.text] !== null && userSorting[item.text] !== undefined);
	});
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-4xl mx-auto px-4">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Sortable Component Demo</h1>
			<p class="text-gray-600">Test the interactive sorting functionality</p>
		</div>

		<div class="bg-white rounded-lg shadow-lg p-6 mb-6">
			<div class="mb-4 flex gap-2">
				<button
					onclick={resetTest}
					class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
				>
					Reset
				</button>
				<button
					onclick={loadSavedState}
					class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
				>
					Load Saved State (3/6 sorted)
				</button>
			</div>
			<LearnSortable 
				content={testContent} 
				{currentCategory} 
				color={currentCategory.color}
				initialUserSorting={userSorting}
				onResponse={handleResponse}
			/>
		</div>

		<div class="bg-gray-100 rounded-lg p-4">
			<h3 class="font-medium text-gray-700 mb-2">Debug Info:</h3>
			<pre class="text-sm text-gray-600 overflow-auto">{JSON.stringify({ userSorting, allItemsSorted }, null, 2)}</pre>
		</div>
	</div>
</div> 