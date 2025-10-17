<script lang="ts">
	import WebsiteMenu from '$lib/components/WebsiteMenu.svelte';
	import GradientImage from '$lib/components/GradientImage.svelte';
	import FooterWebsite from '$lib/components/FooterWebsite.svelte';
	import { page } from '$app/stores';
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
</script>

<svelte:head>
	<title>Impressum - Empathy Link</title>
	<meta name="description" content="Impressum und rechtliche Informationen zu Empathy Link" />
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
			<h1 class="text-4xl font-bold text-black md:text-5xl lg:text-6xl">Impressum</h1>
			<p class="mt-4 text-lg text-gray-700 md:text-xl">Rechtliche Informationen und Kontaktdaten</p>
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
						Diese Website befindet sich derzeit in der Test- und Entwicklungsphase. Es werden keine
						geschäftsmäßigen Dienste im Sinne von § 5 TMG angeboten. Die Seite dient ausschließlich
						der internen Erprobung von Inhalten und Funktionen des Projekts Empathy Link.
					</p>
				</section>

				<section>
					<h2 class="mb-4 text-xl font-semibold text-gray-900">Vollständiges Impressum</h2>
					<p class="leading-relaxed text-gray-700">
						Ein vollständiges Impressum mit ladungsfähiger Anschrift und weiteren Pflichtangaben
						wird veröffentlicht, sobald der öffentliche Betrieb der Website aufgenommen wird.
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
				</section>
			</div>
		</div>
	</div>

	<FooterWebsite />
</div>
