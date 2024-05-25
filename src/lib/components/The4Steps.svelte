<script lang="ts">
	import { t, locale } from '$lib/translations';
	import IconPlus from 'svelte-radix/Plus.svelte';
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';
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

<div class="flex flex-col items-center mb-40">
	<h2 class="mb-20 max-w-[19em] text-center font-display text-2xl font-semibold lg:text-4xl">
		{$t('default.page.home.components.the4steps.heading')}
	</h2>
	<div class="relative mb-20">
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <img src="/connector.svg" alt="connector" class="w-28">
    </div>
		<div class="-m-4 flex flex-wrap items-stretch justify-center">
			{#each cards as card}
				<div class="group relative h-72 w-full p-4 md:w-1/2 md:max-w-[460px]">
					<div
						class="absolute left-full top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-first:block"
					></div>
					<div
						class="absolute left-0 top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-last:block"
					></div>
					<div class="flex h-full flex-col justify-between rounded-3xl bg-white p-8 shadow-lg">
						<div>
							<div class="skeumorphic-button mb-4 h-9 w-9 rounded-full bg-offwhite p-0.5">
								<div
									class="bg-{card.backgroundColor} fill-{card.color} flex items-center justify-center rounded-full p-1 shadow-inner"
								>
									{@html card.icon}
								</div>
							</div>
							<h3 class="mb-3 font-display text-xl font-semibold md:text-2xl">
								{card.heading}
							</h3>
						</div>
						<div class="flex">
							<p class="">
								{card.text}
							</p>
							<div class="flex items-end">
								<div
									class="ml-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-offwhite shadow-md"
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
  <div class="flex items-center justify-center">
    <Button variant="outline" class="bg-transparent border-2 border-black/60 text-base">
      {$t('default.page.home.components.the4steps.cta.text')}
    </Button>
  </div>
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
