<script lang="ts">
	import GradientImage from '$lib/components/GradientImage.svelte';
	import FooterWebsite from '$lib/components/FooterWebsite.svelte';
	import { page } from '$app/stores';
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
</script>

<svelte:head>
	<title>Datenschutz - Empathy Link</title>
	<meta name="description" content="Datenschutzerklärung und Informationen zum Umgang mit personenbezogenen Daten bei Empathy Link" />
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
			<h1 class="text-4xl font-bold text-black md:text-5xl lg:text-6xl">Datenschutz</h1>
			<p class="mt-4 text-lg text-gray-700 md:text-xl">Informationen zum Umgang mit deinen Daten</p>
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
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Datenschutzerklärung</h2>
					<p class="leading-relaxed text-gray-700">
						Eine vollständige Datenschutzerklärung wird veröffentlicht, sobald der 
						öffentliche Betrieb der Website aufgenommen wird. Bis dahin werden 
						personenbezogene Daten nur im Rahmen der technischen Entwicklung und 
						des Testbetriebs verarbeitet.
					</p>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Unser Datenschutz-Versprechen</h2>
					<p class="leading-relaxed text-gray-700 mb-6">
						Konflikte sind zu intim, um sie einer KI einfach zu schenken. Wir wollen einen Safe Space für dich erschaffen, in dem du innerlich wachsen kannst. Du klärst mit Empathy Link deine Konflikte – wir kümmern uns um den Schutz deiner Daten.
					</p>
					<p class="leading-relaxed text-gray-700 mb-6">
						Anders als bei kostenlosen KI-Tools: Dort können deine persönlichsten Gedanken zum Trainingsmaterial werden. Bei uns nicht. Datenschutz ist kein Feature – es ist dein Grundrecht.
					</p>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Unsere Datenschutz-Prinzipien</h2>
					<div class="space-y-4">
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-900 mb-2">🔒 Verschlüsselt</h3>
							<p class="text-gray-700">Wir speichern deine Chats verschlüsselt auf Servern in Deutschland</p>
						</div>
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-900 mb-2">🚫 Kein Datenverkauf</h3>
							<p class="text-gray-700">Wir verkaufen deine Daten nicht, weder an KI-Anbieter noch an Werbefirmen</p>
						</div>
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-900 mb-2">🤖 Kein Daten-Training</h3>
							<p class="text-gray-700">Wir verwenden deine Gespräche nicht um unsere Modelle zu verbessern</p>
						</div>
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-semibold text-gray-900 mb-2">👤 Komplett anonym</h3>
							<p class="text-gray-700">Niemand kann deine Unterhaltungen lesen, auch wir nicht</p>
						</div>
					</div>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Datenverarbeitung während der Entwicklungsphase</h2>
					<p class="leading-relaxed text-gray-700 mb-4">
						Während der Entwicklungsphase werden folgende Daten verarbeitet:
					</p>
					<ul class="list-disc list-inside space-y-2 text-gray-700">
						<li>Technische Logs für die Fehlerbehebung</li>
						<li>Anonymisierte Nutzungsstatistiken</li>
						<li>Testdaten für die Funktionsentwicklung</li>
						<li>E-Mail-Adressen für Kontaktaufnahme (freiwillig)</li>
					</ul>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Deine Rechte</h2>
					<p class="leading-relaxed text-gray-700">
						Du hast das Recht auf Auskunft, Berichtigung, Löschung und 
						Einschränkung der Verarbeitung deiner personenbezogenen Daten. 
						Bitte wende dich hierfür an uns.
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
