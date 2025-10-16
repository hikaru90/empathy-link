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
	import { checkVisibility } from '$lib/actions';
	import { marked } from 'marked';

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
	<div class="flex flex-col items-center text-center lg:items-start lg:text-left md:flex-row">
		<div class="relative">
			<h2
				use:checkVisibility
				class="mb-8 translate-y-10 transform font-display text-2xl font-semibold opacity-0 transition-all duration-700 is-visible:translate-y-0 is-visible:opacity-100 lg:text-4xl"
			>
				{m.page_home_components_about_heading()}
			</h2>
			<div class="max-w-[40em]">
				<div use:checkVisibility class="opacity-0 is-visible:opacity-100 transition-opacity duration-700">
					{m.page_home_components_about_text1()}
				</div>
				<div use:checkVisibility class="delay-100 opacity-0 is-visible:opacity-100 transition-opacity duration-700 mb-4">
					{m.page_home_components_about_text2()}
				</div>
				<div use:checkVisibility class="delay-200 opacity-0 is-visible:opacity-100 transition-opacity duration-700 mb-4">
					{m.page_home_components_about_text3()}
				</div>
				<div use:checkVisibility class="delay-300 opacity-0 is-visible:opacity-100 transition-opacity duration-700">
					{@html marked(m.page_home_components_about_text4())}
				</div>
			</div>
		</div>
		<div use:checkVisibility class="delay-400 opacity-0 is-visible:opacity-100 transition-all scale-0 is-visible:scale-100 duration-700 relative -mt-10">
			<img src="/AlexMarie.png" alt="Alex und Marie" class="w-[350px]" />
		</div>
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
