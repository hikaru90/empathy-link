import { c as compute_rest_props, s as subscribe, n as noop } from "./utils.js";
import { c as create_ssr_component, s as spread, g as escape_attribute_value, h as escape_object, a as add_attribute, f as each, e as escape, v as validate_component } from "./ssr.js";
import { c as cn } from "./utils2.js";
import { L as Label } from "./Avatar.js";
import { w as writable } from "./index2.js";
import { h as hasContext, g as getContext, s as setContext } from "./lifecycle.js";
import { n as nanoid } from "./Avatar.svelte_svelte_type_style_lang.js";
import "clsx";
import "./page.js";
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value", "readonly"]);
  let { class: className = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { readonly = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly !== void 0)
    $$bindings.readonly(readonly);
  return `<input${spread(
    [
      {
        class: escape_attribute_value(cn("flex h-9 w-full rounded-md border border-input bg-black/5 dark:bg-black/20 border-black/10 dark:border-white/5 px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className))
      },
      { readonly: readonly || null },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("value", value, 0)}>`;
});
const FORM_FIELD = Symbol("FORM_FIELD_CTX");
function setFormField(props) {
  setContext(FORM_FIELD, props);
  return props;
}
function getFormField() {
  if (!hasContext(FORM_FIELD)) {
    ctxError("Form.Field");
  }
  return getContext(FORM_FIELD);
}
const FORM_CONTROL = Symbol("FORM_CONTROL_CTX");
function setFormControl(props) {
  setContext(FORM_CONTROL, props);
  return props;
}
function getFormControl() {
  if (!hasContext(FORM_CONTROL)) {
    ctxError("<Control />");
  }
  return getContext(FORM_CONTROL);
}
function ctxError(ctx) {
  throw new Error(`Unable to find \`${ctx}\` context. Did you forget to wrap the component in a \`${ctx}\`?`);
}
function getAriaDescribedBy({ fieldErrorsId = void 0, descriptionId = void 0, errors }) {
  let describedBy = "";
  if (descriptionId) {
    describedBy += descriptionId + " ";
  }
  if (errors.length && fieldErrorsId) {
    describedBy += fieldErrorsId;
  }
  return describedBy ? describedBy.trim() : void 0;
}
function getAriaRequired(constraints) {
  if (!("required" in constraints))
    return void 0;
  return constraints.required ? "true" : void 0;
}
function getAriaInvalid(errors) {
  return errors && errors.length ? "true" : void 0;
}
function getDataFsError(errors) {
  return errors && errors.length ? "" : void 0;
}
function generateId() {
  return nanoid(5);
}
function extractErrorArray(errors) {
  if (Array.isArray(errors))
    return errors;
  if (typeof errors === "object" && "_errors" in errors) {
    if (errors._errors !== void 0)
      return errors._errors;
  }
  return [];
}
function getValueAtPath(path, obj) {
  const keys = path.split(/[[\].]/).filter(Boolean);
  let value = obj;
  for (const key of keys) {
    if (typeof value !== "object" || value === null) {
      return void 0;
    }
    value = value[key];
  }
  return value;
}
const Field = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let formErrors;
  let formConstraints;
  let formTainted;
  let formData;
  let $formTainted, $$unsubscribe_formTainted = noop, $$subscribe_formTainted = () => ($$unsubscribe_formTainted(), $$unsubscribe_formTainted = subscribe(formTainted, ($$value) => $formTainted = $$value), formTainted);
  let $formConstraints, $$unsubscribe_formConstraints = noop, $$subscribe_formConstraints = () => ($$unsubscribe_formConstraints(), $$unsubscribe_formConstraints = subscribe(formConstraints, ($$value) => $formConstraints = $$value), formConstraints);
  let $formErrors, $$unsubscribe_formErrors = noop, $$subscribe_formErrors = () => ($$unsubscribe_formErrors(), $$unsubscribe_formErrors = subscribe(formErrors, ($$value) => $formErrors = $$value), formErrors);
  let $formData, $$unsubscribe_formData = noop, $$subscribe_formData = () => ($$unsubscribe_formData(), $$unsubscribe_formData = subscribe(formData, ($$value) => $formData = $$value), formData);
  let $errors, $$unsubscribe_errors;
  let $tainted, $$unsubscribe_tainted;
  let { form } = $$props;
  let { name } = $$props;
  const field = {
    name: writable(name),
    errors: writable([]),
    constraints: writable({}),
    tainted: writable(false),
    fieldErrorsId: writable(),
    descriptionId: writable(),
    form
  };
  const { tainted, errors } = field;
  $$unsubscribe_tainted = subscribe(tainted, (value) => $tainted = value);
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  setFormField(field);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  $$subscribe_formErrors({ errors: formErrors, constraints: formConstraints, tainted: formTainted, form: formData } = form, $$subscribe_formConstraints(), $$subscribe_formTainted(), $$subscribe_formData());
  {
    field.name.set(name);
  }
  {
    field.errors.set(extractErrorArray(getValueAtPath(name, $formErrors)));
  }
  {
    field.constraints.set(getValueAtPath(name, $formConstraints) ?? {});
  }
  {
    field.tainted.set($formTainted ? getValueAtPath(name, $formTainted) === true : false);
  }
  $$unsubscribe_formTainted();
  $$unsubscribe_formConstraints();
  $$unsubscribe_formErrors();
  $$unsubscribe_formData();
  $$unsubscribe_errors();
  $$unsubscribe_tainted();
  return ` ${slots.default ? slots.default({
    value: $formData[name],
    errors: $errors,
    tainted: $tainted,
    constraints: $formConstraints[name]
  }) : ``}`;
});
const Control$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let errorAttr;
  let attrs;
  let labelAttrs;
  let $idStore, $$unsubscribe_idStore;
  let $constraints, $$unsubscribe_constraints;
  let $errors, $$unsubscribe_errors;
  let $descriptionId, $$unsubscribe_descriptionId;
  let $fieldErrorsId, $$unsubscribe_fieldErrorsId;
  let $name, $$unsubscribe_name;
  let { id = generateId() } = $$props;
  const { name, fieldErrorsId, descriptionId, errors, constraints } = getFormField();
  $$unsubscribe_name = subscribe(name, (value) => $name = value);
  $$unsubscribe_fieldErrorsId = subscribe(fieldErrorsId, (value) => $fieldErrorsId = value);
  $$unsubscribe_descriptionId = subscribe(descriptionId, (value) => $descriptionId = value);
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  $$unsubscribe_constraints = subscribe(constraints, (value) => $constraints = value);
  const controlContext = {
    id: writable(id),
    attrs: writable(),
    labelAttrs: writable()
  };
  const { id: idStore } = controlContext;
  $$unsubscribe_idStore = subscribe(idStore, (value) => $idStore = value);
  setFormControl(controlContext);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  {
    controlContext.id.set(id);
  }
  errorAttr = getDataFsError($errors);
  attrs = {
    name: $name,
    id: $idStore,
    "data-fs-error": errorAttr,
    "aria-describedby": getAriaDescribedBy({
      fieldErrorsId: $fieldErrorsId,
      descriptionId: $descriptionId,
      errors: $errors
    }),
    "aria-invalid": getAriaInvalid($errors),
    "aria-required": getAriaRequired($constraints),
    "data-fs-control": ""
  };
  labelAttrs = {
    for: $idStore,
    "data-fs-label": "",
    "data-fs-error": errorAttr
  };
  {
    controlContext.attrs.set(attrs);
  }
  {
    controlContext.labelAttrs.set(labelAttrs);
  }
  $$unsubscribe_idStore();
  $$unsubscribe_constraints();
  $$unsubscribe_errors();
  $$unsubscribe_descriptionId();
  $$unsubscribe_fieldErrorsId();
  $$unsubscribe_name();
  return ` ${slots.default ? slots.default({ attrs }) : ``}`;
});
const Field_errors = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let errorAttr;
  let fieldErrorsAttrs;
  let errorAttrs;
  let $$restProps = compute_rest_props($$props, ["id", "asChild", "el"]);
  let $fieldErrorsId, $$unsubscribe_fieldErrorsId;
  let $errors, $$unsubscribe_errors;
  const { fieldErrorsId, errors } = getFormField();
  $$unsubscribe_fieldErrorsId = subscribe(fieldErrorsId, (value) => $fieldErrorsId = value);
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  let { id = generateId() } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0)
    $$bindings.el(el);
  errorAttr = getDataFsError($errors);
  {
    fieldErrorsId.set(id);
  }
  fieldErrorsAttrs = {
    id: $fieldErrorsId,
    "data-fs-error": errorAttr,
    "data-fs-field-errors": "",
    "aria-live": "assertive",
    ...$$restProps
  };
  errorAttrs = {
    "data-fs-field-error": "",
    "data-fs-error": errorAttr
  };
  $$unsubscribe_fieldErrorsId();
  $$unsubscribe_errors();
  return ` ${asChild ? `${slots.default ? slots.default({
    errors: $errors,
    fieldErrorsAttrs,
    errorAttrs
  }) : ``}` : `<div${spread([escape_object(fieldErrorsAttrs)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({
    errors: $errors,
    fieldErrorsAttrs,
    errorAttrs
  }) : ` ${each($errors, (error) => {
    return `<div${spread([escape_object(errorAttrs)], {})}>${escape(error)}</div>`;
  })} `}</div>`}`;
});
const Form_label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let $labelAttrs, $$unsubscribe_labelAttrs;
  let { class: className = void 0 } = $$props;
  const { labelAttrs } = getFormControl();
  $$unsubscribe_labelAttrs = subscribe(labelAttrs, (value) => $labelAttrs = value);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  $$unsubscribe_labelAttrs();
  return `${validate_component(Label, "Label").$$render(
    $$result,
    Object.assign(
      {},
      $labelAttrs,
      {
        class: cn("data-[fs-error]:text-destructive", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({ labelAttrs }) : ``}`;
      }
    }
  )}`;
});
const Form_field_errors = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "errorClasses"]);
  let { class: className = void 0 } = $$props;
  let { errorClasses = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.errorClasses === void 0 && $$bindings.errorClasses && errorClasses !== void 0)
    $$bindings.errorClasses(errorClasses);
  return `${validate_component(Field_errors, "FormPrimitive.FieldErrors").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-[0.8rem] font-medium text-destructive bg-red-200 rounded !mb-4", className)
      },
      $$restProps
    ),
    {},
    {
      default: ({ errors, fieldErrorsAttrs, errorAttrs }) => {
        return `${slots.default ? slots.default({ errors, fieldErrorsAttrs, errorAttrs }) : ` ${each(errors, (error) => {
          return `<div${spread(
            [
              escape_object(errorAttrs),
              {
                class: escape_attribute_value(cn("px-2 py-1 border border-red-600/10", errorClasses))
              }
            ],
            {}
          )}>${escape(error)}</div>`;
        })} `}`;
      }
    }
  )}`;
});
const Form_field = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form } = $$props;
  let { name } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Field, "FormPrimitive.Field").$$render($$result, { form, name }, {}, {
    default: ({ constraints, errors, tainted, value }) => {
      return `<div${add_attribute("class", cn("space-y-2", className), 0)}>${slots.default ? slots.default({ constraints, errors, tainted, value }) : ``}</div>`;
    }
  })}`;
});
const Control = Control$1;
export {
  Control as C,
  Form_field as F,
  Input as I,
  Form_label as a,
  Form_field_errors as b
};
