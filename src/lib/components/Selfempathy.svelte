<script lang="ts">
	import { m } from '$lib/translations';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';
	import PhoneMockup from '$lib/components/PhoneMockup.svelte';
	import { getLocale } from '$src/paraglide/runtime';
	const locale = $derived(getLocale());

	let moduleName: string | undefined = $state(undefined);

	$effect(() => {
		moduleName = locale === 'en' ? 'Module' : 'Modul';
	});
</script>

<div class="mb-40 flex flex-col items-center justify-center gap-16 md:gap-20 lg:flex-row">
	<div class="flex flex-col items-center justify-center xl:items-start">
		<div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite p-1 dark:bg-muted">
			<div
				class="flex items-center justify-center rounded-full bg-black fill-offwhite p-1.5 shadow-inner dark:fill-neon"
			>
				{@html IconSelf}
			</div>
		</div>
		<div class="mb-3 ml-0.5 text-black/60 dark:text-white/80">
			1. {moduleName}
		</div>
		<h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">
			{m.page_home_components_selfempathy_heading()}
		</h2>
		<p class="max-w-md">
			{m.page_home_components_selfempathy_description()}
		</p>
	</div>
	<div class="relative flex">
		<PhoneMockup
			mockup="screenshot-fight2.png"
			color="bg-[#618BFF]"
			inverted
			class="w-50 md:w-72"
		/>
		<PhoneMockup
			mockup="screenshot-dashboard.png"
			color="bg-[#D7D5D1]"
			class="w-50 -ml-36 md:w-72"
		/>
	</div>
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
