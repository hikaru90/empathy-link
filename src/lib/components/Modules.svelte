<script lang="ts">
	import { m } from '$lib/translations';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';
	import { getLocale } from '$src/paraglide/runtime';
	const locale = $derived(getLocale());
	

	interface Card {
		heading: string;
		icon: string;
		text: string;
	}

	let modules = $derived([
		{
			heading: m.page_home_components_modules_modules_selfempathy(),
			icon: IconSelf,
			delayed: false
		},
		{
			heading: m.page_home_components_modules_modules_fight(),
			icon: IconFight,
			delayed: false
		},
		{
			heading: m.page_home_components_modules_modules_feedback(),
			icon: IconFeedback,
			delayed: true
		},
		{
			heading: m.page_home_components_modules_modules_learn(),
			icon: IconLearn,
			delayed: true
		}
	]);
</script>

<div class="mb-40 flex flex-col items-center">
	<h2 class="mb-16 md:mb:20 max-w-[19em] text-center font-display text-2xl font-semibold lg:text-4xl">
		{m.page_home_components_modules_heading()}
	</h2>
	<div class="relative">
		<div class="relative flex flex-row flex-wrap justify-center gap-4">
			{#each modules as module}
					<div
						class="group relative flex items-center justify-center rounded-[36px] bg-muted p-3 lg:p-6 text-sm shadow-xl md:w-auto"
					>
						<div
							class="absolute left-full top-1/2 hidden h-1 w-4 -translate-y-1/2 transform bg-black/90 dark:bg-neon md:block group-last:md:hidden"
						></div>
						<div
							class="flex size-[100px] md:size-[120px] lg:size-[140px] flex-shrink-0 flex-col items-center justify-between rounded-3xl bg-black p-2 lg:p-4 text-offwhite shadow-xl"
						>
							<div></div>
							<div
								class="flex w-16 h-16 lg:h-20 lg:w-20 flex-shrink-0 items-center justify-center rounded-full fill-offwhite/90 dark:fill-white p-1 shadow-inner"
							>
								{@html module.icon}
							</div>
							<div class="relative">
								{#if module.delayed}
									<div
										class="absolute right-4 top-0.5 -translate-y-full translate-x-full transform rounded-full bg-red-500 px-2 py-0.5 text-xs"
									>
										{locale == 'en' ? 'soon' : 'bald'}
									</div>
								{/if}
								<span class="text-[10px] md:text-xs dark:text-white">
									{module.heading}
								</span>
							</div>
						</div>
					</div>
			{/each}
		</div>
	</div>
</div>
