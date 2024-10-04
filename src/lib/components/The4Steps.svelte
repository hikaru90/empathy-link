<script lang="ts">
	import { t, locale } from '$lib/translations';
	import IconPlus from 'svelte-radix/Plus.svelte';
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';
	import Connector from "$assets/icons/connector.svg?raw";
  import {Button} from '$lib/components/ui/button'

	interface Card {
		heading: string;
		icon: string;
		text: string;
	}

	$: cards = [
		{
			heading: $t('default.page.home.components.the4steps.steps.observation.heading'),
			color: 'observation-foreground',
			backgroundColor: 'observation-background',
			icon: IconEye,
			text: $t('default.page.home.components.the4steps.steps.observation.text')
		},
		{
			heading: $t('default.page.home.components.the4steps.steps.feelings.heading'),
			color: 'feelings-foreground',
			backgroundColor: 'feelings-background',
			icon: IconHeart,
			text: $t('default.page.home.components.the4steps.steps.feelings.text')
		},
		{
			heading: $t('default.page.home.components.the4steps.steps.needs.heading'),
			color: 'needs-foreground',
			backgroundColor: 'needs-background',
			icon: IconSwirl,
			text: $t('default.page.home.components.the4steps.steps.needs.text')
		},
		{
			heading: $t('default.page.home.components.the4steps.steps.request.heading'),
			color: 'request-foreground',
			backgroundColor: 'request-background',
			icon: IconSteps,
			text: $t('default.page.home.components.the4steps.steps.request.text')
		}
	];
</script>

<div class="flex flex-col items-center mb-40 pt-12 md:pt-0">
	<h2 class="mb-16 md:mb:20 max-w-[13em] text-center font-display text-3xl md:text-4xl font-semibold lg:text-5xl">
		{$t('default.page.home.components.the4steps.heading')}
	</h2>
	<div class="relative mb-16 md:mb:20">
    <div class="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<div class="w-28 stroke-black fill-none dark:stroke-neon">
				{@html Connector}
			</div>
      <!-- <img src="/connector.svg" alt="connector" class="w-28 text-red-200"> -->
    </div>
		<div class="md:-m-4 flex flex-wrap items-stretch justify-center">
			{#each cards as card}
				<div class="group relative h-52 md:h-72 w-full px-4 py-3 md:py-4 md:w-1/2 md:max-w-[460px]">
					<div
						class="absolute left-full top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-first:md:block dark:bg-neon"
					></div>
					<div
						class="absolute left-0 top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-last:md:block dark:bg-neon"
					></div>
					<div class="flex h-full flex-col justify-between rounded-3xl bg-muted p-5 md:p-6 lg:p-8 shadow-lg">
						<div class="flex flex-row md:flex-col gap-4 items-center md:items-start">
							<div class="skeumorphic-button h-9 w-9 rounded-full bg-offwhite p-0.5">
								<div
									class="bg-{card.backgroundColor} fill-{card.color} flex items-center justify-center rounded-full p-1 shadow-inner"
								>
									{@html card.icon}
								</div>
							</div>
							<h3 class="md:mb-6 font-display text-xl font-semibold md:text-2xl">
								{card.heading}
							</h3>
						</div>
						<div class="flex">
							<p class="">
								{card.text}
							</p>
							<div class="flex items-end">
								<div
									class="ml-2 lg:ml-10 flex w-6 h-6 lg:h-8 lg:w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-white/60 shadow-md"
								>
									<IconPlus />
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
  <!-- <div class="flex items-center justify-center">
    <Button variant="outline" class="bg-transparent border-2 border-black/60 text-base">
      {$t('default.page.home.components.the4steps.cta.text')}
    </Button>
  </div> -->
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
