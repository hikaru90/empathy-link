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
	<div class="flex flex-col items-center lg:items-start text-center lg:text-left">
		<div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1">
			<div
				class="flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner"
			>
				{@html IconLearn}
			</div>
		</div>
		<div class="mb-3 ml-0.5 text-black/60 dark:text-white/80">
			4. {moduleName}
		</div>
		<div class="relative">
			<h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">
				{m.page_home_components_learn_heading()}
			</h2>
			<div class="bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full">
				{m.menu_soon()}
			</div>
		</div>
		<p class="max-w-md mb-8">
			{m.page_home_components_learn_description()}
		</p>
	</div>

</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}

	:global(.card-root) {
		box-shadow:
			-5px -5px 5px rgba(255, 255, 255, 0.9),
			5px 5px 5px rgba(0, 0, 0, 0.1);
	}
</style>
