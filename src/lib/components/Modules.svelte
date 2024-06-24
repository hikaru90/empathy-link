<script lang="ts">
	import { t, locale } from '$lib/translations';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';

	interface Card {
		heading: string;
		icon: string;
		text: string;
	}

	$: modules = [
		{
			heading: $t('default.page.home.components.modules.modules.selfempathy'),
			icon: IconSelf,
			delayed: false,
		},
		{
			heading: $t('default.page.home.components.modules.modules.fight'),
			icon: IconFight,
			delayed: false,
		},
		{
			heading: $t('default.page.home.components.modules.modules.feedback'),
			icon: IconFeedback,
			delayed: true,
		},
		{
			heading: $t('default.page.home.components.modules.modules.learn'),
			icon: IconLearn,
			delayed: true,
		}
	];
</script>

<div class="flex flex-col items-center mb-40">
	<h2 class="mb-20 max-w-[19em] text-center font-display text-2xl font-semibold lg:text-4xl">
		{$t('default.page.home.components.modules.heading')}
	</h2>
	<div class="relative">
		<div class="flex flex-col md:flex-row gap-4">
			{#each modules as module}
			<div class="group flex items-center justify-center rounded-[36px] bg-white p-6 relative shadow-xl text-sm">
					<div class="group-last:hidden absolute w-4 h-1 bg-black/90 left-full top-1/2 transform -translate-y-1/2"></div>
					<div class="bg-black flex flex-col items-center justify-between rounded-3xl text-offwhite p-4 w-36 h-36 shadow-xl">
						<div></div>
						<div
							class="fill-offwhite/90 flex items-center justify-center rounded-full p-1 shadow-inner w-20 h-20 flex-shrink-0"
						>
							{@html module.icon}
						</div>
						<div class="relative">
							{#if module.delayed}
							<div class="absolute bg-red-500 px-2 py-0.5 rounded-full top-0.5 right-4 transform -translate-y-full translate-x-full text-xs">
								{ $locale == 'en' ? 'soon':'bald' }
							</div>
							{/if}
							{module.heading}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
