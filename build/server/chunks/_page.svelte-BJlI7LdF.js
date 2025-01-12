import { g as get_store_value, e as subscribe } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, e as escape, v as validate_component } from './ssr-DSt7LLAo.js';
import { A as AppTopMenu, a as AppBottomMenu } from './AppBottomMenu-Brc30YBM.js';
import { p as page } from './stores-CxxJpioQ.js';
import './index3-BMGKZ3wd.js';
import { d as defaults$1, F as FormStepDisplay, D as Drawer, b as Drawer_content, c as Drawer_header, e as Drawer_title, f as Close, g as Cross1$1 } from './index7-e-1XNQEv.js';
import { b as backgroundColor } from './page-Bu8b23cc.js';
import { t as t2, a as locale } from './translations-BMzuJwzR.js';
import 'clsx';
import './client-BGiBm9n9.js';
import { u as user } from './auth-DQAPWa54.js';
import { b as superForm } from './memoize-BkSYiOwG.js';
import './index-DHSpIlkf.js';
import { R as ResponseMascot, a as ResponseFormStepper } from './ResponseMascot-BNPWaCnr.js';
import { z as zod, a as zodClient } from './zod-BhS6dRKS.js';
import { z } from './index-BibYS5cI.js';
import { I as IconFolder } from './icon-folder-D6DUeM9b.js';
import { I as IconEye, a as IconHeart, b as IconSwirl, c as IconSteps } from './icon-steps-DyEaSnZ1.js';
import { p as pb } from './pocketbase-jOic377y.js';
import './lifecycle-DfHz3eeH.js';
import './switch-BUhJuRfb.js';
import './index2-BL47qDlJ.js';
import './scheduler-C1h3Gt9x.js';
import './SparklePill-Dfb-eSg5.js';
import './Avatar-BCqFeSfL.js';
import './helpers-CTGollho.js';
import 'tailwind-variants';
import './root.svelte_svelte_type_style_lang-DLmkTVv4.js';
import 'tailwind-merge';
import './ssr2-BVSPLo1E.js';
import './stringify-DX2pbVR5.js';
import './CaretLeft-CEffUaDR.js';

