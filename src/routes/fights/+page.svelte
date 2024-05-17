<script lang="ts">
	import FightOverviewAll from '$lib/components/FightOverviewAll.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
	import { Button as SparkleButton } from '$lib/components/ui/button-sparkle';
	import { Plus } from 'radix-icons-svelte';
	import { user } from '$store/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	onMount(() => {
		if (!$user) goto('/auth/login');
	});
</script>

{#if $user}
	<div class="flex h-full flex-grow flex-col justify-between">
		<div class="max-container flex-grow py-10">
			<Menu />

			<!-- <h1>Fights</h1> -->
			<a
				href="/fights/create"
				class="flex w-full items-center justify-center rounded-lg border border-border py-4 lg:py-12 mb-10"
			>
				<SparkleButton
					class="flex items-center justify-between gap-10 px-3 py-5 font-bold text-black shadow-lg dark:shadow-gray-300/30 lg:px-6 lg:py-7 lg:text-lg"
				>
					{$t('default.page.fights.create')}
					<Plus class="h-5 w-5" />
				</SparkleButton>
			</a>

			<FightOverviewAll />
		</div>
	</div>
{/if}
