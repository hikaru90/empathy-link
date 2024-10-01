import "./translations.js";
import { c as serializeNonPOJOs } from "./helpers.js";
import { p as pb } from "./pocketbase.js";
const handle = async ({ event, resolve }) => {
  console.log("hooks server handle");
  const localeCookie = event.cookies.get("locale");
  const langHeaders = event.request.headers.get("accept-language")?.split(",")[0].split("-")[0];
  console.log("hooks:localeCookie", localeCookie);
  if (localeCookie) {
    event.locals.locale = localeCookie;
  } else if (langHeaders) {
    event.locals.locale = langHeaders;
  }
  event.locals.pb = pb;
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");
  if (event.locals.pb.authStore.isValid) {
    event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
  } else {
    event.locals.user = void 0;
  }
  const response = await resolve(event);
  response.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: false }));
  return response;
};
export {
  handle
};
