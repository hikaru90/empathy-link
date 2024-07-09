<script lang="ts">
	import { t, locale } from '$lib/translations';
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

	$: tableRows = [
		{
			icon: IconEye,
			color: 'observation',
			type: 'text',
			content: $t('default.page.home.components.feedback.steps.observation')
		},
		{
			icon: IconHeart,
			color: 'feelings',
			type: 'array',
			content: $t('default.page.home.components.feedback.steps.feelings')
		},
		{
			icon: IconSwirl,
			color: 'needs',
			type: 'array',
			content: $t('default.page.home.components.feedback.steps.needs')
		},
		{
			icon: IconSteps,
			color: 'request',
			type: 'text',
			content: $t('default.page.home.components.feedback.steps.request')
		}
	];

	let moduleName: string | undefined = undefined;
	locale.subscribe((value) => {
		moduleName = value === 'en' ? 'Module' : 'Modul';
	});
</script>

<div class="mb-40">
	<div class="flex flex-col items-start">
		<div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite p-1">
			<div
				class="flex items-center justify-center rounded-full bg-black fill-offwhite p-1.5 shadow-inner"
			>
				{@html IconLearn}
			</div>
		</div>
		<div class="mb-3 ml-0.5 text-slate-500">
			4. {moduleName}
		</div>
		<div class="relative">
			<h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">
				{$t('default.page.home.components.learn.heading')}
			</h2>
			<div class="bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full">
				{$t('default.menu.soon')}
			</div>
		</div>
		<p class="max-w-md mb-8">
			{$t('default.page.home.components.learn.description')}
		</p>
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
