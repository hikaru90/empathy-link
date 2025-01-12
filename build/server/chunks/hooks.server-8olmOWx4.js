import './translations-BMzuJwzR.js';
import { v4 } from 'uuid';
import { s as serializeNonPOJOs } from './helpers-CTGollho.js';
import { p as pb } from './pocketbase-jOic377y.js';
import { P as PUBLIC_POSTHOG_KEY } from './public-BUxYvT-o.js';
import './index2-BL47qDlJ.js';
import './exports-CLG2BRq1.js';

const client = "empathy_link";
const handle = async ({ event, resolve }) => {
  let sessionToken = event.cookies.get(`${client}_session_id`);
  let posthogUserId = event.cookies.get(`${client}_user_id`);
  if (!sessionToken) {
    sessionToken = v4();
    event.cookies.set(`${client}_session_id`, sessionToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7
      // 1 week
    });
  }
  if (!posthogUserId) {
    posthogUserId = v4();
    event.cookies.set(`${client}_user_id`, posthogUserId, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7 * 52
      // 1 year
    });
  }
  let phCookie = event.cookies.get(`ph_${PUBLIC_POSTHOG_KEY}_posthog`);
  phCookie = phCookie ? JSON.parse(phCookie) : null;
  const posthogId = phCookie ? phCookie.distinct_id : posthogUserId;
  event.locals.posthogId = posthogId;
  event.locals.sessionToken = sessionToken;
  event.locals.userId = posthogUserId;
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

export { handle };
//# sourceMappingURL=hooks.server-8olmOWx4.js.map
