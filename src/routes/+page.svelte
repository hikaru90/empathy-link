<script>
	import WebsiteMenu from '$lib/components/WebsiteMenu.svelte';
	import AnimatedHeroBig from '$lib/components/AnimatedHeroBig.svelte';
	import Locale from '$lib/components/Locale.svelte';
	import { t } from '$lib/translations';
	import The4Steps from '$lib/components/The4Steps.svelte';
	import Modules from '$lib/components/Modules.svelte';
	import Selfempathy from '$lib/components/Selfempathy.svelte';
	import Fight from '$lib/components/Fight.svelte';
	import Feedback from '$lib/components/Feedback.svelte';
	import Learn from '$lib/components/Learn.svelte';
	import { scroll, windowHeight } from '$store/page';
	import { onMount } from 'svelte';
	import { backgroundColor, currentSection } from '$store/page';
	import { featureFlags as flagStore } from '$store/posthog';

	export let data;

	console.log('data', data);

	$: ({ featureFlags, ...identity } = data);


const targetColors = [
	{name: 'topTarget', color: 'bg-white-background'},
	{name: 'stepsTarget', color: 'bg-background'},
	{name: 'modulesTarget', color: 'bg-background'},
	{name: 'selfempathyTarget', color: 'bg-observation-background dark:bg-white-background'},
	{name: 'fightTarget', color: 'bg-feelings-background dark:bg-background'},
	{name: 'feedbackTarget', color: 'bg-needs-background dark:bg-white-background'},
	{name: 'learnTarget', color: 'bg-request-background dark:bg-background'}
]

const updateBackgroundColor = () => {
	const targets = targetColors
	let newColor = '';
	let section = '';

	const offset = 100; // You can change this value to adjust the offset

	for (const target of targets) {
		const targetDiv = document.getElementById(target.name);
		if (targetDiv) {
			const rect = targetDiv.getBoundingClientRect();
			if (rect.top + offset >= 0 && rect.bottom + offset <= window.innerHeight) {
				newColor = target.color;
				section = target.name;
				break;
			}
		}
	}

	if (newColor) {
		backgroundColor.set(newColor);
		currentSection.set(section);
	}
};

scroll.subscribe(() => updateBackgroundColor());
windowHeight.subscribe(() => updateBackgroundColor());

onMount(() => {
	updateBackgroundColor();
});
</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<WebsiteMenu />
	<div class="{$backgroundColor} flex-grow relative transition duration-500">
		<div id="topTarget"></div>
		<div class="mb-20 relative z-0">
			<div class="max-container">
				<AnimatedHeroBig />
			</div>
		</div>
		<div class="max-container pb-40 relative z-10">
			<div id="stepsTarget"></div>
			<The4Steps />

			<div id="modulesTarget"></div>
			<Modules />
			
			<div id="selfempathyTarget"></div>
			<Selfempathy />
			
			<div id="fightTarget"></div>
			<Fight />
			
			<div id="feedbackTarget"></div>
			<Feedback />
			
			<div id="learnTarget"></div>
			<Learn />
		</div>
	</div>
</div>
