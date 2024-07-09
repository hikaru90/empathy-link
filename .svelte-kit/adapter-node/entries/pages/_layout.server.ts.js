import { l as loadTranslations } from "../../chunks/translations.js";
const load = async ({ url, locals }) => {
  await loadTranslations(locals.locale, url.pathname);
  console.log("layout.server.ts values - locals:", locals);
  console.log("layout.server.ts values - user:", locals.user);
  return {
    url: url.pathname,
    user: locals.user,
    locale: locals.locale
  };
};
export {
  load
};
