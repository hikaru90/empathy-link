<script lang="ts">
	import { m } from '$lib/translations';
	import Plus from 'lucide-svelte/icons/plus';
	import Modules from '$lib/components/Modules.svelte';
	import Connector from "$assets/icons/connector.svg?raw";

	import BotMessageSquare from 'lucide-svelte/icons/bot-message-square';
	import ChartColumnDecreasing from 'lucide-svelte/icons/chart-column-decreasing';
	import Book from 'lucide-svelte/icons/book';
	import Users from 'lucide-svelte/icons/users';

  import {Button} from '$lib/components/ui/button'
	import { checkVisibility } from '$lib/actions';

	interface Card {
		heading: string;
		icon: string;
		text: string;
	}

	let cards = $derived([
		{
			heading: m.page_home_components_the4steps_steps_observation_heading(),
			subheading: m.page_home_components_the4steps_steps_observation_subheading(),
			color: 'observation-foreground',
			backgroundColor: 'observation-background',
			icon: BotMessageSquare,
			iconColor: 'lilac',
			text: m.page_home_components_the4steps_steps_observation_text()
		},
		{
			heading: m.page_home_components_the4steps_steps_feelings_heading(),
			subheading: m.page_home_components_the4steps_steps_feelings_subheading(),
			color: 'feelings-foreground',
			backgroundColor: 'feelings-background',
			icon: ChartColumnDecreasing,
			iconColor: 'rose',
			text: m.page_home_components_the4steps_steps_feelings_text()
		},
		{
			heading: m.page_home_components_the4steps_steps_needs_heading(),
			subheading: m.page_home_components_the4steps_steps_needs_subheading(),
			color: 'needs-foreground',
			backgroundColor: 'needs-background',
			icon: Book,
			iconColor: 'forest',
			text: m.page_home_components_the4steps_steps_needs_text()
		},
		{
			heading: m.page_home_components_the4steps_steps_request_heading(),
			subheading: m.page_home_components_the4steps_steps_request_subheading(),
			color: 'request-foreground',
			backgroundColor: 'request-background',
			icon: Users,
			iconColor: 'orange',
			text: m.page_home_components_the4steps_steps_request_text()
		}
	]);
</script>

<div class="flex flex-col items-center mb-40 pt-12 md:pt-0">
	<h2 use:checkVisibility class="transform opacity-0 translate-y-10 is-visible:translate-y-0 is-visible:opacity-100 transition-all duration-700 mb-8 md:mb:10 max-w-[13em] text-center font-display text-3xl md:text-4xl font-semibold lg:text-5xl">
		{m.page_home_components_the4steps_heading()}
	</h2>

	<p class="mb-10">
		Mit unseren 4 Modulen stärkst du, was zählt: echte Verbindung.
	</p>

	<!-- <Modules /> -->


	<div class="relative mb-16 md:mb:20">
    <div class="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<!-- <div class="w-28 stroke-black fill-none dark:stroke-neon">
				{@html Connector}
			</div> -->
      <!-- <img src="/connector.svg" alt="connector" class="w-28 text-red-200"> -->
    </div>
		<div use:checkVisibility class="transform opacity-0 scale-75 is-visible:scale-100 is-visible:opacity-100 transition-all duration-700 md:-m-4 flex flex-wrap items-stretch justify-center">
			{#each cards as card, index}
				<div class="group relative h-52 md:h-[330px] w-full px-4 py-3 md:py-4 md:w-1/2 md:max-w-[460px]" style="transition-delay: {(index +1) * 200}ms;">
					<!-- <div
						class="absolute left-full top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-first:md:block dark:bg-neon"
					></div>
					<div
						class="absolute left-0 top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-last:md:block dark:bg-neon"
					></div> -->
					<div class="flex h-full flex-col justify-between rounded-3xl bg-muted p-5 md:px-6 md:pt-6 md:pb-7 lg:px-8 lg:pt-8 lg:pb-10 shadow-lg">
						<div class="flex flex-row md:flex-col gap-2 items-center md:items-start">
							<div class="flex items-center font-display -ml-0.5 text-lg bg-background rounded-xl pl-1 pr-3 py-1 shadow-lg shadow-white border border-black/5">
								<card.icon class="size-7 rounded-lg mr-2 flex items-center justify-center bg-black p-2 text-white" />
								{card.subheading}
							</div>
							<h3 class="md:mb-6 font-display text-xl font-semibold md:text-2xl">
								{card.heading}
							</h3>
						</div>
						<div class="flex">
							<p class="">
								{card.text}
							</p>
							<!-- <div class="flex items-end">
								<div
									class="ml-2 lg:ml-10 flex w-6 h-6 lg:h-8 lg:w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-white/60 shadow-md"
								>
									<Plus />
								</div>
							</div> -->
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
  <!-- <div class="flex items-center justify-center">
    <Button variant="outline" class="bg-transparent border-2 border-black/60 text-base">
      {m.default_page_home_components_the4steps_cta_text()}
    </Button>
  </div> -->
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
