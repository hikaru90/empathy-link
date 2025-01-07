<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import type { PageData } from './$types.js';
	import RegisterForm from '$lib/components/RegisterForm.svelte';
	import { t } from '$lib/translations';
	export let data: PageData;

	console.log('login page');
</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<div class="flex-grow">
		<Menu />

		<div class="max-container relative">
			<div class="w-full flex flex-col items-center justify-center py-32">
				<h1 class="font-heading font-bold text-2xl mb-6">{$t('default.page.register.heading')}</h1>
				<RegisterForm data={data.form} class="w-full max-w-[400px]" />
			</div>
		</div>
	</div>
</div>
