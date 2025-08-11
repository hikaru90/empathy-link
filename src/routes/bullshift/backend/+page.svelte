<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import UserDataTable from '$lib/components/backend/user-data-table.svelte';
	import BackendNav from '$lib/components/bullshift/BackendNav.svelte';

	import type { PageData } from './$types';
	import { page } from '$app/state';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	
</script>

<div class="pt-16 pb-24">
	<Header user={data.user} />
	<BackendNav />
	<div class="flex h-full w-full flex-col">
		{#if data.error}
			<div class="max-container py-8">
				<Card class="border-red-200">
					<CardContent class="pt-6">
						<p class="text-red-600">{data.error}</p>
					</CardContent>
				</Card>
			</div>
		{:else}
			<div class="max-container py-8 space-y-8">
				<!-- Page Header -->
				<div>
					<h1 class="text-3xl font-bold tracking-tight">Backend Statistics</h1>
					<p class="text-muted-foreground">
						Usage statistics and user management overview
					</p>
				</div>

				<!-- Overview Statistics -->
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">Total Users</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">{data.stats.totalUsers}</div>
							<p class="text-xs text-muted-foreground">
								Registered users
							</p>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">Total Chats</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">{data.stats.totalChats}</div>
							<p class="text-xs text-muted-foreground">
								+{data.stats.recentActivity.chats} this month
							</p>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">Analyses</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">{data.stats.totalAnalyses}</div>
							<p class="text-xs text-muted-foreground">
								+{data.stats.recentActivity.analyses} this month
							</p>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">AI Traces</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">{data.stats.totalTraces}</div>
							<p class="text-xs text-muted-foreground">
								+{data.stats.recentActivity.traces} this month
							</p>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">Errors</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">{data.stats.totalErrors}</div>
							<p class="text-xs text-muted-foreground">
								+{data.stats.recentActivity.errors} this month
							</p>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">Learn Sessions</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">{data.stats.totalLearnSessions}</div>
							<p class="text-xs text-muted-foreground">
								+{data.stats.recentActivity.learnSessions} this month
							</p>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">Completed</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold text-green-600">{data.stats.completedLearnSessions}</div>
							<p class="text-xs text-muted-foreground">
								+{data.stats.recentActivity.completedSessions} this month
							</p>
						</CardContent>
					</Card>
				</div>

				<!-- Token Usage Statistics -->
				<div class="grid gap-4 md:grid-cols-3">
					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader>
							<CardTitle>Token Usage</CardTitle>
							<CardDescription>
								AI token consumption overview
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-2">
								<div class="flex justify-between">
									<span class="text-sm text-muted-foreground">Input Tokens:</span>
									<span class="font-medium">{data.stats.tokenUsage.totalInputTokens.toLocaleString()}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-sm text-muted-foreground">Output Tokens:</span>
									<span class="font-medium">{data.stats.tokenUsage.totalOutputTokens.toLocaleString()}</span>
								</div>
								<div class="border-t pt-2">
									<div class="flex justify-between">
										<span class="text-sm font-medium">Total:</span>
										<span class="font-bold">{data.stats.tokenUsage.totalTokens.toLocaleString()}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader>
							<CardTitle>Module Usage</CardTitle>
							<CardDescription>
								Distribution of chat sessions across different modules
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-3">
								{#each Object.entries(data.stats.moduleStats) as [module, count]}
									<div class="flex items-center">
										<div class="w-24 text-sm">{module}</div>
										<div class="flex-1 mx-3">
											<div class="bg-secondary h-2 rounded-full">
												<div 
													class="bg-primary h-2 rounded-full" 
													style="width: {(count / data.stats.totalChats * 100)}%"
												></div>
											</div>
										</div>
										<div class="w-20 text-right text-sm">{count} ({Math.round(count / data.stats.totalChats * 100)}%)</div>
									</div>
								{/each}
							</div>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader>
							<CardTitle>Function Usage</CardTitle>
							<CardDescription>
								Most frequently called AI functions
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-3">
								{#each Object.entries(data.stats.functionStats).sort(([,a], [,b]) => b - a).slice(0, 5) as [functionName, count]}
									<div class="flex items-center">
										<div class="w-24 text-sm truncate" title={functionName}>{functionName}</div>
										<div class="flex-1 mx-3">
											<div class="bg-secondary h-2 rounded-full">
												<div 
													class="bg-blue-500 h-2 rounded-full" 
													style="width: {(count / data.stats.totalTraces * 100)}%"
												></div>
											</div>
										</div>
										<div class="w-16 text-right text-sm">{count}</div>
									</div>
								{/each}
							</div>
						</CardContent>
					</Card>
				</div>

				<!-- User Statistics Table -->
				<Card class="bg-offwhite border-white/20">
					<CardHeader>
						<CardTitle>User Statistics</CardTitle>
						<CardDescription>
							Detailed usage statistics for each user
						</CardDescription>
					</CardHeader>
					<CardContent class="max-h-[500px] overflow-y-auto mb-5">
						<UserDataTable data={data.userStats} />
					</CardContent>
				</Card>
			</div>
		{/if}
	</div>
	<Footer />
</div>

<style>
	.max-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.25rem;
	}
</style>