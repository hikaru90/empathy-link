<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
	export let data: PageData;

	console.log('login page');
</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<div class="flex-grow">
		<Menu />

		<div class="max-container relative">
			<div class="w-full flex flex-col items-center justify-center py-32">
				<h1 class="font-heading font-bold text-2xl">{$t('default.page.login.heading')}</h1>
				<LoginForm data={data.form} class="w-full md:w-[400px]" />
			</div>
		</div>
	</div>
</div>
