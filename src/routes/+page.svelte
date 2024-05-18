<script>
	import { ChevronRight } from 'radix-icons-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { toggleMode } from 'mode-watcher';
	import Menu from '$lib/components/Menu.svelte';
	import HeroBig from '$lib/components/HeroBig.svelte';
	import Locale from '$lib/components/Locale.svelte';
	import { t } from '$lib/translations';

	export let data;

	console.log('data',data);
</script>

<div class="flex-grow flex h-full flex-col justify-between">
	<div class="flex-grow">
		<Menu />

		<div class="max-container">
			<HeroBig />
			<!-- <Button variant="outline" size="icon">
				<ChevronRight class="h-4 w-4" />
			</Button> -->
		</div>
	</div>
</div>

