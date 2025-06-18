<script lang="ts">
	import FightOverviewAll from '$lib/components/FightOverviewAll.svelte';
	import AppTopMenu from '$lib/components/AppTopMenu.svelte';
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import { m } from '$lib/translations';
	import { Button as SparkleButton } from '$lib/components/ui/button-sparkle';
	import Plus from 'lucide-svelte/icons/plus'
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left'
	import { backgroundColor } from '$store/page';
	import ReceivedLinks from '$lib/components/ReceivedLinks.svelte';

	interface Props {
		data: App.Locals;
	}

	let { data }: Props = $props();
</script>

	<div class="flex h-full flex-grow flex-col justify-between overflow-hidden">
		<AppTopMenu />
		<div class="max-container flex-grow pb-40">
			<div
				class="relative z-10 mb-8 flex flex-row items-start justify-between py-4 md:items-center md:bg-transparent md:pb-6"
			>
				<h1 class="font-heading text-lg font-semibold">{m.page_fight_heading()}</h1>
			</div>
			<ReceivedLinks class="mb-14" />
			<FightOverviewAll user={data.user} />
			<AppBottomMenu>
				<div class="relative flex h-auto items-center justify-between">
					<a href="/app/dashboard" class="block">
						<Button
							decoration="dark-op1"
							class="flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
						>
							<ChevronLeft class="h-4 w-4 rounded-full" />
						</Button>
					</a>
					<a href="/app/fights/create" class="skeumorphic-button-dark inline-block rounded-full mr-1 md:mr-0.5">
						<SparkleButton
							class="flex items-center justify-between gap-10 rounded-full pl-5 pr-3 font-bold text-black dark:shadow-gray-300/30"
						>
							{m.page_fights_create()}
							<Plus class="h-4 w-4" />
						</SparkleButton>
					</a>
				</div>
			</AppBottomMenu>
		</div>
	</div>

<style lang="scss">
	.skeumorphic-button-dark {
		transition: box-shadow 50ms;
		box-shadow:
			inset 0 0 8px 0 rgba(0, 0, 0, 0.2),
			var(--skeumorphic-shadow);
	}
</style>
