import { r as redirect, f as fail } from "../../../../chunks/index.js";
import "../../../../chunks/client.js";
import "../../../../chunks/memoize.js";
import { s as superValidate } from "../../../../chunks/superValidate.js";
import { a as zod } from "../../../../chunks/zod.js";
import { f as formSchema } from "../../../../chunks/schema.js";
import { u as user } from "../../../../chunks/auth.js";
const load = async ({ locals }) => {
  console.log("PageServerLoad");
  if (locals.user) {
    user.update((value) => locals.user);
    console.log("redirecting");
    throw redirect(303, "/dashboard");
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
      redirect(302, "/dashboard");
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
