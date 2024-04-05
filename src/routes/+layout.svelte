<script>
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { register, t, init, getLocaleFromNavigator, isLoading, locale } from 'svelte-i18n';

	register('de', () => import('../locales/de.json'));
	register('en', () => import('../locales/en.json'));

	init({
		fallbackLocale: 'en',
	});

	locale.set('de')
</script>

{#if $isLoading}
	Please wait...
{:else}
	<ModeWatcher />
	<slot />
{/if}
