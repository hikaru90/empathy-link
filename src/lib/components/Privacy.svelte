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
	
	import GlobeLock from 'lucide-svelte/icons/globe-lock'
	import Lock from 'lucide-svelte/icons/lock'
	import ShieldCheck from 'lucide-svelte/icons/shield-check'
	import DoorClosedLocked from 'lucide-svelte/icons/door-closed-locked'


	const locale = $derived(getLocale());

	let tableRows = $derived([
		{
			icon: Lock,
			color: 'forest',
			type: 'text',
			content: m.page_home_components_privacy_usps_1(),
			content2: m.page_home_components_privacy_usps_1_text(),
		},
		{
			icon: DoorClosedLocked,
			color: 'lilac',
			type: 'array',
			content: m.page_home_components_privacy_usps_2(),
			content2: m.page_home_components_privacy_usps_2_text(),
		},
		{
			icon: GlobeLock,
			color: 'cream',
			type: 'array',
			content: m.page_home_components_privacy_usps_3(),
			content2: m.page_home_components_privacy_usps_3_text(),
		},
		{
			icon: ShieldCheck,
			color: 'request',
			type: 'text',
			content: m.page_home_components_privacy_usps_4(),
			content2: m.page_home_components_privacy_usps_4_text(),
		}
	]);

	let moduleName: string | undefined = $state(undefined);
	$effect(() => {
		moduleName = locale === 'en' ? 'Module' : 'Modul';
	});

</script>

<div class="mb-40 relative overflow-visible">
	<div use:checkVisibility class="opacity-0 scale-0 is-visible:opacity-[0.3] is-visible:scale-100 size-[2000px] absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 transition-all duration-1000 delay-500" style="background: radial-gradient(circle, yellow 0%, transparent 60%);">
	</div>
	<div class="flex flex-col items-center">
		<div class="relative">
			<h2 use:checkVisibility class="transform opacity-0 translate-y-10 is-visible:translate-y-0 is-visible:opacity-100 transition-all duration-700 mb-8 font-display text-2xl font-semibold lg:text-4xl max-w-[13em] text-center">
				{m.page_home_components_privacy_heading()}
			</h2>
			<!-- <div class="bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full">
				{m.menu_soon()}
			</div> -->
		</div>
		<p class="max-w-md text-center mb-8">
			{m.page_home_components_privacy_description()}
		</p>
	</div>

	<div class="relative flex flex-row flex-wrap justify-center items-stretch -mx-3">
		{#each tableRows as card, index}
			<div use:checkVisibility class="transform opacity-0 scale-75 is-visible:scale-100 is-visible:opacity-100 transition-all duration-[250ms] group mx-4 md:mx-0 relative p-3 w-full md:w-1/4 md:max-w-[460px]" style="transition-delay: {(index +1) * 100}ms;">
				<div use:checkVisibility class="transform opacity-0 is-visible:opacity-100 transition-all duration-[250ms] absolute left-full -ml-3 top-1/2 hidden h-1 w-6 -translate-y-1/2 bg-black/90 dark:bg-neon md:block group-last:md:hidden" style="transition-delay: {(index +1) * 200}ms;"
				></div>

				<div class="group relative h-full shadow-xl p-6 bg-muted rounded-3xl hyphens-auto">
					<div>
						<div class="skeumorphic-button mb-8 size-10 rounded-full bg-offwhite p-0.5">
							<div
								class="bg-emerald-900/70 flex items-center justify-center rounded-full p-1 shadow-inner size-9"
							>
								<card.icon class="size-5 text-green-400" />
							</div>
						</div>
					</div>
					<div class="flex flex-col">
						<div class="font-bold">{card.content}</div>
						<p class="">
							{card.content2}
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
