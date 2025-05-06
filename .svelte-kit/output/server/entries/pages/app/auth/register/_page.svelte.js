import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, a as add_attribute, v as validate_component, e as escape } from "../../../../../chunks/ssr.js";
import { F as Form_button, M as Menu } from "../../../../../chunks/form-button.js";
import { F as Form_field, C as Control, c as Form_label, I as Input, d as Form_field_errors } from "../../../../../chunks/input.js";
import { f as formSchema } from "../../../../../chunks/schema.js";
import "../../../../../chunks/client.js";
import "ts-deepmerge";
import { s as superForm } from "../../../../../chunks/formData.js";
import "../../../../../chunks/index.js";
import "memoize-weak";
import { z as zodClient } from "../../../../../chunks/zod.js";
import { t } from "../../../../../chunks/translations.js";
import { a as toast } from "../../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import "../../../../../chunks/index4.js";
const RegisterForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  let $formData, $$unsubscribe_formData;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { class: className = void 0 } = $$props;
  let { data } = $$props;
  const form = superForm(data, {
    resetForm: false,
    validators: zodClient(formSchema),
    onResult: ({ result }) => {
      console.log("result", result);
      if (result.type === "failure") toast.error($t("default.page.register.toasts.error"));
      if (result.type === "success") {
        toast.success($t("default.page.register.toasts.success"));
      }
    }
  });
  const { form: formData, errors, enhance, delayed, message, constraints, reset } = form;
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
  console.log("form", form);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = ` <form method="POST"${add_attribute("class", className, 0)}>${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "firstName" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, {}, {}, {
              default: () => {
                return `${escape($t("default.page.register.form.firstname.label"))}`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              Object.assign({}, attrs, { value: $formData.firstName }),
              {
                value: ($$value) => {
                  $formData.firstName = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })} ${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "lastName" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, {}, {}, {
              default: () => {
                return `${escape($t("default.page.register.form.lastname.label"))}`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              Object.assign({}, attrs, { value: $formData.lastName }),
              {
                value: ($$value) => {
                  $formData.lastName = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })} ${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "email" }, {}, {
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
    })} <div class="flex items-center justify-between"><a href="/app/auth/login" class="text-sm hover:underline">${escape($t("default.page.login.switchToLogin"))}</a> ${validate_component(Form_button, "Form.Button").$$render($$result, { class: "bg-primary text-muted" }, {}, {
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
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { data } = $$props;
  console.log("login page");
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_t();
  return `<div class="flex h-full flex-grow flex-col justify-between"><div class="flex-grow">${validate_component(Menu, "Menu").$$render($$result, {}, {}, {})} <div class="max-container relative"><div class="w-full flex flex-col items-center justify-center py-32"><h1 class="font-heading font-bold text-2xl mb-6">${escape($t("default.page.register.heading"))}</h1> ${validate_component(RegisterForm, "RegisterForm").$$render(
    $$result,
    {
      data: data.form,
      class: "w-full max-w-[400px]"
    },
    {},
    {}
  )}</div></div></div></div>`;
});
export {
  Page as default
};
