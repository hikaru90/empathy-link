<script lang="ts">
	import { m } from '$lib/translations';
	import Logo from '$lib/components/Logo.svelte';
	import { setCookie, scrollToElement } from '$scripts/helpers';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GradientImage from '$lib/components/GradientImage.svelte';

	const scrollToTarget = (target: string) => {
		const targetDiv = document.getElementById(target);
		if (targetDiv) {
			scrollToElement(targetDiv, 400);
		} else {
			console.warn(`Target element with id "${target}" not found`);
		}
	};

	const handleNavigation = (target: string) => {
		if ($page.url.pathname === '/') {
			// Wir sind bereits auf der Homepage, verwende scrollToTarget
			scrollToTarget(target);
		} else {
			// Wir sind auf einer anderen Seite, navigiere zur Homepage mit Hash
			goto(`/#${target}`);
		}
	};
</script>

<div class="flex items-center justify-center py-20 bg-black/95">
<a href="/app/auth/login" class="flex cursor-pointer text-lg">
	<GradientImage
		class="rounded-xl border border-black/5 bg-lilac font-bold text-black shadow-lg dark:shadow-gray-300/30"
	>
		<div class="relative z-10 px-6 py-4 shadow-inner shadow-white/20 lg:px-7 lg:py-5">
			{m.page_home_cta()}
    </GradientImage>
  </a>
</div>
<footer class="relative z-10 bg-black text-white">
	<div class="max-container py-20">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
			<!-- Logo und Beschreibung -->
			<div class="lg:col-span-2">
				<div class="mb-6">
					<Logo />
				</div>
				<p class="mb-6 max-w-[28em] text-sm text-gray-300">
					Empathy Link hilft dir dabei, Empathie zu deiner Superpower zu machen. Mit unserem
					KI-gestützten Coach lernst du, Konflikte friedlich zu lösen und tiefere Verbindungen zu
					schaffen.
				</p>
				<!-- <div class="flex gap-4">
					<a
						href="mailto:contact@empathy-link.de"
						class="text-gray-300 transition-colors hover:text-white"
					>
						contact@empathy-link.de
					</a>
				</div> -->
				<p class="text-sm text-white/50 mb-4">
					Gefördert von
				</p>
				<a href="https://nextmedia-hamburg.de/" target="_blank" title="Next Media Hamburg">
					<img src="/nextMedia_Logo+Text_inverted.svg" alt="Next Media Logo" class="w-32 h-auto">
				</a>
			</div>

			<!-- Navigation Links -->
			<div>
				<h3 class="mb-6 text-lg font-semibold">Navigation</h3>
				<ul class="space-y-2">
					<li>
						<button
							onclick={() => handleNavigation('functionSectionTarget')}
							class="text-left text-gray-300 transition-colors hover:text-white"
						>
							{m.menu_sections_selfempathy()}
						</button>
					</li>
					<li>
						<button
							onclick={() => handleNavigation('moduleSectionTarget')}
							class="text-left text-gray-300 transition-colors hover:text-white"
						>
							{m.menu_sections_the4steps()}
						</button>
					</li>
					<li>
						<button
							onclick={() => handleNavigation('privacySectionTarget')}
							class="text-left text-gray-300 transition-colors hover:text-white"
						>
							{m.menu_sections_fight()}
						</button>
					</li>
					<li>
						<button
							onclick={() => handleNavigation('aboutSectionTarget')}
							class="text-left text-gray-300 transition-colors hover:text-white"
						>
							{m.menu_sections_learn()}
						</button>
					</li>
					<li>
						<button
							onclick={() => handleNavigation('faqSectionTarget')}
							class="text-left text-gray-300 transition-colors hover:text-white"
						>
							{m.menu_sections_faq()}
						</button>
					</li>
				</ul>
			</div>

			<!-- Rechtliches -->
			<div>
				<h3 class="mb-6 text-lg font-semibold">Rechtliches</h3>
				<ul class="space-y-2">
					<li>
						<a href="/imprint" class="text-gray-300 transition-colors hover:text-white">
							Impressum
						</a>
					</li>
					<li>
						<a href="/privacy" class="text-gray-300 transition-colors hover:text-white">
							Datenschutz
						</a>
					</li>
					<li>
						<a href="/terms" class="text-gray-300 transition-colors hover:text-white"> AGB </a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Trennlinie und Copyright -->
		<div class="mt-12 border-t border-gray-800 pt-8">
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<p class="text-sm text-gray-400">
					© {new Date().getFullYear()} Empathy Link. Alle Rechte vorbehalten.
				</p>
				<div class="flex items-center gap-6 text-sm text-gray-400">
					<span>Entwickelt mit ❤️ für bessere Kommunikation</span>
				</div>
			</div>
		</div>
	</div>
</footer>
