import { f as fail, r as redirect } from "../../../../../chunks/index.js";
import "../../../../../chunks/client.js";
import "../../../../../chunks/memoize.js";
import { s as superValidate, a as setError } from "../../../../../chunks/superValidate.js";
import { a as zod } from "../../../../../chunks/zod.js";
import { z } from "zod";
import { l as locale, t } from "../../../../../chunks/translations.js";
import { g as get_store_value } from "../../../../../chunks/utils.js";
console.log("locale", get_store_value(locale));
const formSchema = z.object({
  firstName: z.string().min(3, { message: get_store_value(t)("default.page.login.form.firstname.tooShortError") }).max(30, { message: get_store_value(t)("default.page.login.form.firstname.tooLongError") }),
  lastName: z.string().min(3, { message: get_store_value(t)("default.page.login.form.lastname.tooShortError") }).max(30, { message: get_store_value(t)("default.page.login.form.lastname.tooLongError") }),
  email: z.string().email({ message: get_store_value(t)("default.page.login.form.email.validEmailError") }),
  password: z.string().min(6, { message: get_store_value(t)("default.page.login.form.password.tooShortError") }).max(30, { message: get_store_value(t)("default.page.login.form.password.tooLongError") })
});
const load = async ({ locals }) => {
  return {
    form: await superValidate(zod(formSchema))
  };
};
const actions = {
  default: async (event) => {
    console.log("action");
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }
    try {
      const existingUser = await event.locals.pb.collection("users").getFirstListItem(`email="${form.data.email}"`);
      if (existingUser) {
        return setError(form, "email", "A user with this email already exists");
      }
    } catch (err) {
      if (err.status !== 404) {
        console.error("Error checking for existing user:", err);
        return fail(500, { form });
      }
    }
    try {
      const formData = {
        firstName: form.data.firstName,
        lastName: form.data.lastName,
        email: form.data.email,
        password: form.data.password,
        passwordConfirm: form.data.password,
        emailVisibility: true
      };
      console.log("formData", formData);
      const creationResult = await event.locals.pb.collection("users").create(formData);
      console.log("creationResult", creationResult);
      await event.locals.pb.collection("users").requestVerification(String(form.data.email));
    } catch (err) {
      console.log("error in register form", err);
      return fail(500, {
        form
      });
    }
    redirect(302, "/app/auth/login?verifyMail=true");
    return { form };
  }
};
export {
  actions,
  load
};
