<script lang="ts">
	import { m } from '$lib/translations';
	import backgroundImage from '$assets/images/holo3.jpg';
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';
	import PhoneMockup from '$lib/components/PhoneMockup.svelte';
	import { getLocale } from '$src/paraglide/runtime';
	const locale = $derived(getLocale());
	
	let tableRows = $derived([
		{
			icon: IconEye,
			color: 'observation',
			type: 'text',
			content: m.page_home_components_fight_steps_observation()
		},
		{
			icon: IconHeart,
			color: 'feelings',
			type: 'array',
			content: m.page_home_components_fight_steps_feelings()
		},
		{
			icon: IconSwirl,
			color: 'needs',
			type: 'array',
			content: m.page_home_components_fight_steps_needs()
		},
		{
			icon: IconSteps,
			color: 'request',
			type: 'text',
			content: m.page_home_components_fight_steps_request()
		}
	]);

	let moduleName: string | undefined = $state(undefined);
	$effect(() => {
		moduleName = locale === 'en' ? 'Module' : 'Modul';
	});

</script>

<div class="mb-32">
	<div class="flex flex-col items-center">
		<div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1">
			<div
				class="flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner"
			>
				{@html IconFight}
			</div>
		</div>
		<div class="mb-3 ml-0.5 text-black/60 dark:text-white/80">
			2. {moduleName}
		</div>
		<h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">
			{m.page_home_components_fight_heading()}
		</h2>
	</div>

	<div
		class="relative flex flex-col items-center justify-start gap-4 lg:mt-24 lg:flex-row lg:items-stretch lg:justify-center lg:gap-10"
	>
		<div
			class="absolute left-1/2 top-[90px] hidden h-40 w-full -translate-x-1/2 -translate-y-full transform rounded-full border-4 border-black dark:border-neon lg:block"
		>
			<div class="absolute -top-[2px] left-1/2 hidden -translate-y-1/2 transform lg:block">
				<div class="h-4 w-4 rotate-45 transform border-b-4 border-l-4 border-black dark:border-neon"></div>
			</div>
		</div>
		<div class="relative z-0">
			<div class="absolute left-0 top-[88px] -ml-8 hidden -translate-y-1/2 transform lg:block">
				<div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div>
			</div>
			<!-- card -->
			<div class="m-4">
				<div class="relative w-full overflow-hidden rounded-lg shadow-xl shadow-black/5 md:w-52">
					{#each tableRows as row}
						<div
							class="group flex items-stretch border-b border-black/5 bg-white text-xs shadow-md last:border-b-0"
						>
							<div
								class="flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3"
							>
								<div class="label bg-{row.color}-background">
									<div class="icon fill-{row.color}-foreground">
										{@html row.icon}
									</div>
								</div>
							</div>
							<div class="flex-grow break-all px-3 pb-3 pt-4 dark:text-black">
								{row.content}
							</div>
						</div>
					{/each}
				</div>
				<p class="w-full py-4 md:w-52">
					Du notierst Deine Beobachtung, Gefühle, Bedürfnisse und Bitten
				</p>
			</div>
		</div>
		<div class="relative z-0">
			<div class="absolute left-0 top-[88px] -ml-8 hidden -translate-y-1/2 transform lg:block">
				<div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div>
			</div>
			<div class="absolute right-0 top-[88px] -mr-6 hidden -translate-y-1/2 transform lg:block">
				<div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div>
			</div>
			<!-- card -->
			<div class="m-4">
				<div
					style="background-image: url('{backgroundImage}'); background-size: 300% 100%"
					class={'shadow-black-5 flex h-[178.22px] w-full items-center justify-center rounded-lg bg-center bg-repeat-x shadow-xl md:w-52'}
				>
					<div class="h-8 w-20 rounded-full border-4 border-white"></div>
				</div>
				<p class="w-full py-4 md:w-52">
					Wir generieren einen Empathie-Link, den Du Deiner/m Streitpartner*in schickst
				</p>
			</div>
		</div>
		<div class="relative z-0">
			<div class="absolute right-0 top-[88px] -mr-6 hidden -translate-y-1/2 transform lg:block">
				<div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div>
			</div>
			<!-- card -->
			<div class="m-4">
				<div class="w-full overflow-hidden rounded-lg shadow-xl shadow-black/5 md:w-52">
					{#each tableRows as row}
						<div
							class="group flex items-stretch border-b border-black/5 bg-white text-xs shadow-md last:border-b-0"
						>
							<div
								class="flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3"
							>
								<div class="label bg-{row.color}-background">
									<div class="icon fill-{row.color}-foreground">
										{@html row.icon}
									</div>
								</div>
							</div>
							<div class="flex-grow break-all px-3 pb-3 pt-4 dark:text-black">
								{row.content}
							</div>
						</div>
					{/each}
				</div>
				<p class="w-full py-4 md:w-52">
					Dein/e Streitpartner*in kann sich in Ruhe mit Deiner Sicht der Dinge auseinandersetzen und
					antwortet dann
				</p>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
	.label {
		box-shadow: /*inset 0 0 4px rgba(0, 0, 0, 0.4),*/ -4px -4px 8px 0 rgba(white, 1);
		@apply relative h-5 w-5 flex-shrink-0 rounded-full border border-white;
	}
	.label:after {
		content: '';
		box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.4);
		@apply block h-full w-full rounded-full;
	}
	.icon {
		@apply absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 transform;
	}

	:global(.card-root) {
		box-shadow:
			-5px -5px 5px rgba(255, 255, 255, 0.9),
			5px 5px 5px rgba(0, 0, 0, 0.1);
	}

	.need {
		@apply relative z-10 inline;

		&:before {
			content: '';
			@apply absolute left-0 top-0 h-full w-full;
			z-index: -1; /* Ensure the background is behind the text */
		}
	}
</style>
