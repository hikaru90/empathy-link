import { g as get_store_value, e as subscribe } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, e as escape, v as validate_component, a as add_attribute } from './ssr-C1fln0Kh.js';
import { A as AppTopMenu } from './AppTopMenu-8Pu1klh-.js';
import { A as AppBottomMenu } from './AppBottomMenu-CrGNyZva.js';
import { p as page } from './stores-DfFLgiwW.js';
import './index3-BHwnx4G9.js';
import { d as defaults$1, F as FormStepDisplay, D as Drawer, b as Drawer_content, c as Drawer_header, e as Drawer_title, f as Close, g as Cross1$1, A as ArrowRight$1, C as ChevronUp$1, a as ChevronDown$1 } from './index7-Cg86EKQ4.js';
import { b as backgroundColor } from './page-C8qygIqX.js';
import { t as t2, a as locale } from './translations-Bkz4zMob.js';
import 'clsx';
import './client-BGiBm9n9.js';
import { u as user } from './auth-DQAPWa54.js';
import { b as superForm } from './memoize-CrOQi2XR.js';
import './index-DHSpIlkf.js';
import { c as createEventDispatcher, o as onDestroy } from './lifecycle-Dr9vL0LE.js';
import { B as Button } from './switch-DiY35A-z.js';
import { C as CaretLeft$1 } from './CaretLeft-CbllSXax.js';
import { z as zod, a as zodClient } from './zod-CSB5-Kzu.js';
import { z } from './index-BibYS5cI.js';
import { d as IconFolder, I as IconEye, a as IconHeart, b as IconSwirl, c as IconSteps } from './icon-steps-DaXsOn4d.js';
import { p as pb } from './pocketbase-jOic377y.js';
import { b as backgroundImage } from './SparklePill-pUbgiSQ9.js';
import './Avatar-DXilckiS.js';
import './helpers-r0YvbMTi.js';
import './utils2-CW1DFYkq.js';
import 'tailwind-merge';
import 'tailwind-variants';
import './index2-BL47qDlJ.js';
import './scheduler-Be-hqvXf.js';
import './root.svelte_svelte_type_style_lang-Bt4Du0Yj.js';
import './ssr2-BVSPLo1E.js';
import './stringify-DX2pbVR5.js';

