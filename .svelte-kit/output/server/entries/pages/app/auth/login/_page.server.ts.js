import { f as fail, r as redirect } from "../../../../../chunks/index.js";
import "../../../../../chunks/client.js";
import "ts-deepmerge";
import "../../../../../chunks/formData.js";
import { s as superValidate } from "../../../../../chunks/superValidate.js";
import "memoize-weak";
import { a as zod } from "../../../../../chunks/zod.js";
import { f as formSchema } from "../../../../../chunks/schema.js";
import { u as user } from "../../../../../chunks/auth.js";
const redirectToFightOrDashboard = (cookies) => {
  const loginRedirectTarget = cookies.get("loginRedirectTarget");
  if (loginRedirectTarget) {
    throw redirect(302, loginRedirectTarget);
  } else {
    throw redirect(302, "/bullshift");
  }
};
const load = async ({ locals, cookies }) => {
  if (locals.user) {
    user.update((value) => locals.user);
    console.log("redirecting");
    redirectToFightOrDashboard(cookies);
  }
  return {
    form: await superValidate(zod(formSchema))
  };
};
const actions = {
  default: async (event) => {
    try {
      console.log("action");
      const form = await superValidate(event, zod(formSchema));
      if (!form.valid) {
        return fail(400, {
          form
        });
      }
      try {
        await event.locals.pb.collection("users").authWithPassword(form.data.email, form.data.password);
        if (!event.locals.pb?.authStore?.model?.verified) {
          event.locals.pb.authStore.clear();
          console.log("user not verified");
          return fail(400, {
            form
          });
        }
      } catch (err) {
        console.log("error in form", err);
        return fail(400, {
          form
        });
      }
      redirectToFightOrDashboard(event.cookies);
      return { form };
    } catch (err) {
      console.log("error in login action", err);
    }
  }
};
export {
  actions,
  load
};
