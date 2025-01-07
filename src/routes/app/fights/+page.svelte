<script lang="ts">
	import FightOverviewAll from '$lib/components/FightOverviewAll.svelte';
	import AppTopMenu from '$lib/components/AppTopMenu.svelte';
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import type { PageData } from '../../app/fights/$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
	import { Button as SparkleButton } from '$lib/components/ui/button-sparkle';
	import { Plus } from 'radix-icons-svelte';
	import { user } from '$store/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import { CaretLeft } from 'radix-icons-svelte';
	import { backgroundColor } from '$store/page';
	import ReceivedLinks from '$lib/components/ReceivedLinks.svelte';

	// export let data: PageData;

	onMount(() => {
		if (!$user) goto('/app/auth/login');
		// Add bg-background class to the body
		backgroundColor.set('bg-background');
	});
</script>

{#if $user}
	<div class="flex h-full flex-grow flex-col justify-between overflow-hidden">
		<AppTopMenu />
		<div class="max-container flex-grow pb-40">
			<div
				class="relative z-10 mb-8 flex flex-row items-start justify-between py-4 md:items-center md:bg-transparent md:pb-6"
			>
				<h1 class="font-heading text-lg font-semibold">{$t('default.page.fight.heading')}</h1>
			</div>
			<ReceivedLinks class="mb-14" />
			<FightOverviewAll />
			<AppBottomMenu>
				<div class="relative flex h-auto items-center justify-between">
					<a href="/app/dashboard" class="block">
						<Button
							decoration="dark-op1"
							class="flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
						>
							<CaretLeft class="h-4 w-4 rounded-full" />
						</Button>
					</a>
					<a href="/app/fights/create" class="skeumorphic-button-dark inline-block rounded-full mr-1 md:mr-0.5">
						<SparkleButton
							class="flex items-center justify-between gap-10 rounded-full pl-5 pr-3 font-bold text-black dark:shadow-gray-300/30"
						>
							{$t('default.page.fights.create')}
							<Plus class="h-4 w-4" />
						</SparkleButton>
					</a>
				</div>
			</AppBottomMenu>
		</div>
	</div>
{/if}

<style lang="scss">
	.skeumorphic-button-dark {
		transition: box-shadow 50ms;
		box-shadow:
			inset 0 0 8px 0 rgba(0, 0, 0, 0.2),
			var(--skeumorphic-shadow);
	}
</style>
