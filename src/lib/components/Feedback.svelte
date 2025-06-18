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
			content: m.page_home_components_feedback_steps_observation()
		},
		{
			icon: IconHeart,
			color: 'feelings',
			type: 'array',
			content: m.page_home_components_feedback_steps_feelings()
		},
		{
			icon: IconSwirl,
			color: 'needs',
			type: 'array',
			content: m.page_home_components_feedback_steps_needs()
		},
		{
			icon: IconSteps,
			color: 'request',
			type: 'text',
			content: m.page_home_components_feedback_steps_request()
		}
	]);

	let moduleName: string | undefined = $state(undefined);
	$effect(() => {
		moduleName = locale === 'en' ? 'Module' : 'Modul';
	});

</script>

<div class="mb-40">
	<div class="flex flex-col items-center">
		<div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1">
			<div
				class="flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner"
			>
				{@html IconFeedback}
			</div>
		</div>
		<div class="mb-3 ml-0.5 text-black/60 dark:text-white/80">
			3. {moduleName}
		</div>
		<div class="relative">
			<h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">
				{m.page_home_components_feedback_heading()}
			</h2>
			<div class="bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full">
				{m.menu_soon()}
			</div>
		</div>
		<p class="max-w-md text-center mb-8">
			{m.page_home_components_feedback_description()}
		</p>
	</div>

	<div class="relative flex flex-row flex-wrap justify-center items-stretch -mx-3">
		{#each tableRows as card}
			<div class="group mx-4 md:mx-0 relative p-3 text-sm w-full md:w-1/4 md:max-w-[460px]">
				<div
					class="absolute left-full -ml-3 top-1/2 hidden h-1 w-6 -translate-y-1/2 transform bg-black/90 dark:bg-neon md:block group-last:md:hidden"
				></div>

				<div class="group relative h-full shadow-xl p-6 bg-muted rounded-3xl hyphens-auto">
					<div>
						<div class="skeumorphic-button mb-8 h-9 w-9 rounded-full bg-offwhite p-0.5">
							<div
								class="bg-{card.color}-background fill-{card.color}-foreground flex items-center justify-center rounded-full p-1 shadow-inner"
							>
								{@html card.icon}
							</div>
						</div>
					</div>
					<div class="flex">
						<p class="">
							{card.content}
						</p>
					</div>
				</div>
			</div>
		{/each}
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
