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
	let currentChatIndex = $state(0);
	let totalChats = $state(0);

	async function runEvaluations() {
		console.log('runEvaluations - evaluating all chats');
		if (data.unevaluatedChats.length === 0) {
			alert('No chats with conversation history available for evaluation! Make sure you have some completed chat conversations first.');
			return;
		}

		isEvaluating = true;
		evaluationProgress = 0;
		evaluationResults = [];
		evaluationErrors = [];
		currentChatIndex = 0;
		totalChats = data.unevaluatedChats.length;

		try {
			// Get all unevaluated chat IDs
			const chatIds = data.unevaluatedChats.map(chat => chat.id);
			console.log(`Evaluating ${chatIds.length} chats`);

			const response = await fetch('/api/ai/evaluate-historical-chats', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					chatIds: chatIds,
					batchSize: 5 // Process 5 chats at a time to be respectful to the AI API
				})
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
			}

			const result = await response.json();
			console.log('API response:', result);

			if (result.success && result.results && result.results.length > 0) {
				// Add all successful evaluations
				result.results.forEach((item: any) => {
					evaluationResults.push({
						chatId: item.chatId,
						evaluation: item.evaluation
					});
				});
				
				// Add any errors that occurred
				if (result.errors && result.errors.length > 0) {
					result.errors.forEach((error: any) => {
						evaluationErrors.push({
							chatId: error.chatId,
							error: error.error
						});
					});
				}
				
				console.log(`Successfully evaluated ${result.results.length} chats!`);
			} else {
				console.error('API response details:', result);
				throw new Error(`API returned unsuccessful result: ${JSON.stringify(result)}`);
			}

			evaluationProgress = 100;
			
			// Reload the page to show updated stats
			setTimeout(() => {
				window.location.reload();
			}, 2000);

		} catch (error: any) {
			console.error('Evaluation failed:', error);
			evaluationErrors.push({
				chatId: 'multiple',
				error: error.message
			});
		} finally {
			isEvaluating = false;
		}
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
			<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
				<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle class="text-sm font-medium">Total Chats</CardTitle>
					<Clock class="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold">{data.stats.total}</div>
					<p class="text-xs text-muted-foreground">All time</p>
				</CardContent>
			</Card>

			<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
				<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle class="text-sm font-medium">Evaluated</CardTitle>
					<CheckCircle class="h-4 w-4 text-green-600" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold text-green-600">{data.stats.evaluated}</div>
					<p class="text-xs text-muted-foreground">Completed</p>
				</CardContent>
			</Card>

			<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
				<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle class="text-sm font-medium">Pending</CardTitle>
					<AlertTriangle class="h-4 w-4 text-yellow-600" />
				</CardHeader>
				<CardContent>
					<div class="text-2xl font-bold text-yellow-600">{data.stats.unevaluated}</div>
					<p class="text-xs text-muted-foreground">Ready to evaluate</p>
				</CardContent>
			</Card>

			<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
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
		<Card class="mb-8 bg-offwhite border border-white/20 shadow-md shadow-black/5">
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
					<div class="">
						<p class="text-sm font-medium">Full Evaluation: Will evaluate all chats</p>
						<p class="text-xs text-muted-foreground">
							Evaluating all {data.unevaluatedChats.length} chats with conversation history (processed in batches of 5)
						</p>
					</div>
					<button
						onclick={() => runEvaluations()}
						disabled={isEvaluating || data.unevaluatedChats.length === 0}
						class="flex items-center justify-center rounded-full border border-white/20 bg-offwhite px-3 py-1 shadow-md shadow-black/5 min-w-[120px] hover:bg-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isEvaluating}
							<RefreshCw class="mr-2 h-4 w-4 animate-spin" />
							Evaluating...
						{:else}
							<Play class="mr-2 h-4 w-4" />
							Run Full Evaluation
						{/if}
					</button>
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
						<div class="text-xs text-muted-foreground text-center">
							Evaluating chat {currentChatIndex + 1} of {totalChats}
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

		<!-- Evaluation Dashboard -->
		<EvaluationDashboard evaluations={data.evaluations} />

		<!-- Recent Chats -->
		<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
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
