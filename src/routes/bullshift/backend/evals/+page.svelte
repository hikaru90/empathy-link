<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import EvaluationDashboard from '$lib/components/bullshift/EvaluationDashboard.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import Play from 'lucide-svelte/icons/play';
	import RefreshCw from 'lucide-svelte/icons/refresh-cw';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
	import CheckCircle from 'lucide-svelte/icons/check-circle';
	import Clock from 'lucide-svelte/icons/clock';
	import type { PageData } from './$types';
	import BackendNav from '$lib/components/bullshift/BackendNav.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let isEvaluating = $state(false);
	let evaluationProgress = $state(0);
	let evaluationResults = $state<any[]>([]);
	let evaluationErrors = $state<any[]>([]);
	let showDashboard = $state(false);

	async function runEvaluations() {
		if (data.unevaluatedChats.length === 0) {
			alert('No chats to evaluate!');
			return;
		}

		isEvaluating = true;
		evaluationProgress = 0;
		evaluationResults = [];
		evaluationErrors = [];

		try {
			const batchSize = 3; // Smaller batch size for backend processing
			const totalChats = data.unevaluatedChats.length;

			for (let i = 0; i < totalChats; i += batchSize) {
				const batch = data.unevaluatedChats.slice(i, i + batchSize);

				// Update progress
				evaluationProgress = Math.round((i / totalChats) * 100);

				// Process batch
				await Promise.all(
					batch.map(async (chat) => {
						try {
							const response = await fetch('/api/ai/evaluate-historical-chats', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									chatIds: [chat.id],
									batchSize: 1
								})
							});

							if (!response.ok) {
								throw new Error(`HTTP ${response.status}: ${response.statusText}`);
							}

							const result = await response.json();

							if (result.success && result.results.length > 0) {
								evaluationResults.push({
									chatId: chat.id,
									evaluation: result.results[0].evaluation
								});
							} else {
								throw new Error('API returned unsuccessful result');
							}
						} catch (error: any) {
							console.error(`Error evaluating chat ${chat.id}:`, error);
							evaluationErrors.push({
								chatId: chat.id,
								error: error.message
							});
						}
					})
				);

				// Add delay between batches
				if (i + batchSize < totalChats) {
					await new Promise((resolve) => setTimeout(resolve, 2000));
				}
			}

			evaluationProgress = 100;

			// Refresh the page data
			window.location.reload();
		} catch (error: any) {
			console.error('Evaluation failed:', error);
			alert('Evaluation failed: ' + error.message);
		} finally {
			isEvaluating = false;
		}
	}

	function toggleDashboard() {
		showDashboard = !showDashboard;
	}
</script>

