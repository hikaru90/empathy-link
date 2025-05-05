import "./translations.js";
import { v4 } from "uuid";
import { c as serializeNonPOJOs } from "./helpers.js";
import { p as pb } from "./pocketbase.js";
import { P as PUBLIC_POSTHOG_KEY } from "./public.js";
import "./auth.js";
import { r as redirect } from "./index.js";
import cron from "node-cron";
import { e as extractMemories } from "./tools.js";
const client = "empathy_link";
if (process.env.NODE_ENV === "production") {
  if (!globalThis.__cronStarted) {
    console.log("Starting cronjobs...");
    cron.schedule("*/0.1 * * * *", () => {
      console.log("Running scheduled task every 10 seconds");
      extractMemories();
    });
    globalThis.__cronStarted = true;
  }
}
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
  try {
    if (event.locals.pb.authStore.isValid) {
      await event.locals.pb.collection("users").authRefresh();
    }
    if (event.url.pathname.startsWith("/api")) {
      if (!event.locals.pb.authStore.isValid) {
        throw redirect(303, "/app/auth/login");
      }
    }
    event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
    const user = event.locals.pb.authStore.baseModel;
    const response = await resolve(event);
    response.headers.append("set-cookie", event.locals.pb.authStore.exportToCookie());
    return response;
  } catch (error) {
    event.locals.pb.authStore.clear();
    if (event.url.pathname.startsWith("/api")) {
      throw redirect(303, "/login");
    }
    const response = await resolve(event);
    response.headers.append("set-cookie", event.locals.pb.authStore.exportToCookie());
    return response;
  }
};
export {
  handle
};
