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

	export let data;

	console.log('data',data);
</script>

<div class="flex-grow flex h-full flex-col justify-between">
	<div class="flex-grow">
		<Menu />

		<div class="max-container pb-40">
			<AnimatedHeroBig />
			<The4Steps />
			<Modules />
			<Selfempathy />
		</div>
	</div>
</div>

