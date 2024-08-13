<script>
	import { ChevronRight } from 'radix-icons-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { toggleMode } from 'mode-watcher';
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

	export let data;

	console.log('data', data);
</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<div class="flex-grow relative">
		<WebsiteMenu />

		<div class="mb-32 relative z-0">
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
