<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
	import { page } from '$app/stores';

	export let data: PageData;

	const verifyMail = $page.url.searchParams.get('verifyMail');

	console.log('login page');
</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<div class="flex-grow">
		<Menu />

		{#if verifyMail === 'true'}
			<div class="max-container relative">
				<div class="">
					{$t('default.page.login.verifyMail')}
				</div>
			</div>
		{/if}

		<div class="max-container relative">
			<div class="w-full flex flex-col items-center justify-center py-32">
				<h1 class="font-heading font-bold text-2xl">{$t('default.page.login.heading')}</h1>
				<LoginForm data={data.form} class="w-full md:w-[400px]" />
			</div>
		</div>
	</div>
</div>
