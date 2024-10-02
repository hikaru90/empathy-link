<script lang="ts">
	import { t, locale } from '$lib/translations';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';
	import PhoneMockup from '$lib/components/PhoneMockup.svelte'

	let moduleName:string|undefined = undefined
  locale.subscribe((value) => {
		moduleName = value === 'en' ? 'Module' : 'Modul'
	});

</script>

<div class="flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-20 mb-40">
	<div class="flex flex-col items-center justify-center">
		<div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite p-1">
			<div
				class="bg-black fill-offwhite flex items-center justify-center rounded-full p-1.5 shadow-inner"
			>
			{@html IconSelf}
			</div>
		</div>
		<div class="text-black/60 mb-3 ml-0.5">
			1. { moduleName}
		</div>
		<h2 class="font-display text-2xl font-semibold lg:text-4xl mb-8">
			{$t('default.page.home.components.selfempathy.heading')}
		</h2>
		<p class="max-w-md">
			{$t('default.page.home.components.selfempathy.description')}
		</p>
	</div>
	<div class="relative flex">
		<PhoneMockup mockup="screenshot-fight2.png" color="bg-observation-background" inverted class="w-50 md:w-72" />
		<PhoneMockup mockup="screenshot-dashboard.png" color="bg-offwhite" class="w-50 md:w-72 -ml-36" />
	</div>
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