const css$2 = {
  code: ".group .light-button{transition:box-shadow 50ms, background-color 700ms}.group:active .light-button{box-shadow:0 0 0 rgba(255, 255, 255, 0.6), 0 0 0 rgba(0, 0, 0, 0.2)}",
  map: null
};
const ResponseFormStepper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  createEventDispatcher();
  let { step } = $$props;
  let { checkForJudgement } = $$props;
  let { class: className = void 0 } = $$props;
  let { primaryButtonClass = void 0 } = $$props;
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.checkForJudgement === void 0 && $$bindings.checkForJudgement && checkForJudgement !== void 0)
    $$bindings.checkForJudgement(checkForJudgement);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.primaryButtonClass === void 0 && $$bindings.primaryButtonClass && primaryButtonClass !== void 0)
    $$bindings.primaryButtonClass(primaryButtonClass);
  $$result.css.add(css$2);
  $$unsubscribe_t();
  return `<div class="${"flex justify-between " + escape(className, true)}"><div class="${escape(step > 1 ? "max-w-60 opacity-100" : "max-w-0 opacity-0", true) + " group relative transform overflow-visible"}">${validate_component(Button, "Button").$$render(
    $$result,
    {
      decoration: "dark-op1",
      class: "flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
    },
    {},
    {
      default: () => {
        return `${validate_component(CaretLeft$1, "CaretLeft").$$render($$result, { class: "h-4 w-4 rounded-full" }, {}, {})}`;
      }
    }
  )}</div> ${checkForJudgement ? `${validate_component(Button, "Button").$$render(
    $$result,
    {
      decoration: "dark-op1",
      wrapperClass: "w-full",
      class: "flex w-full items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200"
    },
    {},
    {
      default: () => {
        return ` ${escape($t("default.page.fights.form.general.checkJudgement"))} ${validate_component(ArrowRight$1, "ArrowRight").$$render($$result, { class: "h-3 w-3" }, {}, {})}`;
      }
    }
  )}` : `${validate_component(Button, "Button").$$render(
    $$result,
    {
      type: "submit",
      decoration: "dark-op1",
      wrapperClass: "w-full",
      class: "flex w-full items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200"
    },
    {},
    {
      default: () => {
        return ` ${step === 1 ? `${escape($t("default.page.fights.form.general.yes"))}` : `${step === 2 ? `${escape($t("default.page.fights.form.general.knowledge"))}` : `${escape($t("default.page.fights.form.general.next"))}`}`} ${validate_component(ArrowRight$1, "ArrowRight").$$render($$result, { class: "h-3 w-3" }, {}, {})}`;
      }
    }
  )}`} </div>`;
});
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
const css$1 = {
  code: ".triangle.svelte-12yl6i5{-webkit-clip-path:polygon(0 0, 100% 0, 100% 100%);clip-path:polygon(0 0, 100% 0, 100% 100%)}.mouth.svelte-12yl6i5{animation:svelte-12yl6i5-mouth 10s infinite}.lookaround.svelte-12yl6i5{animation:svelte-12yl6i5-lookaround 10s infinite}.chevron.svelte-12yl6i5{display:flex;width:1rem;height:1rem;align-items:center;justify-content:center;border-radius:0.25rem;--tw-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}@keyframes svelte-12yl6i5-mouth{0%{transform:scaleY(0.4)}5%{transform:scaleY(1)}25%{transform:scaleY(0.4)}100%{transform:scaleY(1)}}@keyframes svelte-12yl6i5-lookaround{0%{transform:translate(0, 20%)}5%{transform:translate(-20%, 20%)}25%{transform:translate(40%, 20%)}30%{transform:translate(30%, 52%)}50%{transform:translate(30%, 52%)}55%{transform:translate(-30%, 44%)}85%{transform:translate(-30%, 44%)}100%{transform:translate(0, 20%)}}",
  map: null
};
const ResponseMascot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let speechBubbleContent;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  let { step } = $$props;
  let { stepName } = $$props;
  let { formSuccess } = $$props;
  let { speechBubbleContentArray } = $$props;
  let thinking = false;
  const getSpeechBubbleContent = (formSuccess2, step2, speechBubbleContentArray2) => {
    try {
      console.log("speechBubbleContentArray", speechBubbleContentArray2);
      return step2 === 13 && !formSuccess2 ? speechBubbleContentArray2.find((el) => el.step === 13).errorContent : speechBubbleContentArray2.find((el) => el.step === step2).content;
    } catch (err) {
      console.error("error in getSpeechBubbleContent", err);
      return [];
    }
  };
  let speechBubbleElement;
  const addSpeechBubbleText = (text = "Hi") => {
    speechBubbleContent = [speechBubbleContent[0], text];
  };
  const checkJudgement = async (judgement) => {
    thinking = true;
    try {
      const judgementRes = await fetch("/api/ai/checkForJudgement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: judgement, lang: $locale })
      });
      const res = await judgementRes.json();
      thinking = false;
      const answer = res.result;
      addSpeechBubbleText(answer);
    } catch (err) {
      console.error("error in getting judgement", err);
    }
  };
  onDestroy(() => {
  });
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.stepName === void 0 && $$bindings.stepName && stepName !== void 0)
    $$bindings.stepName(stepName);
  if ($$props.formSuccess === void 0 && $$bindings.formSuccess && formSuccess !== void 0)
    $$bindings.formSuccess(formSuccess);
  if ($$props.speechBubbleContentArray === void 0 && $$bindings.speechBubbleContentArray && speechBubbleContentArray !== void 0)
    $$bindings.speechBubbleContentArray(speechBubbleContentArray);
  if ($$props.checkJudgement === void 0 && $$bindings.checkJudgement && checkJudgement !== void 0)
    $$bindings.checkJudgement(checkJudgement);
  $$result.css.add(css$1);
  speechBubbleContent = getSpeechBubbleContent(formSuccess, step, speechBubbleContentArray);
  $$unsubscribe_locale();
  return `<div class="mt-4 flex items-start gap-2"><div class="relative left-0 right-0 flex h-12 flex-shrink-0 justify-center gap-1" data-svelte-h="svelte-ido9h0"><div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}" class="animate-bg relative z-10 flex h-full w-[60px] items-center justify-center rounded-b rounded-t-[50px] shadow-lg transition duration-700"><div data-name="face" class="lookaround face-3 flex flex-col gap-1 svelte-12yl6i5"><div data-name="eyes" class="eyes flex items-center justify-center gap-2"><div class="h-2 w-2 rounded-full border-2 border-white bg-black shadow-md"></div> <div class="h-2 w-2 rounded-full border-2 border-white bg-black shadow-md"></div></div> <div data-name="mouth" class="mouth flex items-center justify-center svelte-12yl6i5"><div class="h-1.5 w-2.5 rounded-b-full bg-black"></div></div></div></div></div> <div class="flex flex-grow"><div class="triangle size-3 flex-shrink-0 bg-muted svelte-12yl6i5"></div> <div class="rounded-tl-0 relative flex flex-grow rounded-b rounded-tr bg-muted px-2 pb-2 pt-1 text-sm leading-tight gap-2">${thinking ? `<div id="speechBubble" class="w-full" data-svelte-h="svelte-534rav">...</div>` : `<div id="speechBubble" class="w-full"${add_attribute("this", speechBubbleElement, 0)}></div>`} ${speechBubbleContent.length > 1 ? `<div class="flex justify-end text-2xs"><div class="-mr-1 flex flex-col items-center gap-0.5"><button class="chevron svelte-12yl6i5">${validate_component(ChevronUp$1, "ChevronUp").$$render($$result, { class: "size-2.5" }, {}, {})}</button>  <button class="chevron svelte-12yl6i5">${validate_component(ChevronDown$1, "ChevronDown").$$render($$result, { class: "size-2.5" }, {}, {})}</button></div></div>` : ``}</div></div></div>  `;
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
//# sourceMappingURL=_page.svelte-C-kYuaD6.js.map
