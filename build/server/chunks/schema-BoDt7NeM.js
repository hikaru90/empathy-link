import { z } from './index-BgK6iorh.js';
import { a as locale, t as t2 } from './translations-CjpxX11l.js';
import { g as get_store_value } from './exports-BRB0bLON.js';

console.log("locale", get_store_value(locale));
const formSchema = z.object({
  email: z.string().email({ message: get_store_value(t2)("default.page.login.form.email.validEmailError") }),
  password: z.string().min(6, { message: get_store_value(t2)("default.page.login.form.password.tooShortError") }).max(30, { message: get_store_value(t2)("default.page.login.form.password.tooLongError") })
});

export { formSchema as f };
//# sourceMappingURL=schema-BoDt7NeM.js.map
