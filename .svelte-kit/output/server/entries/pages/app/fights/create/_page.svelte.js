import { g as get_store_value, s as subscribe } from "../../../../../chunks/utils.js";
import { k as globals } from "../../../../../chunks/switch.js";
import { c as create_ssr_component, e as escape, v as validate_component, f as each } from "../../../../../chunks/ssr.js";
import { A as AppTopMenu, a as AppBottomMenu } from "../../../../../chunks/AppBottomMenu.js";
import { F as Form_field, C as Control, c as Form_label, I as Input, d as Form_field_errors } from "../../../../../chunks/index5.js";
import { M as Mascot, T as Textarea, a as Toggle_group, b as Toggle_group_item, F as FormStepper, S as Share } from "../../../../../chunks/Share.js";
import "../../../../../chunks/client.js";
import { s as superForm } from "../../../../../chunks/memoize.js";
import { d as defaults, F as FormStepDisplay } from "../../../../../chunks/index7.js";
import "../../../../../chunks/index.js";
import { t, l as locale } from "../../../../../chunks/translations.js";
import { a as zod, z as zodClient } from "../../../../../chunks/zod.js";
import { z } from "zod";
import { I as IconFolder } from "../../../../../chunks/icon-folder.js";
import { I as IconEye, a as IconHeart, b as IconSwirl, c as IconSteps } from "../../../../../chunks/icon-steps.js";
import { p as pb } from "../../../../../chunks/pocketbase.js";
import { u as user } from "../../../../../chunks/auth.js";
import { b as backgroundColor } from "../../../../../chunks/page.js";
const schemaStep1 = z.object({
  name: z.string().min(3, { message: get_store_value(t)("default.page.fights.form.name.tooShortError") }),
  title: z.string().min(3, { message: get_store_value(t)("default.page.fights.form.title.tooShortError") })
});
const schemaStep2 = schemaStep1.extend({
  observation: z.string().min(10, { message: get_store_value(t)("default.page.fights.form.observation.tooShortError") })
});
const schemaStep3 = schemaStep2.extend({
  feelings: z.array(z.string()).min(1, { message: get_store_value(t)("default.page.fights.form.feelings.tooFewError") })
});
const schemaStep4 = schemaStep3.extend({
  needs: z.array(z.string()).min(1, { message: get_store_value(t)("default.page.fights.form.needs.tooFewError") })
});
const schemaStep5 = schemaStep4.extend({
  request: z.string().optional()
});
const { Object: Object_1 } = globals;
const css = {
  code: ".form-label{margin-bottom:0.5rem;margin-top:1rem;display:block;width:100%;padding-bottom:0.5rem;font-size:1.25rem;line-height:1.75rem;font-weight:700;line-height:1.25\n}.form-label:not([data-fs-error]):is(.dark *){--tw-text-opacity:1;color:hsl(var(--foreground) / var(--tw-text-opacity))\n}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentBackgroundColor;
  let $formData, $$unsubscribe_formData;
  let $user, $$unsubscribe_user;
  let $t, $$unsubscribe_t;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  const data = defaults(zod(schemaStep5));
  let feelings = [];
  let needs = [];
  let checkJudgement;
  const steps = [
    zod(schemaStep1),
    zod(schemaStep2),
    zod(schemaStep3),
    zod(schemaStep4),
    zod(schemaStep5)
  ];
  let step = 1;
  let formSubmitted = false;
  let formSuccess = false;
  let checkForJudgement = false;
  let id;
  let createdRecord;
  const updateBackgroundColor = (step2) => {
    const color = `bg-${stepConstructor[step2 - 1].slug}-background`;
    backgroundColor.set(color);
    return color;
  };
  const speechBubbleContentArray = [
    {
      step: 1,
      content: [$t("default.page.fight.create.info")]
    },
    {
      step: 2,
      content: [$t("default.page.fight.create.observation")]
    },
    {
      step: 3,
      content: [$t("default.page.fight.create.feelings")]
    },
    {
      step: 4,
      content: [$t("default.page.fight.create.needs")]
    },
    {
      step: 5,
      content: [$t("default.page.fight.create.request")]
    },
    {
      step: 6,
      content: [$t("default.page.fight.create.success")],
      errorContent: [$t("default.page.fight.create.error")]
    }
  ];
  const handleSubmit = async () => {
    try {
      let data2 = $formData;
      data2.owner = $user.id;
      console.log("submit form", data2);
      const record = await pb.collection("fights").create(data2);
      id = record.id;
      createdRecord = record;
      formSuccess = true;
      formSubmitted = true;
    } catch (err) {
      console.log("error handling submit", err);
      formSuccess = false;
      formSubmitted = true;
    }
  };
  const checkValidation = async () => {
    const validationResult = await validateForm(schemaStep5);
    if (!validationResult.valid) {
      errors.set(validationResult.errors);
      return false;
    }
    return true;
  };
  const form = superForm(data, {
    // SPA: true,
    resetForm: false,
    validators: zodClient(schemaStep5),
    async onSubmit({ validators, cancel }) {
      console.log("onSubmit");
      cancel();
      if (await checkValidation()) {
        if (step == steps.length) {
          handleSubmit();
          step++;
        } else
          step++;
      }
    },
    async onUpdated({ form: form2 }) {
      console.log("onUpdated");
      if (form2.valid)
        step = 1;
    }
  });
  const { form: formData, errors, message, enhance, validate, validateForm, options, updateForm } = form;
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
  formData.subscribe((value) => {
    console.log("form was updated", value);
  });
  let stepConstructor = [
    {
      slug: "info",
      name: get_store_value(t)("default.page.fights.form.general.steps.info"),
      icon: IconFolder,
      invertedTextColor: false,
      hidden: false
    },
    {
      slug: "observation",
      name: get_store_value(t)("default.page.fights.form.general.steps.observation"),
      icon: IconEye,
      invertedTextColor: true,
      hidden: false
    },
    {
      slug: "feelings",
      name: get_store_value(t)("default.page.fights.form.general.steps.feelings"),
      icon: IconHeart,
      invertedTextColor: false,
      hidden: false
    },
    {
      slug: "needs",
      name: get_store_value(t)("default.page.fights.form.general.steps.needs"),
      icon: IconSwirl,
      invertedTextColor: false,
      hidden: false
    },
    {
      slug: "request",
      name: get_store_value(t)("default.page.fights.form.general.steps.request"),
      icon: IconSteps,
      invertedTextColor: false,
      hidden: false
    },
    {
      slug: "success",
      name: get_store_value(t)("default.page.fights.form.general.steps.success"),
      icon: IconSteps,
      invertedTextColor: false,
      hidden: true
    }
  ];
  t.subscribe((value) => {
    const newSteps = stepConstructor.map((entry) => {
      const translation = value(`default.page.fights.form.general.steps.${entry.slug}`);
      entry.name = translation;
      return entry;
    });
    stepConstructor = [...newSteps];
  });
  const categoryIsVisible = (feeling, category) => {
    const feelingSlug = feeling.nameEN;
    const categorySlug = category.category;
    if (feelingSlug === categorySlug)
      return true;
    if (category.visible)
      return true;
    return false;
  };
  step = 1;
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    options.validators = steps[step - 1];
    currentBackgroundColor = updateBackgroundColor(step);
    $$rendered = ` <div class="${"flex flex-grow flex-col justify-between transition duration-500 " + escape(currentBackgroundColor, true) + " dark:bg-background min-h-svh overflow-hidden"}">${validate_component(AppTopMenu, "AppTopMenu").$$render($$result, {}, {}, {})} <div class="max-container relative flex flex-grow flex-col pb-40"><form class="-mt-1 flex h-full flex-grow flex-col pb-[74px]">${!formSubmitted && !formSuccess ? `${validate_component(FormStepDisplay, "FormStepDisplay").$$render(
      $$result,
      {
        step,
        steps: stepConstructor,
        stepBackground: stepConstructor[step - 1].slug
      },
      {},
      {}
    )}` : ``} ${validate_component(Mascot, "Mascot").$$render(
      $$result,
      {
        speechBubbleContentArray,
        step,
        stepName: stepConstructor[step - 1].slug,
        formSuccess,
        checkJudgement
      },
      {
        checkJudgement: ($$value) => {
          checkJudgement = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${step === 1 ? `<div class="form-content">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "name" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label " }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.name.label"))}`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              Object_1.assign({}, attrs, { value: $formData.name }),
              {
                value: ($$value) => {
                  $formData.name = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })} ${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "title" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label " }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.title.label"))}`;
              }
            })} ${validate_component(Input, "Input").$$render(
              $$result,
              Object_1.assign({}, attrs, { value: $formData.title }),
              {
                value: ($$value) => {
                  $formData.title = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })}</div>` : `${step === 2 ? `<div class="form-content">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "observation" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label" }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.observation.label"))}`;
              }
            })} ${validate_component(Textarea, "Textarea").$$render(
              $$result,
              Object_1.assign({}, attrs, { class: "min-h-60" }, { value: $formData.observation }),
              {
                value: ($$value) => {
                  $formData.observation = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })}</div>` : `${step === 3 ? `<div class="form-content">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "feelings" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label" }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.feelings.label"))}`;
              }
            })} ${validate_component(Toggle_group, "ToggleGroup.Root").$$render(
              $$result,
              Object_1.assign({}, { type: "multiple" }, attrs, { class: "flex flex-col gap-4" }, { value: $formData.feelings }),
              {
                value: ($$value) => {
                  $formData.feelings = $$value;
                  $$settled = false;
                }
              },
              {
                default: () => {
                  return `${feelings.length > 0 ? `<div class="">${each(feelings, (positive) => {
                    return `<div class="${"text-" + escape(stepConstructor[step - 1].slug, true) + "-foreground mb-1 mt-3 flex items-center gap-3 text-xs"}">${escape(positive.category === "true" ? $t("default.page.fights.form.general.goodFeelings") : $t("default.page.fights.form.general.badFeelings"))} <div class="${"border-b border-" + escape(stepConstructor[step - 1].slug, true) + "-foreground mr-2 flex-grow border-opacity-20"}"></div></div> <div class="-mx-1 flex w-full flex-wrap justify-start transition-all">${each(positive.content, (category) => {
                      return `${each(category.content, (feeling) => {
                        return `<button type="button" class="${escape(
                          categoryIsVisible(feeling, category) || $formData.feelings.includes(feeling.id) ? "pointer-events-auto max-w-[300px] p-1 opacity-100" : "pointer-events-none m-0 max-w-0 p-0 opacity-0",
                          true
                        ) + " transition-all"}">${validate_component(Toggle_group_item, "ToggleGroup.Item").$$render(
                          $$result,
                          {
                            value: feeling.id,
                            class: (feeling.nameEN === category.category ? `bg-white/40 dark:bg-muted font-bold` : "border border-white/40 dark:border-white/20") + " py-0 text-black  shadow hover:text-black data-[state=on]:text-white dark:text-white data-[state=on]:bg-feelings-foreground dark:data-[state=on]:bg-feelings-foreground max-w-[300px]"
                          },
                          {},
                          {
                            default: () => {
                              return `${escape($locale === "de" ? feeling.nameDE : feeling.nameEN)} `;
                            }
                          }
                        )} </button>`;
                      })}`;
                    })} </div>`;
                  })}</div>` : ``}`;
                }
              }
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })}</div>` : `${step === 4 ? `<div class="form-content">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "needs" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label" }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.needs.label"))}`;
              }
            })} ${validate_component(Toggle_group, "ToggleGroup.Root").$$render(
              $$result,
              Object_1.assign({}, { type: "multiple" }, attrs, { class: "" }, { value: $formData.needs }),
              {
                value: ($$value) => {
                  $formData.needs = $$value;
                  $$settled = false;
                }
              },
              {
                default: () => {
                  return `${needs.length > 0 ? `<div class="-m-1 flex w-full flex-wrap justify-start transition-all">${each(needs, (category) => {
                    return `${each(category.content, (need) => {
                      return `<button type="button" class="${escape(
                        categoryIsVisible(need, category) || $formData.needs.includes(need.id) ? "pointer-events-auto max-h-60 max-w-[1000px] p-1 opacity-100" : "pointer-events-none m-0 max-h-0 max-w-0 p-0 opacity-0",
                        true
                      ) + " transition-all"}">${validate_component(Toggle_group_item, "ToggleGroup.Item").$$render(
                        $$result,
                        {
                          value: need.id,
                          class: (need.nameEN === category.category ? `bg-white/40 dark:bg-muted font-bold` : "border border-white/40 dark:border-white/20") + " py-0 text-black  shadow hover:text-black data-[state=on]:text-white dark:text-white data-[state=on]:bg-needs-foreground dark:data-[state=on]:bg-needs-foreground max-w-[300px]"
                        },
                        {},
                        {
                          default: () => {
                            return `${escape($locale === "de" ? need.nameDE : need.nameEN)} `;
                          }
                        }
                      )} </button>`;
                    })}`;
                  })}</div>` : ``}`;
                }
              }
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })}</div>` : `${!formSubmitted ? `<div class="form-content">${validate_component(Form_field, "Form.Field").$$render($$result, { form, name: "request" }, {}, {
      default: () => {
        return `${validate_component(Control, "Form.Control").$$render($$result, {}, {}, {
          default: ({ attrs }) => {
            return `${validate_component(Form_label, "Form.Label").$$render($$result, { class: "form-label" }, {}, {
              default: () => {
                return `${escape($t("default.page.fights.form.request.label"))}`;
              }
            })} ${validate_component(Textarea, "Textarea").$$render(
              $$result,
              Object_1.assign({}, attrs, { class: "min-h-60" }, { value: $formData.request }),
              {
                value: ($$value) => {
                  $formData.request = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}  ${validate_component(Form_field_errors, "Form.FieldErrors").$$render($$result, {}, {}, {})}`;
      }
    })}</div>` : `${formSuccess ? `<div></div>` : `<div></div>`}`}`}`}`}`} ${!formSubmitted && !formSuccess ? `${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(FormStepper, "FormStepper").$$render(
          $$result,
          {
            step,
            checkForJudgement,
            primaryButtonClass: currentBackgroundColor,
            class: "flex-shrink-0"
          },
          {},
          {}
        )}`;
      }
    })}` : `${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Share, "Share").$$render($$result, { id, record: createdRecord }, {}, {})}`;
      }
    })}`}</form></div> </div>`;
  } while (!$$settled);
  $$unsubscribe_formData();
  $$unsubscribe_user();
  $$unsubscribe_t();
  $$unsubscribe_locale();
  return $$rendered;
});
export {
  Page as default
};
