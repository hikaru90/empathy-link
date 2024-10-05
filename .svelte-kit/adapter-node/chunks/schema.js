import { z } from "zod";
import { l as locale, t } from "./translations.js";
import { g as get_store_value } from "./utils.js";
console.log("locale", get_store_value(locale));
const formSchema = z.object({
  email: z.string().email({ message: get_store_value(t)("default.page.login.form.email.validEmailError") }),
  password: z.string().min(6, { message: get_store_value(t)("default.page.login.form.password.tooShortError") }).max(30, { message: get_store_value(t)("default.page.login.form.password.tooLongError") })
});
export {
  formSchema as f
};
