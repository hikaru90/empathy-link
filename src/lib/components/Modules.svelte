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
			icon: IconSelf
		},
		{
			heading: $t('default.page.home.components.modules.modules.fight'),
			icon: IconFight
		},
		{
			heading: $t('default.page.home.components.modules.modules.feedback'),
			icon: IconFeedback
		},
		{
			heading: $t('default.page.home.components.modules.modules.learn'),
			icon: IconLearn
		}
	];
</script>

<div class="flex flex-col items-center">
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
						{module.heading}
					</div>
				</div>
			{/each}
		</div>
	</div>
	<!-- <div class="relative mb-20">
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <img src="/connector.svg" alt="connector" class="w-28">
    </div>
		<div class="-m-4 flex flex-wrap items-stretch justify-center">
			{#each modules as module}
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
									class="bg-{module.backgroundColor} fill-{module.color} flex items-center justify-center rounded-full p-1 shadow-inner"
								>
									{@html module.icon}
								</div>
							</div>
							<h3 class="mb-3 font-display text-xl font-semibold md:text-2xl">
								{module.heading}
							</h3>
						</div>
						<div class="flex">
							<p class="">
								{module.text}
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
	</div> -->
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
