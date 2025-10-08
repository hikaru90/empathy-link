<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import BullshiftChat from '$lib/components/bullshift/BullshiftChat.svelte';
	import OnboardingWelcome from '$lib/components/OnboardingWelcome.svelte';
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let showOnboarding = $state(false);
	let isInitializing = $state(false);

	const completeOnboarding = () => {
		showOnboarding = false;
		if (browser) {
			localStorage.setItem('bullshiftOnboardingCompleted', 'true');
		}
	};

	const initNewChat = async () => {
		isInitializing = true;
		try {
			const response = await fetch('/api/ai/bullshift/initChat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					user: data.user, 
					locale: 'de' // Default to German
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			if (result.error) throw new Error(result.error);

			// Invalidate all data to refresh the page with new chat
			await invalidateAll();
		} catch (error) {
			console.error('Failed to initialize new chat:', error);
			// You could show an error message here if needed
		} finally {
			isInitializing = false;
		}
	};

	onMount(() => {
		if (browser) {
			const hasCompletedOnboarding = (localStorage.getItem('bullshiftOnboardingCompleted') === 'true');
			if (!hasCompletedOnboarding) {
				showOnboarding = true;
			}
		}
	});

	// Cleanup function
	onDestroy(async () => {
		if (browser && data.chatId) {
			try {
				// Make a request to cleanup endpoint
				await fetch('/api/ai/bullshift/cleanup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						chatId: data.chatId
					})
				});
			} catch (error) {
				console.error('Error cleaning up chat:', error);
			}
		}
	});
</script>

<div class="">
	<Header user={data.user} />
	<div class="max-container py-16">
		<div class="flex h-full w-full flex-col">
			{#if data.error}
				<div class="flex flex-col items-center gap-4 p-8">
					<p class="text-red-500 text-center">{data.error}</p>
					<p class="text-gray-600 text-sm text-center">Es scheint ein Problem mit dem Chat-Verlauf zu geben.</p>
					<button
						onclick={initNewChat}
						disabled={isInitializing}
						class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isInitializing}
							Neuen Chat erstellen...
						{:else}
							Neuen Chat starten
						{/if}
					</button>
				</div>
			{:else if data.chatId && data.systemPrompt}
				<BullshiftChat
					class="relative"
					chatId={data.chatId}
					history={data.history}
					systemInstruction={data.systemPrompt}
					user={data.user}
				/>
			{:else}
				<div>
					Something went wrong. chatId: {!!data.chatId}, systemPrompt: {!!data.systemPrompt}
				</div>
			{/if}
		</div>
	</div>
	<Footer user={data.user} />
	{#if showOnboarding}
		<OnboardingWelcome onComplete={completeOnboarding} user={data.user} />
	{/if}
</div>
