import './translations-BkqIZgNA.js';
import { s as serializeNonPOJOs } from './helpers-CZwe_-RP.js';
import { p as pb } from './pocketbase-jOic377y.js';
import './index2-DDd9jZNR.js';
import './exports-DdwBo3bR.js';

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
  console.log("hooks server handle response", response);
  return response;
};

export { handle };
//# sourceMappingURL=hooks.server-D56YgZic.js.map
