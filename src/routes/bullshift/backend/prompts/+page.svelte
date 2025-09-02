<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import type { DbPrompt } from '$lib/server/prompts';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import BackendNav from '$lib/components/bullshift/BackendNav.svelte';
	import PromptItem from '$lib/components/PromptItem.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	export let data: PageData;
	export let form: ActionData;

	$: prompts = data.prompts || [];
	$: promptsByCategory = prompts.reduce(
		(acc: Record<string, DbPrompt[]>, prompt: DbPrompt) => {
			if (!acc[prompt.category]) {
				acc[prompt.category] = [];
			}
			acc[prompt.category].push(prompt);
			return acc;
		},
		{} as Record<string, DbPrompt[]>
	);
</script>

<svelte:head>
	<title>Prompt Management - Admin</title>
</svelte:head>

<div class="pb-24 pt-16">
	<Header user={data.user} />
	<BackendNav />
	<div class="container mx-auto max-w-6xl px-4 py-8">
		<div class="mb-8 flex items-center justify-between">
			<h1 class="text-3xl font-bold">Prompt Management</h1>
		</div>

		{#if data.error}
			<div class="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
				{data.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
				{form.message}
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
				{form.error}
			</div>
		{/if}

		<!-- Prompts List -->
		<div class="space-y-4">
			{#each Object.entries(promptsByCategory) as [category, categoryPrompts]}
				<Collapsible.Root class="overflow-hidden rounded-lg border border-white bg-offwhite shadow-sm">
					<Collapsible.Trigger class="flex w-full items-center justify-between bg-gray-50 px-4 py-2 transition-colors">
						<h2 class="text-lg font-semibold capitalize">
							{category} Prompts ({(categoryPrompts as DbPrompt[]).length})
						</h2>
						<ChevronDown class="h-5 w-5 text-gray-500 transition-transform duration-200" />
					</Collapsible.Trigger>
					<Collapsible.Content class="p-4">
						<div class="space-y-4">
							{#each (categoryPrompts as DbPrompt[]) as prompt}
								<PromptItem {prompt} />
							{/each}
						</div>
					</Collapsible.Content>
				</Collapsible.Root>
			{/each}
		</div>
	</div>
	<Footer user={data.user} />
</div>
