<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
	import { Button as SparkleButton } from "$lib/components/ui/button-sparkle";
	import { Plus } from 'radix-icons-svelte';
	export let data: PageData;

	console.log('login page');
</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<div class="flex-grow max-container py-10">
		<Menu />

		<!-- <h1>Fights</h1> -->
		<a href="/fights/create" class="w-full flex items-center justify-center py-4 lg:py-12 border rounded-lg border-border">
			<SparkleButton class="flex items-center justify-between gap-10 shadow-lg dark:shadow-gray-300/30 text-black font-bold lg:text-lg px-3 py-5 lg:px-6 lg:py-7">
				{$t('default.page.fights.create')}
				<Plus class="w-5 h-5" />
			</SparkleButton>
		</a>
	</div>
</div>
