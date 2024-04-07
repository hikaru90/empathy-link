import i18n from 'sveltekit-i18n';
import lang from './lang.json';

/** @type {import('sveltekit-i18n').Config} */
const config = ({
  translations: {
    en: { lang },
    de: { lang },
  },
  loaders: [
    {
      locale: 'de',
      key: 'default',
      loader: async () => (
        await import('$locales/de.json')
      ).default,
    },
    {
      locale: 'en',
      key: 'default',
      // routes: ['/'], // you can use regexes as well!
      loader: async () => (
        await import('$locales/en.json')
      ).default,
    }
  ],
});

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
loading.subscribe(($loading) => $loading && console.log('Loading translations for the main instance...'));