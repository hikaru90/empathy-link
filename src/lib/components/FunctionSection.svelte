<script lang="ts">
	import { m } from '$lib/translations';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';
	import PhoneMockup from '$lib/components/PhoneMockup.svelte';
	import { getLocale } from '$src/paraglide/runtime';
	import GradientImage from '$lib/components/GradientImage.svelte';
	import { checkVisibility } from '$lib/actions';

	const locale = $derived(getLocale());

	let moduleName: string | undefined = $state(undefined);

	$effect(() => {
		moduleName = locale === 'en' ? 'Module' : 'Modul';
	});

	let usps = $derived([
		{
			heading: m.page_home_components_selfempathy_usp1_heading(),
			description: m.page_home_components_selfempathy_usp1_description()
		},
		{
			heading: m.page_home_components_selfempathy_usp2_heading(),
			description: m.page_home_components_selfempathy_usp2_description()
		},
		{
			heading: m.page_home_components_selfempathy_usp3_heading(),
			description: m.page_home_components_selfempathy_usp3_description()
		}
	]);
</script>

<div class="relative overflow-visible">
	<div use:checkVisibility class="opacity-0 scale-0 is-visible:opacity-25 is-visible:scale-100 transition-all duration-700 delay-500 size-[2000px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 z-0" style="background: radial-gradient(circle, #FF9C34 0%, transparent 60%);">
	</div>

<div class="flex items-center justify-center relative z-10">
	<h2 use:checkVisibility class="transform opacity-0 translate-y-10 is-visible:translate-y-0 is-visible:opacity-100 transition-all duration-700 font-display text-4xl font-semibold lg:text-5xl mb-10 md:mb-20 max-w-[13em] md:text-center">
		{m.page_home_components_selfempathy_heading()}
	</h2>
</div>
<div class="mb-24 md:mb-40 flex flex-col items-center justify-center gap-16 md:gap-20 lg:flex-row">
	<div class="flex flex-col items-start justify-center gap-6">
		
		<p class="max-w-md z-10">
			{m.page_home_components_selfempathy_description()}
		</p>
		<div class="flex flex-col items-start justify-center gap-4">
			{#each new Array(3) as cta, index}
			<div class="flex gap-4">
				<!-- <GradientImage class="mt-1 w-7 h-3.5 rounded-full shadow-md" /> -->
				<div use:checkVisibility class="transform opacity-0 is-visible:translate-x-0 is-visible:opacity-100 transition-all duration-700 {index % 2 === 0 ? 'md:-ml-4 md:translate-x-10':'md:ml-4 md:-translate-x-10'} bg-white/90 py-5 px-6 rounded-xl border border-white flex flex-col gap-6 md:gap-2 brigthness-110">
					<h3 class="font-bold">
						{usps[index].heading}
					</h3>
					<p class="max-w-md">
						{usps[index].description}
					</p>
				</div>
			</div>
			{/each}
		</div>
	</div>
	<div class="relative flex z-10 -ml-10">
		<div use:checkVisibility class="transform opacity-0 translate-x-1/3 is-visible:translate-x-10 is-visible:opacity-100 transition-all duration-700 -rotate-3">
			<PhoneMockup
			mockup="screenshot-fight2-2.png"
			color="bg-background"
			class="w-56 md:w-60"
			/>
		</div>
		<div use:checkVisibility class="transform -translate-x-1/3 is-visible:translate-x-0 transition-all duration-700 rotate-6">
			<PhoneMockup
			mockup="screenshot-dashboard-2.png"
			color="bg-background"
			class="w-56 -ml-36 md:w-60"
			/>
		</div>
	</div>
</div>
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
