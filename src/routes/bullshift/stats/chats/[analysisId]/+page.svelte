<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import type { PageData } from './$types';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { marked } from 'marked';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let chatExpanded = $state(false);
	const goBack = () => {
		window.history.back();
	};
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

					{#if data.analysis.dailyWin}
						<div class="mt-6 rounded-lg border border-white bg-white/80 p-4 mb-6">
							<div class="mb-2 font-semibold">Erkenntnis</div>
							<div class="">{data.analysis.dailyWin}</div>
						</div>
					{/if}

					<!-- Session Insight -->
					<div
						class="mb-6 rounded-lg border border-white bg-white/80 p-4"
					>
						<h2 class="mb-4 font-bold">Deine Session Auswertung</h2>

						<div class="space-y-4">
							{#if data.analysis.emotionalShift}
								<div class="flex items-center gap-3">
									<span class="text-2xl">🌡️</span>
									<div>
										<span class="font-semibold">Emotionale Entwicklung:</span>
										<span class="ml-2">{data.analysis.emotionalShift}.</span>
									</div>
								</div>
							{/if}

							{#if data.analysis.iStatementMuscle !== undefined}
								<div class="flex items-center gap-3">
									<span class="text-2xl">💪</span>
									<div>
										<span class="font-semibold">Ich-Aussagen Muskel:</span>
										<span class="ml-2"
											>{data.analysis.iStatementMuscle}% deiner Sprache fokussierte sich auf deine
											eigene Erfahrung.</span
										>
									</div>
								</div>
							{/if}

							{#if data.analysis.clarityOfAsk}
								<div class="flex items-center gap-3">
									<span class="text-2xl">🎯</span>
									<div>
										<span class="font-semibold">Klarheit der Bitte:</span>
										<span class="ml-2">Deine finale Bitte war {data.analysis.clarityOfAsk}.</span>
									</div>
								</div>
							{/if}

							{#if data.analysis.empathyAttempt !== undefined}
								<div class="flex items-center gap-3">
									<span class="text-2xl">❤️</span>
									<div>
										<span class="font-semibold">Empathie Versuch:</span>
										<span class="ml-2"
											>{data.analysis.empathyAttempt
												? 'Du hast versucht, die Perspektive der anderen Person zu verstehen.'
												: 'Du hast dich hauptsächlich auf deine eigene Perspektive konzentriert.'}</span
										>
									</div>
								</div>
							{/if}

							{#if data.analysis.feelingVocabulary !== undefined}
								<div class="flex items-center gap-3">
									<span class="text-2xl">🧠</span>
									<div>
										<span class="font-semibold">Gefühls-Wortschatz:</span>
										<span class="ml-2"
											>Du hast {data.analysis.feelingVocabulary} unterschiedliche Gefühlswörter verwendet.</span
										>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<div class="flex flex-col gap-4 rounded-lg bg-offwhite p-4">
							<div class="flex flex-col gap-2">
								<h2 class="mb-4 font-bold">Beobachtung</h2>
								<p class="text-sm text-gray-800">
									{data.analysis.observation}
								</p>
							</div>
						</div>
						<div class="flex flex-col gap-4 rounded-lg bg-offwhite p-4">
							<div class="flex flex-col gap-2">
								<h2 class="mb-4 font-bold">Gefühle</h2>
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
								<h2 class="mb-4 font-bold">Bedürfnisse</h2>
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
								<h2 class="mb-4 font-bold">Bitte</h2>
								<div class="flex flex-wrap gap-y-1 text-sm text-gray-800">
									{data.analysis.request}
								</div>
							</div>
						</div>
					</div>

					<div
						class="mt-6 flex flex-col gap-4 rounded-lg bg-black/5 p-4 {chatExpanded
							? 'max-h-auto'
							: 'max-h-96'} relative overflow-y-hidden"
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
								{#each data.analysis.expand.chat.history.filter((msg) => !msg.hidden) as message}
									<!-- Path marker display -->
									{#if message.pathMarker}
										<div class="mb-4 flex justify-center">
											<div
												class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
											>
												{#if message.pathMarker.type === 'path_start'}
													🚀 Gestartet: {message.pathMarker.path
														.replace('_', ' ')
														.replace('idle', 'Gesprächsführung')
														.replace('self empathy', 'Selbst-Empathie')
														.replace('other empathy', 'Fremd-Empathie')
														.replace('action planning', 'Handlungsplanung')
														.replace('conflict resolution', 'Konfliktlösung')
														.replace('feedback', 'Gespräch beenden')}
												{:else if message.pathMarker.type === 'path_end'}
													✅ Abgeschlossen: {message.pathMarker.path
														.replace('_', ' ')
														.replace('idle', 'Gesprächsführung')
														.replace('self empathy', 'Selbst-Empathie')
														.replace('other empathy', 'Fremd-Empathie')
														.replace('action planning', 'Handlungsplanung')
														.replace('conflict resolution', 'Konfliktlösung')
														.replace('feedback', 'Gespräch beenden')}
												{:else if message.pathMarker.type === 'path_switch'}
													🔄 Gewechselt zu: {message.pathMarker.path
														.replace('_', ' ')
														.replace('idle', 'Gesprächsführung')
														.replace('self empathy', 'Selbst-Empathie')
														.replace('other empathy', 'Fremd-Empathie')
														.replace('action planning', 'Handlungsplanung')
														.replace('conflict resolution', 'Konfliktlösung')
														.replace('feedback', 'Gespräch beenden')}
												{/if}
											</div>
										</div>
									{:else if !message.pathMarker}
										<!-- Regular message display -->
										<div
											aria-label={message.role}
											class="message {message.role} mb-4 flex {message.role === 'user'
												? 'ml-4 justify-end'
												: 'mr-4 justify-start'}"
										>
											<div
												class="inline-block break-words rounded-b-xl px-3 py-1.5 shadow-lg shadow-black/5 {message.role ===
												'user'
													? 'rounded-tl-xl rounded-tr border border-white/40 bg-offwhite '
													: message.role === 'error'
														? 'rounded-tl-md rounded-tr-xl border border-red-300 bg-red-100 text-red-800'
														: 'rounded-tl rounded-tr-xl border border-white bg-white/90'}"
											>
												<div class="flex items-start gap-2">
													<div class="text-sm">
														{#if 'text' in message.parts[0]}
															{@html marked(message.parts[0].text)}
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
										</div>
									{/if}
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
	<Footer user={data.user} />
</div>