const schemaStep1 = z.object({});
const schemaStep2 = z.object({});
const schemaStep3 = z.object({});
const schemaStep4 = z.object({});
const schemaStep5 = z.object({});
const schemaStep6 = z.object({});
const schemaStep7 = z.object({});
const schemaStep8 = z.object({});
const schemaStep9 = schemaStep1.extend({
  observation: z.string().min(10, { message: get_store_value(t2)("default.page.fights.form.observation.tooShortError") })
});
const schemaStep10 = schemaStep2.extend({
  feelings: z.array(z.string()).min(1, { message: get_store_value(t2)("default.page.fights.form.feelings.tooFewError") })
});
const schemaStep11 = schemaStep3.extend({
  needs: z.array(z.string()).min(1, { message: get_store_value(t2)("default.page.fights.form.needs.tooFewError") })
});
const schemaStep12 = schemaStep4.extend({
  request: z.string().optional()
});
const css = {
  code: '.form-label{margin-bottom:0.5rem;margin-top:1rem;display:block;width:100%;padding-bottom:0.5rem;font-size:1.25rem;line-height:1.75rem;font-weight:700;line-height:1.25}.form-label:not([data-fs-error]):is(.dark *){--tw-text-opacity:1;color:hsl(var(--foreground) / var(--tw-text-opacity))}.breathe.svelte-18kg1ym{animation:svelte-18kg1ym-breathe 5s infinite alternate forwards}.breathe.svelte-18kg1ym:after{content:"";position:absolute;left:50%;top:50%;z-index:-10;height:18rem;width:18rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));border-radius:9999px;background-color:hsl(var(--muted) / 0.4)}.breathe2.svelte-18kg1ym{animation:svelte-18kg1ym-breathe 5s ease-in-out infinite alternate forwards;animation-delay:1s}.breathe2.svelte-18kg1ym:after{content:"";position:absolute;left:50%;top:50%;z-index:-10;height:10rem;width:10rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));border-radius:9999px;--tw-bg-opacity:1;background-color:hsl(var(--muted) / var(--tw-bg-opacity))}@keyframes svelte-18kg1ym-breathe{0%{transform:scale(0.2);opacity:0}100%{transform:scale(1);opacity:0.8}}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentBackgroundColor;
  let $$unsubscribe_page;
  let $$unsubscribe_user;
  let $t, $$unsubscribe_t;
  let $formData, $$unsubscribe_formData;
  let $$unsubscribe_locale;
  $$unsubscribe_page = subscribe(page, (value) => value);
  $$unsubscribe_user = subscribe(user, (value) => value);
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => value);
  const data = defaults$1(zod(schemaStep12));
  let fight = void 0;
  let checkJudgement;
  let speechBubbleContentArray = [{ step: 1, content: [""] }];
  const steps = [
    zod(schemaStep1),
    zod(schemaStep2),
    zod(schemaStep3),
    zod(schemaStep4),
    zod(schemaStep5),
    zod(schemaStep6),
    zod(schemaStep7),
    zod(schemaStep8),
    zod(schemaStep9),
    zod(schemaStep10),
    zod(schemaStep11),
    zod(schemaStep12)
  ];
  let step = 1;
  let formSubmitted = false;
  let formSuccess = false;
  let checkForJudgement = false;
  let drawerOpen = false;
  const updateBackgroundColor = (step2) => {
    const color = `bg-${stepConstructor[step2 - 1].slug}-background`;
    backgroundColor.set(color);
    return color;
  };
  const handleSubmit = async () => {
    try {
      let data2 = $formData;
      data2.fight = fight.id;
      console.log("submit form", data2);
      const record = await pb.collection("responses").create(data2);
      formSuccess = true;
      formSubmitted = true;
    } catch (err) {
      console.log("error handling submit", err);
      formSuccess = false;
      formSubmitted = true;
    }
  };
  const checkValidation = async () => {
    const validationResult = await validateForm($formData, schemaStep12);
    if (!validationResult.valid) {
      errors.set(validationResult.errors);
      return false;
    }
    return true;
  };
  const form = superForm(data, {
    // SPA: true,
    resetForm: false,
    validators: zodClient(schemaStep12),
    async onSubmit({ validators, cancel }) {
      console.log("onSubmit");
      cancel();
      if (await checkValidation()) {
        if (step == steps.length)
          handleSubmit();
        else
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
      slug: "greeting",
      name: get_store_value(t2)("default.page.fights.form.general.steps.info"),
      icon: IconFolder,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "disclaimer",
      name: get_store_value(t2)("default.page.fights.form.general.steps.info"),
      icon: IconFolder,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "breathe",
      name: get_store_value(t2)("default.page.fights.form.general.steps.info"),
      icon: IconFolder,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "observation",
      name: get_store_value(t2)("default.page.fights.form.general.steps.observation"),
      icon: IconEye,
      invertedTextColor: true,
      hidden: true
    },
    {
      slug: "feelings",
      name: get_store_value(t2)("default.page.fights.form.general.steps.feelings"),
      icon: IconHeart,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "needs",
      name: get_store_value(t2)("default.page.fights.form.general.steps.needs"),
      icon: IconSwirl,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "request",
      name: get_store_value(t2)("default.page.fights.form.general.steps.request"),
      icon: IconSteps,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "pause",
      name: get_store_value(t2)("default.page.fights.form.general.steps.observation"),
      icon: IconEye,
      invertedTextColor: true,
      hidden: true
    },
    {
      slug: "observation",
      name: get_store_value(t2)("default.page.fights.form.general.steps.observation"),
      icon: IconEye,
      invertedTextColor: true
    },
    {
      slug: "feelings",
      name: get_store_value(t2)("default.page.fights.form.general.steps.feelings"),
      icon: IconHeart,
      invertedTextColor: false
    },
    {
      slug: "needs",
      name: get_store_value(t2)("default.page.fights.form.general.steps.needs"),
      icon: IconSwirl,
      invertedTextColor: false
    },
    {
      slug: "request",
      name: get_store_value(t2)("default.page.fights.form.general.steps.request"),
      icon: IconSteps,
      invertedTextColor: false
    }
  ];
  t2.subscribe((value) => {
    const newSteps = stepConstructor.map((entry) => {
      const translation = value(`default.page.fights.form.general.steps.${entry.slug}`);
      entry.name = translation;
      return entry;
    });
    stepConstructor = [...newSteps];
  });
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    options.validators = steps[step - 1];
    currentBackgroundColor = updateBackgroundColor(step);
    $$rendered = ` <div class="${"flex flex-grow flex-col justify-between transition duration-500 " + escape(currentBackgroundColor, true) + " min-h-svh overflow-hidden dark:bg-background svelte-18kg1ym"}">${validate_component(AppTopMenu, "AppTopMenu").$$render($$result, {}, {}, {})} <div class="max-container relative flex flex-grow flex-col pb-40"><form class="-mt-1 flex h-full flex-grow flex-col pb-[74px]">${!formSubmitted && !formSuccess ? `${step > 8 ? `${validate_component(FormStepDisplay, "FormStepDisplay").$$render(
      $$result,
      {
        step,
        steps: stepConstructor,
        stepBackground: stepConstructor[step - 1].slug
      },
      {},
      {}
    )}` : ``} ${validate_component(ResponseMascot, "ResponseMascot").$$render(
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
    )}` : ``} ${``} ${!formSubmitted && !formSuccess ? `${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(ResponseFormStepper, "ResponseFormStepper").$$render(
          $$result,
          {
            step,
            checkForJudgement,
            primaryButtonClass: `bg-${stepConstructor[step - 1].slug}-background`,
            class: "flex-shrink-0"
          },
          {},
          {}
        )}`;
      }
    })}` : ``}</form></div></div> ${validate_component(Drawer, "Drawer.Root").$$render(
      $$result,
      { open: drawerOpen },
      {
        open: ($$value) => {
          drawerOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Drawer_content, "Drawer.Content").$$render($$result, { class: "p-4" }, {}, {
            default: () => {
              return `${validate_component(Drawer_header, "Drawer.Header").$$render($$result, {}, {}, {
                default: () => {
                  return `<div class="flex items-center justify-between">${validate_component(Drawer_title, "Drawer.Title").$$render($$result, {}, {}, {
                    default: () => {
                      return `${escape($t("default.page.respond.explanationTitle"))}`;
                    }
                  })}  ${validate_component(Close, "Drawer.Close").$$render($$result, {}, {}, {
                    default: () => {
                      return `${validate_component(Cross1$1, "Cross1").$$render($$result, { class: "text-red-600" }, {}, {})}`;
                    }
                  })}</div>`;
                }
              })} <p class="mb-20 p-4">${escape($t("default.page.respond.explanation"))}</p>`;
            }
          })}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_page();
  $$unsubscribe_user();
  $$unsubscribe_t();
  $$unsubscribe_formData();
  $$unsubscribe_locale();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-BJlI7LdF.js.map
