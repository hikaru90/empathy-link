<script lang="ts">
	import WebsiteMenu from '$lib/components/WebsiteMenu.svelte';
	import AnimatedHeroBig from '$lib/components/AnimatedHeroBig.svelte';
	import Locale from '$lib/components/Locale.svelte';
	import { m } from '$lib/translations';
	import ModuleSection from '$src/lib/components/ModuleSection.svelte';
	import Modules from '$lib/components/Modules.svelte';
	import FunctionSection from '$src/lib/components/FunctionSection.svelte';
	import Fight from '$lib/components/Fight.svelte';
	import Privacy from '$lib/components/Privacy.svelte';
	import AboutSection from '$src/lib/components/AboutSection.svelte';
	import { scroll, windowHeight } from '$store/page';
	import { onMount } from 'svelte';
	import { backgroundColor, currentSection } from '$store/page';
	import { browser } from '$app/environment';
	import UspsSection from '$src/lib/components/UspsSection.svelte';
	import FaqSection from '$src/lib/components/FaqSection.svelte';

	interface Props {
		data: App.Locals;
	}

	let { data }: Props = $props();

	const targetColors = [
		{ name: 'topTarget', color: 'bg-white-background' },
		{ name: 'functionSectionTarget', color: 'bg-sky-100' },
		{ name: 'moduleSectionTarget', color: 'bg-lilac' },
		{ name: 'privacySectionTarget', color: 'bg-emerald-900/30' },
		{ name: 'aboutSectionTarget', color: 'bg-[#E19B52]' },
		{ name: 'faqSectionTarget', color: 'bg-neutral-200' }
	];

	const updateBackgroundColor = () => {
		if (!browser) return;

		const targets = targetColors;
		let newColor = targetColors[0].color; // Default to first section color
		let section = targetColors[0].name;

		const viewportCenter = window.innerHeight / 2;

		// Find which section we're currently in based on scroll position
		// Work backwards through sections to find the last one we've passed
		for (let i = targets.length - 1; i >= 0; i--) {
			const target = targets[i];
			const targetDiv = document.getElementById(target.name);
			if (targetDiv) {
				const rect = targetDiv.getBoundingClientRect();
				// If the marker is above the viewport center, we're in this section
				if (rect.top <= viewportCenter) {
					newColor = target.color;
					section = target.name;
					break;
				}
			}
		}

		backgroundColor.set(newColor);
		currentSection.set(section);
	};

	scroll.subscribe(() => updateBackgroundColor());
	windowHeight.subscribe(() => updateBackgroundColor());

	onMount(() => {
		updateBackgroundColor();
	});
</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<WebsiteMenu user={data.user} />
	<div class="{$backgroundColor} relative flex-grow transition duration-500">
		<div id="topTarget"></div>
		<div class="relative z-0 mb-0">
			<div class="max-container">
				<AnimatedHeroBig />
			</div>
		</div>
		<div class="max-container relative z-10 pb-40">

			<div class="relative">
				<div id="uspsSectionTarget" class="absolute -top-20"></div>
			</div>
			<UspsSection />

			<div class="relative">
				<div id="functionSectionTarget" class="absolute -top-20"></div>
			</div>
			<FunctionSection />

			<div class="relative">
				<div id="moduleSectionTarget" class="absolute -top-20"></div>
			</div>
			<ModuleSection />

			<div class="relative">
				<div id="privacySectionTarget" class="absolute -top-20"></div>
			</div>
			<Privacy />
			
			<div class="relative">
			<div id="aboutSectionTarget" class="absolute -top-20"></div>
			</div>
			<AboutSection />

			<div class="relative">
				<div id="faqSectionTarget" class="absolute -top-20"></div>
			</div>
			<FaqSection />
		</div>
	</div>
</div>
