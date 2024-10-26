import { a as loadTranslations } from "../../chunks/translations.js";
const load = async ({ fetch, url, locals }) => {
  const postHogApi = await fetch(`/api/posthog/decide`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId: locals.posthogId })
  }).then((r) => r.json());
  await loadTranslations(locals.locale, url.pathname);
  return {
    url: url.pathname,
    user: locals.user,
    locale: locals.locale,
    sessionToken: locals.sessionToken,
    userId: locals.userId,
    posthogId: locals.posthogId,
    featureFlags: postHogApi.featureFlags || {}
  };
};
export {
  load
};
