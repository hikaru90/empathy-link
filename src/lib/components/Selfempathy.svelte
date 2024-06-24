<script lang="ts">
	import { t, locale } from '$lib/translations';
	import IconSelf from '$assets/icons/icon-self.svg?raw';
	import IconFight from '$assets/icons/icon-fight.svg?raw';
	import IconFeedback from '$assets/icons/icon-feedback.svg?raw';
	import IconLearn from '$assets/icons/icon-learn.svg?raw';

</script>

<div class="flex flex-col lg:flex-row items-start mb-40">
	<div class="">
		<div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite p-1">
			<div
				class="bg-black fill-offwhite flex items-center justify-center rounded-full p-1.5 shadow-inner"
			>
			{@html IconSelf}
			</div>
		</div>
		<div class="text-slate-500 mb-3 ml-0.5">
			1. { $locale = 'en' ? 'Module' : 'Modul'}
		</div>
		<h2 class="font-display text-2xl font-semibold lg:text-4xl mb-8">
			{$t('default.page.home.components.selfempathy.heading')}
		</h2>
		<p class="max-w-md">
			{$t('default.page.home.components.selfempathy.description')}
		</p>
	</div>
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
