<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
	import { page } from '$app/stores';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	console.log('data',data);

	const verifyMail = $page.url.searchParams.get('verifyMail');
	console.log('verifyMail', verifyMail);

</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<div class="flex-grow">
		<Menu user={data.user} />

		
		<div class="max-container relative">
			<div class="w-full flex flex-col items-center justify-center py-32">
				{#if verifyMail}
					<div class="max-container relative">
						<div class="text-white">
							{$t('default.page.login.verifyMail')}
						</div>
					</div>
				{/if}
				<h1 class="font-heading font-bold text-2xl">{$t('default.page.login.heading')}</h1>
				<LoginForm data={data.form} class="w-full max-w-[400px]" />
			</div>
		</div>
	</div>
</div>
