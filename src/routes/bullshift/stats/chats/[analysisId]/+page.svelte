<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import type { PageData } from './$types';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { marked } from 'marked';
	import Dial from '$lib/components/Dial.svelte';
	import Counter from '$lib/components/Counter.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let chatExpanded = $state(false);
	const goBack = () => {
		window.history.back();
	};

	const dials = [
		{ slug: 'sentimentPolarity', label: 'Stimmung', min: -1, max: 1, type: 'dial' },
		{ slug: 'intensityRatio', label: 'Intensität', min: 0, max: 1, type: 'dial' },
		{ slug: 'emotionalBalance', label: 'Balance', min: 0, max: 1, type: 'dial' },
		{ slug: 'triggerCount', label: 'Anzahl Trigger', min: 0, max: 999, type: 'number' },
		{ slug: 'resolutionCount', label: 'Anzahl Lösungen', min: 0, max: 100, type: 'number' },
		{ slug: 'escalationRate', label: 'Eskalation', min: 0, max: 1, type: 'dial' },
		{ slug: 'empathyRate', label: 'Empathie', min: 0, max: 1, type: 'dial' },
		{ slug: 'messageLength', label: 'Nachrichtenlänge', min: 0, max: 100, type: 'number' },
		{ slug: 'readabilityScore', label: 'Lesbarkeit', min: 0, max: 100, type: 'number' }
	];
</script>

<div class="mt-1px pt-16">
	<Header user={data.user} />
	<div class="flex h-full w-full flex-col overflow-hidden">
		{#if data.error}
			<p class="text-red-500">{data.error}</p>
		{:else}
			<div class="max-container pb-16">
				<button
					onclick={goBack}
					class="inline-flex items-center gap-2 rounded-full border border-black/10 py-1 pl-2 pr-4 text-sm"
				>
					<ChevronLeft class="size-4" /> zurück
				</button>
				<div class="mt-6 rounded-b-xl px-2 pb-3 pt-2">
					<h1 class="mb-1 text-lg font-bold leading-tight">
						{data.analysis.title}
					</h1>
					<p class="mb-6 text-sm text-gray-800">
						{new Intl.DateTimeFormat('de-DE', {
							month: 'short',
							day: 'numeric',
							year: 'numeric'
						}).format(new Date(data.analysis.created))}
					</p>

					<div class="mb-6">
						<div class="-mx-2 flex flex-wrap">
							{#each dials as dial}
								{#if dial.type === 'dial'}
									<Dial
										value={data.analysis[dial.slug]}
										min={dial.min}
										max={dial.max}
										label={dial.label}
										class="w-1/3 md:w-1/4"
									/>
								{:else if dial.type === 'number'}
									<Counter
										value={data.analysis[dial.slug]}
										min={dial.min}
										max={dial.max}
										label={dial.label}
										class="w-1/3 md:w-1/4"
									/>
								{/if}
							{/each}
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<div class="flex flex-col gap-4 rounded-lg bg-offwhite p-4">
							<div class="flex flex-col gap-2">
								<h2 class="font-bold mb-4">Beobachtung</h2>
								<p class="text-sm text-gray-800">
									{data.analysis.observation}
								</p>
							</div>
						</div>
						<div class="flex flex-col gap-4 rounded-lg bg-offwhite p-4">
							<div class="flex flex-col gap-2">
								<h2 class="font-bold mb-4">Gefühle</h2>
								<div class="flex flex-wrap gap-y-1 text-sm text-gray-800">
									{#each data.analysis.feelings as feeling}
										<div class="rounded-full bg-white px-2 py-1 text-xs">
											{feeling}
										</div>
									{/each}
								</div>
							</div>
						</div>
						<div class="flex flex-col gap-4 rounded-lg bg-offwhite p-4">
							<div class="flex flex-col gap-2">
								<h2 class="font-bold mb-4">Bedürfnisse</h2>
								<div class="flex flex-wrap gap-y-1 text-sm text-gray-800">
									{#each data.analysis.needs as need}
										<div class="rounded-full bg-white px-2 py-1 text-xs">
											{need}
										</div>
									{/each}
								</div>
							</div>
						</div>
						<div class="flex flex-col gap-4 rounded-lg bg-offwhite p-4">
							<div class="flex flex-col gap-2">
								<h2 class="font-bold mb-4">Bitte</h2>
								<div class="flex flex-wrap gap-y-1 text-sm text-gray-800">
									{data.analysis.request}
								</div>
							</div>
						</div>
					</div>

					<div
						class="mt-6 flex flex-col gap-4 rounded-lg bg-neutral-400 p-4 {chatExpanded
							? 'max-h-auto'
							: 'max-h-40'} relative overflow-y-hidden"
					>
						<button
							onclick={() => (chatExpanded = !chatExpanded)}
							class="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 transform text-red-600 {chatExpanded
								? 'rotate-180'
								: ''}"
						>
							<ChevronDown class="size-4 text-white" />
						</button>
						<div
							class="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-400 {chatExpanded
								? 'opacity-0'
								: 'opacity-100'}"
						></div>
						<div class="flex flex-col gap-2">
							<h2 class="font-bold">Chat</h2>
							<div class="flex flex-col gap-2">
								{#each data.analysis.expand.chat.history as message}
									<div class="mb-4 {message.role === 'user' ? 'text-right' : 'text-left'}">
										<div
											class="inline-block rounded-xl px-3 py-2 {message.role === 'user'
												? 'border border-white'
												: 'bg-white'}"
										>
											<div class="text-sm">
												{#if 'text' in message.parts[0]}
													{@html marked(message.parts[0].text)}
													<!-- {@html marked(
													message.role === 'user'
														? message.parts[0].text
														: safelyParseJSON(message.parts[0].text).response
												)} -->
												{:else if 'functionCall' in message.parts[0]}
													<div class="text-xs">
														<span class="font-bold">Funktion:</span>
														{message.parts[0].functionCall.name}
														<span class="font-bold">Argumente:</span>
														{JSON.stringify(message.parts[0].functionCall.args)}
													</div>
												{/if}
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
	<Footer />
</div>
