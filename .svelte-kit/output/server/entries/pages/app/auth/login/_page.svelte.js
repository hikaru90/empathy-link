import { c as compute_rest_props, s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, s as spread, h as escape_object, a as add_attribute, v as validate_component, e as escape } from "../../../../../chunks/ssr.js";
import { F as Form_button, M as Menu } from "../../../../../chunks/form-button.js";
import { g as getFormField, a as generateId, b as getDataFsError, F as Form_field, C as Control, c as Form_label, I as Input, d as Form_field_errors } from "../../../../../chunks/index8.js";
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
import { R as Root, D as Dialog_content, a as Dialog_header, b as Dialog_title, c as Dialog_description } from "../../../../../chunks/index9.js";
import "../../../../../chunks/pocketbase.js";
import { c as cn } from "../../../../../chunks/index3.js";
import { B as Button } from "../../../../../chunks/button.js";
import { C as Check } from "../../../../../chunks/Check.js";
import { p as page } from "../../../../../chunks/stores.js";
const Description = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let descriptionAttrs;
  let $$restProps = compute_rest_props($$props, ["id", "asChild", "el"]);
  let $errors, $$unsubscribe_errors;
  let $descriptionId, $$unsubscribe_descriptionId;
  const { descriptionId, errors } = getFormField();
  $$unsubscribe_descriptionId = subscribe(descriptionId, (value) => $descriptionId = value);
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  let { id = generateId() } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    descriptionId.set(id);
  }
  descriptionAttrs = {
    id: $descriptionId,
    "data-fs-error": getDataFsError($errors),
    "data-fs-description": "",
    ...$$restProps
  };
  $$unsubscribe_errors();
  $$unsubscribe_descriptionId();
  return ` ${asChild ? `${slots.default ? slots.default({ descriptionAttrs }) : ``}` : `<div${spread([escape_object(descriptionAttrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ descriptionAttrs }) : ``}</div>`}`;
});
const Form_description = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  return `${validate_component(Description, "FormPrimitive.Description").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-[0.8rem] text-muted-foreground", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ descriptionAttrs }) => {
        return `${slots.default ? slots.default({ descriptionAttrs }) : ``}`;
      }
    }
  )}`;
});
const LoginForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  let $formData, $$unsubscribe_formData;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { class: className = void 0 } = $$props;
  let { data } = $$props;
  let resetPassordDialogOpen = false;
  const form = superForm(data, {
    resetForm: false,
    validators: zodClient(formSchema),
    onResult: ({ result }) => {
      console.log("result", result);
      if (result.type === "failure") toast.error($t("default.page.login.toasts.error"));
      if (result.type === "success") {
        toast.success($t("default.page.login.toasts.success"));
      }
    }
  });
  const { form: formData, errors, enhance, delayed, message, constraints, reset } = form;
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
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
                return `${escape($t("default.page.login.form.email.label"))}`;
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
                return `${escape($t("default.page.login.form.password.label"))}`;
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
        })} ${validate_component(Form_description, "Form.Description").$$render($$result, {}, {}, {
          default: () => {
            return `<a role="button" tabindex="0" class="text-sm text-muted-foreground hover:underline">${escape($t("default.page.login.forgotPassword.question"))}</a>`;
          }
        })} ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })} <div class="flex items-center justify-between"><a href="/app/auth/register" class="text-sm hover:underline">${escape($t("default.page.login.switchToRegister"))}</a> ${validate_component(Form_button, "Form.Button").$$render(
      $$result,
      {
        type: "submit",
        class: "bg-primary text-muted"
      },
      {},
      {
        default: () => {
          return `${escape($t("default.page.login.cta"))}`;
        }
      }
    )}</div></form> ${validate_component(Root, "Dialog.Root").$$render(
      $$result,
      {
        preventScroll: false,
        open: resetPassordDialogOpen
      },
      {
        open: ($$value) => {
          resetPassordDialogOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Dialog_content, "Dialog.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Dialog_header, "Dialog.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Dialog_title, "Dialog.Title").$$render($$result, { class: "mb-10 leading-tight" }, {}, {
                    default: () => {
                      return `${escape($t("default.page.login.forgotPassword.heading"))}`;
                    }
                  })} ${validate_component(Dialog_description, "Dialog.Description").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape($t("default.page.login.forgotPassword.description"))} <div class="mt-4 flex justify-end">${validate_component(Button, "Button").$$render(
                        $$result,
                        {
                          class: "flex items-center gap-3 bg-muted-dark"
                        },
                        {},
                        {
                          default: () => {
                            return `${escape($t("default.page.login.forgotPassword.heading"))} ${validate_component(Check, "Check").$$render($$result, { class: "text-needs-background" }, {}, {})}`;
                          }
                        }
                      )}</div>`;
                    }
                  })}`;
                }
              })}`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_t();
  $$unsubscribe_formData();
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $t, $$unsubscribe_t;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let { data } = $$props;
  const verifyMail = $page.url.searchParams.get("verifyMail");
  console.log("verifyMail", verifyMail);
  console.log("login page");
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$unsubscribe_page();
  $$unsubscribe_t();
  return `<div class="flex h-full flex-grow flex-col justify-between"><div class="flex-grow">${validate_component(Menu, "Menu").$$render($$result, {}, {}, {})} <div class="max-container relative"><div class="w-full flex flex-col items-center justify-center py-32">${verifyMail ? `<div class="max-container relative"><div class="text-white">${escape($t("default.page.login.verifyMail"))}</div></div>` : ``} <h1 class="font-heading font-bold text-2xl">${escape($t("default.page.login.heading"))}</h1> ${validate_component(LoginForm, "LoginForm").$$render(
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
