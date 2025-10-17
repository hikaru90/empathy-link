<script lang="ts">
	import GradientImage from '$lib/components/GradientImage.svelte';
	import FooterWebsite from '$lib/components/FooterWebsite.svelte';
	import { page } from '$app/stores';
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
</script>

<svelte:head>
	<title>Allgemeine Geschäftsbedingungen - Empathy Link</title>
	<meta name="description" content="Allgemeine Geschäftsbedingungen und Nutzungsbedingungen für Empathy Link" />
</svelte:head>

<div class="min-h-screen bg-white-background">
	<GradientImage class="pb-40 pt-20">
		<div class="max-container relative z-10">
			<a
				href="/"
				class="mb-10 inline-flex items-center gap-2 rounded-full bg-neutral-200 py-2 pl-4 pr-6 text-black"
			>
				<ArrowLeftIcon class="h-4 w-4" />
				Zurück zur Startseite
			</a>
			<h1 class="text-4xl font-bold text-black md:text-5xl lg:text-6xl">AGB</h1>
			<p class="mt-4 text-lg text-gray-700 md:text-xl">Allgemeine Geschäftsbedingungen</p>
		</div>
	</GradientImage>

	<div class="max-container py-10"></div>

	<!-- Content -->
	<div class="max-container pb-20">
		<div class="prose prose-lg max-w-none">
			<div class="space-y-6">
				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Entwicklungsphase</h2>
					<p class="leading-relaxed text-gray-700">
						Diese Website befindet sich derzeit in der Test- und Entwicklungsphase. 
						Es werden keine geschäftsmäßigen Dienste im Sinne von § 5 TMG angeboten. 
						Die Seite dient ausschließlich der internen Erprobung von Inhalten und 
						Funktionen des Projekts Empathy Link.
					</p>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Vollständige AGB</h2>
					<p class="leading-relaxed text-gray-700">
						Vollständige Allgemeine Geschäftsbedingungen werden veröffentlicht, 
						sobald der öffentliche Betrieb der Website aufgenommen wird. 
						Bis dahin gelten die nachfolgenden Grundsätze für die Nutzung.
					</p>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Wichtiger Hinweis</h2>
					<div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
						<h3 class="font-semibold text-red-800 mb-3">⚠️ Kein therapeutisches Produkt</h3>
						<p class="text-red-700 leading-relaxed">
							Empathy Link ist <strong>kein therapeutisches Produkt</strong> und ersetzt keine professionelle 
							psychologische Beratung, Therapie oder medizinische Behandlung. Bei ernsthaften 
							psychischen Problemen, Traumata oder schwerwiegenden Konflikten solltest du 
							immer professionelle Hilfe in Anspruch nehmen.
						</p>
					</div>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Haftungsausschluss</h2>
					<div class="space-y-4">
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-900 mb-2">🚫 Keine Haftung für Schäden</h3>
							<p class="text-gray-700">
								Wir haften nicht für direkte, indirekte, zufällige oder Folgeschäden, 
								die durch die Nutzung von Empathy Link entstehen können.
							</p>
						</div>
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-900 mb-2">⚖️ Eigene Verantwortung</h3>
							<p class="text-gray-700">
								Du bist vollständig für deine Entscheidungen und Handlungen verantwortlich. 
								Empathy Link ist nur ein Tool zur Unterstützung.
							</p>
						</div>
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-900 mb-2">🤖 KI-Limitierungen</h3>
							<p class="text-gray-700">
								KI-Systeme können fehlerhaft sein. Vertraue nicht blind auf KI-Empfehlungen 
								und nutze deinen gesunden Menschenverstand.
							</p>
						</div>
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-900 mb-2">📱 Technische Verfügbarkeit</h3>
							<p class="text-gray-700">
								Wir garantieren keine 100%ige Verfügbarkeit des Services. 
								Technische Ausfälle können jederzeit auftreten.
							</p>
						</div>
					</div>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Nutzungsbedingungen</h2>
					<ul class="list-disc list-inside space-y-2 text-gray-700">
						<li>Du musst mindestens 18 Jahre alt sein, um Empathy Link zu nutzen</li>
						<li>Die Plattform darf nicht für illegale Aktivitäten genutzt werden</li>
						<li>Du darfst keine anderen Nutzer belästigen oder bedrohen</li>
						<li>Du bist für die Richtigkeit deiner Angaben verantwortlich</li>
						<li>Wir behalten uns vor, Nutzer bei Verstößen zu sperren</li>
					</ul>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Änderungen der Bedingungen</h2>
					<p class="leading-relaxed text-gray-700">
						Wir behalten uns vor, diese Bedingungen während der Entwicklungsphase anzupassen. 
						Über wesentliche Änderungen werden wir dich informieren.
					</p>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Kontakt</h2>
					<p class="mb-2 text-gray-700">
						<strong>E-Mail:</strong>
						<a
							href="mailto:kontakt@empathy-link.de"
							class="font-medium underline transition-colors hover:text-purple-500"
						>
							kontakt@empathy-link.de
						</a>
					</p>
					<p class="text-sm text-gray-600 mt-4">
						Stand: {new Date().toLocaleDateString('de-DE')}
					</p>
				</section>
			</div>
		</div>
	</div>

	<FooterWebsite />
</div>
