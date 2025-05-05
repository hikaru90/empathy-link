import { a as loadTranslations } from "../../../chunks/translations.js";
import { u as user } from "../../../chunks/auth.js";
const load = async ({ url, data }) => {
  await loadTranslations(data.locale, url.pathname);
  if (data.user) user.set(data.user);
  else user.set(void 0);
  return {
    locale: data.locale,
    route: url.pathname,
    user: data.user
  };
};
export {
  load
};