<div class="pb-24 pt-16">
	<Header user={data.user} />
	<BackendNav />
	<main class="container mx-auto px-4 py-8">
		<div class="mb-8">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Chat Evaluation Backend</h1>
			<p class="text-gray-600">
				Evaluate your historical AI chat conversations for NVC conformance, safety, and helpfulness.
			</p>
		</div>

		<!-- Stats Overview -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
			<Card>
				<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle class="text-sm font-medium">Total Chats</CardTitle>
					<Clock class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">{data.stats.total}</div>
					<p class="text-xs text-muted-foreground">All time</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle class="text-sm font-medium">Evaluated</CardTitle>
					<CheckCircle class="h-4 w-4 text-green-600" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold text-green-600">{data.stats.evaluated}</div>
					<p class="text-xs text-muted-foreground">Completed</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle class="text-sm font-medium">Pending</CardTitle>
					<AlertTriangle class="h-4 w-4 text-yellow-600" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold text-yellow-600">{data.stats.unevaluated}</div>
					<p class="text-xs text-muted-foreground">Ready to evaluate</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle class="text-sm font-medium">Progress</CardTitle>
					<RefreshCw class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">
						{data.stats.total > 0
							? Math.round((data.stats.evaluated / data.stats.total) * 100)
							: 0}%
					</div>
					<p class="text-xs text-muted-foreground">Evaluation coverage</p>
				</CardContent>
			</Card>
		</div>

		<!-- Evaluation Controls -->
		<Card class="mb-8">
			<CardHeader>
				<CardTitle>Run Evaluations</CardTitle>
				<CardDescription>
					{#if !data.collectionExists}
						⚠️ The chatEvals collection doesn't exist yet. Create it in PocketBase first, then run
						evaluations.
					{:else}
						Evaluate all unevaluated chats using AI analysis. This process may take several minutes.
					{/if}
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium">Chats to evaluate: {data.stats.unevaluated}</p>
						<p class="text-xs text-muted-foreground">
							Estimated time: {Math.ceil(data.stats.unevaluated / 3) * 2} seconds
						</p>
					</div>
					<Button
						onclick={runEvaluations}
						disabled={isEvaluating || data.stats.unevaluated === 0 || !data.collectionExists}
						class="min-w-[120px]"
					>
						{#if isEvaluating}
							<RefreshCw class="mr-2 h-4 w-4 animate-spin" />
							Evaluating...
						{:else}
							<Play class="mr-2 h-4 w-4" />
							Start Evaluation
						{/if}
					</Button>
				</div>

				{#if !data.collectionExists}
					<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
						<div class="flex items-center">
							<AlertTriangle class="mr-2 h-5 w-5 text-yellow-600" />
							<span class="font-medium text-yellow-800"> Setup Required </span>
						</div>
						<div class="mt-2 text-sm text-yellow-700">
							Create the <code>chatEvals</code> collection in PocketBase with these fields:
							<ul class="mt-2 list-inside list-disc">
								<li><code>id</code> (string, auto)</li>
								<li><code>chatId</code> (string)</li>
								<li><code>userId</code> (string)</li>
								<li><code>evaluation</code> (json)</li>
								<li><code>created</code> (date, auto)</li>
								<li><code>updated</code> (date, auto)</li>
							</ul>
						</div>
					</div>
				{/if}

				{#if isEvaluating}
					<div class="space-y-2">
						<div class="flex justify-between text-sm">
							<span>Progress</span>
							<span>{evaluationProgress}%</span>
						</div>
						<div class="h-2 w-full rounded-full bg-gray-200">
							<div
								class="h-2 rounded-full bg-blue-600 transition-all duration-300"
								style="width: {evaluationProgress}%"
							></div>
						</div>
					</div>
				{/if}

				{#if evaluationResults.length > 0}
					<div class="rounded-lg border border-green-200 bg-green-50 p-4">
						<div class="flex items-center">
							<CheckCircle class="mr-2 h-5 w-5 text-green-600" />
							<span class="font-medium text-green-800">
								Successfully evaluated {evaluationResults.length} chats
							</span>
						</div>
					</div>
				{/if}

				{#if evaluationErrors.length > 0}
					<div class="rounded-lg border border-red-200 bg-red-50 p-4">
						<div class="flex items-center">
							<AlertTriangle class="mr-2 h-5 w-5 text-red-600" />
							<span class="font-medium text-red-800">
								{evaluationErrors.length} evaluations failed
							</span>
						</div>
						<div class="mt-2 text-sm text-red-700">
							{#each evaluationErrors as error}
								<div>Chat {error.chatId.slice(0, 8)}: {error.error}</div>
							{/each}
						</div>
					</div>
				{/if}
			</CardContent>
		</Card>

		<!-- Dashboard Toggle -->
		<div class="mb-6">
			<Button onclick={toggleDashboard} variant="outline" class="w-full md:w-auto">
				{showDashboard ? 'Hide Dashboard' : 'Show Evaluation Dashboard'}
			</Button>
		</div>

		<!-- Evaluation Dashboard -->
		{#if showDashboard}
			<EvaluationDashboard />
		{/if}

		<!-- Recent Chats -->
		<Card>
			<CardHeader>
				<CardTitle>Recent Chats</CardTitle>
				<CardDescription>Your most recent chat conversations</CardDescription>
			</CardHeader>
			<CardContent>
				{#if data.chats.length === 0}
					<div class="py-8 text-center text-muted-foreground">
						No chats found. Start a conversation to see it here.
					</div>
				{:else}
					<div class="space-y-3">
						{#each data.chats.slice(0, 10) as chat}
							<div class="flex items-center justify-between rounded-lg border p-3">
								<div class="flex-1">
									<div class="flex items-center space-x-2">
										<span class="font-medium">Chat {chat.id.slice(0, 8)}</span>
										<span class="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800"
											>{chat.module}</span
										>
										{#if data.evaluations.some((e) => e.chatId === chat.id)}
											<span class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
												Evaluated
											</span>
										{:else}
											<span class="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-600"
												>Pending</span
											>
										{/if}
									</div>
									<div class="mt-1 text-sm text-muted-foreground">
										{chat.history?.length || 0} messages •
										{new Date(chat.created).toLocaleDateString()}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</CardContent>
		</Card>
	</main>

	<Footer />
</div>
