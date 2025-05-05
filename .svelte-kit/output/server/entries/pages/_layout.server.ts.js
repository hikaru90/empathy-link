import { a as loadTranslations } from "../../chunks/translations.js";
const load = async ({ fetch, url, locals }) => {
  await loadTranslations(locals.locale, url.pathname);
  return {
    url: url.pathname,
    user: locals.user,
    locale: locals.locale,
    sessionToken: locals.sessionToken,
    userId: locals.userId
    // posthogId: locals.posthogId,
    // featureFlags: postHogApi.featureFlags || {}
  };
};
export {
  load
};
