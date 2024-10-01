import { e as subscribe } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, v as validate_component, e as escape, a as add_attribute } from './ssr-C1fln0Kh.js';
import { M as Menu, F as Form_button } from './form-button-BzQ8gJxz.js';
import { F as Form_field, C as Control, a as Form_label, I as Input, b as Form_field_errors } from './index4-BP61vT3j.js';
import { f as formSchema } from './schema-Dsp_ezMk.js';
import './client-BGiBm9n9.js';
import { s as superForm } from './memoize-B28xu6JT.js';
import './index-DHSpIlkf.js';
import { a as zodClient } from './zod-Bj0F2ims.js';
import { t as t2 } from './translations-BF87NCsX.js';
import { a as toast } from './Toaster.svelte_svelte_type_style_lang-B9JrK1jS.js';
import './Avatar.svelte_svelte_type_style_lang-Ckc79-rv.js';
import { B as Button } from './button-ntMztHI_.js';
import './lifecycle-Dr9vL0LE.js';
import './page-C8qygIqX.js';
import './index2-BL47qDlJ.js';
import 'tailwind-variants';
import './ssr2-BVSPLo1E.js';
import 'clsx';
import './Avatar-CzXgJnME.js';
import './sheet-header-DyTUoQcr.js';
import './SparklePill-pUbgiSQ9.js';
import './utils2-CW1DFYkq.js';
import 'tailwind-merge';
import './scheduler-Be-hqvXf.js';
import './helpers-BXrFvLoV.js';
import './auth-CaZN_opl.js';
import './index-BibYS5cI.js';
import './stores-DfFLgiwW.js';
import './stringify-DX2pbVR5.js';

const RegisterForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  let $formData, $$unsubscribe_formData;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  let { class: className = void 0 } = $$props;
  let { data } = $$props;
  const form = superForm(data, {
    resetForm: false,
    validators: zodClient(formSchema),
    onResult: ({ result }) => {
      console.log("result", result);
      if (result.type === "failure")
        toast.error($t("default.page.register.toasts.error"));
      if (result.type === "success") {
        toast.success($t("default.page.register.toasts.success"));
      }
    }
  });
  const { form: formData, errors, enhance, delayed, message, constraints, reset } = form;
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
  console.log("form", form);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = ` <form method="POST"${add_attribute("class", className, 0)}>${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "email" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, {}, {}, {
              default: () => {
                return `${escape($t("default.page.register.form.email.label"))}`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              Object.assign({}, attrs, { type: "email" }, { value: $formData.email }),
              {
                value: ($$value) => {
                  $formData.email = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })} ${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "password" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, {}, {}, {
              default: () => {
                return `${escape($t("default.page.register.form.password.label"))}`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              Object.assign({}, attrs, { type: "password" }, { value: $formData.password }),
              {
                value: ($$value) => {
                  $formData.password = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })} <div class="flex items-center justify-between">${validate_component(Button, "Button").$$render($$result, { variant: "ghost" }, {}, {
      default: () => {
        return `${escape($t("default.page.login.cta"))}`;
      }
    })} ${validate_component(Form_button, "Form.Button").$$render($$result, {}, {}, {
      default: () => {
        return `${escape($t("default.page.register.cta"))}`;
      }
    })}</div></form>`;
  } while (!$$settled);
  $$unsubscribe_t();
  $$unsubscribe_formData();
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  let { data } = $$props;
  console.log("login page");
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_t();
  return `<div class="flex h-full flex-grow flex-col justify-between"><div class="flex-grow">${validate_component(Menu, "Menu").$$render($$result, {}, {}, {})} <div class="max-container relative"><div class="w-full flex flex-col items-center justify-center py-32"><h1 class="font-heading font-bold text-2xl">${escape($t("default.page.register.heading"))}</h1> ${validate_component(RegisterForm, "RegisterForm").$$render($$result, { data: data.form, class: "w-[400px]" }, {}, {})}</div></div></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-N9nbYxZy.js.map
