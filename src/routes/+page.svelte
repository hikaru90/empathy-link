<script>
	import { ChevronRight } from 'radix-icons-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { toggleMode } from 'mode-watcher';
	import Menu from '$lib/components/Menu.svelte';
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
	<div class="flex-grow">
		<div class="absolute">
			<Menu />
		</div>

		<div class="mb-32 relative z-0">
			<div class="max-container">
				<AnimatedHeroBig />
			</div>
		</div>
		<div class="max-container pb-40 relative z-10 bg-offwhite">
			<The4Steps />
			<Modules />
			<Selfempathy />
			<Fight />
			<Feedback />
			<Learn />
		</div>
	</div>
</div>
