import { s as subscribe } from "./utils.js";
import { c as createEventDispatcher, o as onDestroy } from "./lifecycle.js";
import { c as create_ssr_component, v as validate_component, e as escape, a as add_attribute } from "./ssr.js";
import "./page.js";
import { t, l as locale } from "./translations.js";
import { B as Button } from "./index4.js";
import { C as Chevron_left } from "./chevron-left.js";
import { A as Arrow_right, a as Chevron_up, b as Chevron_down } from "./chevron-down.js";
import { b as backgroundImage } from "./SparklePill.js";
const css$1 = {
  code: ".group .light-button{transition:box-shadow 50ms, background-color 700ms}.group:active .light-button{box-shadow:0 0 0 rgba(255, 255, 255, 0.6), 0 0 0 rgba(0, 0, 0, 0.2)}",
  map: `{"version":3,"file":"ResponseFormStepper.svelte","sources":["ResponseFormStepper.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { Button } from \\"$lib/components/ui/button-op1/index.js\\";\\nimport { createEventDispatcher } from \\"svelte\\";\\nimport { t } from \\"$lib/translations\\";\\nimport ArrowRight from \\"lucide-svelte/icons/arrow-right\\";\\nimport ChevronLeft from \\"lucide-svelte/icons/chevron-left\\";\\nconst dispatch = createEventDispatcher();\\nexport let step;\\nexport let checkForJudgement;\\nlet className = void 0;\\nexport { className as class };\\nconst toPrev = () => {\\n  console.log(\\"toPrev\\");\\n  dispatch(\\"toPrev\\");\\n};\\nconst handleJudgementCheck = () => {\\n  dispatch(\\"validateObservation\\");\\n};\\n<\/script>\\n\\n<div class=\\"flex justify-between {className}\\">\\n\\t<div\\n\\t\\tclass=\\"{step > 1\\n\\t\\t\\t? 'max-w-60 opacity-100'\\n\\t\\t\\t: 'max-w-0 opacity-0'} group relative transform overflow-visible\\"\\n\\t>\\n\\t\\t<Button\\n\\t\\t\\ton:click={toPrev}\\n\\t\\t\\tdecoration=\\"dark-op1\\"\\n\\t\\t\\tclass=\\"flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200\\"\\n\\t\\t>\\n\\t\\t\\t<ChevronLeft class=\\"h-4 w-4 rounded-full\\" />\\n\\t\\t</Button>\\n\\t</div>\\n\\t{#if checkForJudgement}\\n\\t\\t<Button\\n\\t\\t\\ton:click={handleJudgementCheck}\\n\\t\\t\\tdecoration=\\"dark-op1\\"\\n\\t\\t\\twrapperClass=\\"w-full\\"\\n\\t\\t\\tclass=\\"flex w-full items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200\\"\\n\\t\\t>\\n\\t\\t\\t<!-- <Button\\n\\t\\t\\ttype=\\"submit\\"\\n\\t\\t\\tclass=\\"light-button group {primaryButtonClass} hover:{primaryButtonClass} relative z-10 m-[1px] flex w-[calc(100%-2px)] items-center justify-between py-6 font-bold text-foreground dark:border-x dark:border-t dark:border-white/5\\"\\n\\t\\t> -->\\n\\t\\t\\t{$t('default.page.fights.form.general.checkJudgement')}\\n\\t\\t\\t<ArrowRight class=\\"h-3 w-3\\" />\\n\\t\\t</Button>\\n\\t{:else}\\n\\t\\t<Button\\n\\t\\t\\ttype=\\"submit\\"\\n\\t\\t\\tdecoration=\\"dark-op1\\"\\n\\t\\t\\twrapperClass=\\"w-full\\"\\n\\t\\t\\tclass=\\"flex w-full items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200\\"\\n\\t\\t>\\n\\t\\t\\t<!-- <Button\\n\\t\\t\\ttype=\\"submit\\"\\n\\t\\t\\tclass=\\"light-button group {primaryButtonClass} hover:{primaryButtonClass} relative z-10 m-[1px] flex w-[calc(100%-2px)] items-center justify-between py-6 font-bold text-foreground dark:border-x dark:border-t dark:border-white/5\\"\\n\\t\\t> -->\\n\\t\\t\\t{#if step === 1}\\n\\t\\t\\t\\t{$t('default.page.fights.form.general.yes')}\\n\\t\\t\\t{:else if step === 2}\\n\\t\\t\\t\\t{$t('default.page.fights.form.general.knowledge')}\\n\\t\\t\\t{:else}\\n\\t\\t\\t\\t{$t('default.page.fights.form.general.next')}\\n\\t\\t\\t{/if}\\n\\t\\t\\t<ArrowRight class=\\"h-3 w-3\\" />\\n\\t\\t</Button>\\n\\t{/if}\\n</div>\\n\\n<style lang=\\"scss\\">:global(.group .light-button) {\\n  transition: box-shadow 50ms, background-color 700ms;\\n}\\n\\n:global(.group:active .light-button) {\\n  box-shadow: 0 0 0 rgba(255, 255, 255, 0.6), 0 0 0 rgba(0, 0, 0, 0.2);\\n}</style>\\n"],"names":[],"mappings":"AAsE2B,oBAAsB,CAC/C,UAAU,CAAE,UAAU,CAAC,IAAI,CAAC,CAAC,gBAAgB,CAAC,KAChD,CAEQ,2BAA6B,CACnC,UAAU,CAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CACrE"}`
};
const ResponseFormStepper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  createEventDispatcher();
  let { step } = $$props;
  let { checkForJudgement } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.step === void 0 && $$bindings.step && step !== void 0) $$bindings.step(step);
  if ($$props.checkForJudgement === void 0 && $$bindings.checkForJudgement && checkForJudgement !== void 0) $$bindings.checkForJudgement(checkForJudgement);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
  $$result.css.add(css$1);
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
        return `${validate_component(Chevron_left, "ChevronLeft").$$render($$result, { class: "h-4 w-4 rounded-full" }, {}, {})}`;
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
        return ` ${escape($t("default.page.fights.form.general.checkJudgement"))} ${validate_component(Arrow_right, "ArrowRight").$$render($$result, { class: "h-3 w-3" }, {}, {})}`;
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
        return ` ${step === 1 ? `${escape($t("default.page.fights.form.general.yes"))}` : `${step === 2 ? `${escape($t("default.page.fights.form.general.knowledge"))}` : `${escape($t("default.page.fights.form.general.next"))}`}`} ${validate_component(Arrow_right, "ArrowRight").$$render($$result, { class: "h-3 w-3" }, {}, {})}`;
      }
    }
  )}`} </div>`;
});
const css = {
  code: ".triangle.svelte-e8i9pn{clip-path:polygon(0 0, 100% 0, 100% 100%)}.mouth.svelte-e8i9pn{animation:svelte-e8i9pn-mouth 10s infinite}.lookaround.svelte-e8i9pn{animation:svelte-e8i9pn-lookaround 10s infinite}.chevron.svelte-e8i9pn{display:flex;width:1rem;height:1rem;align-items:center;justify-content:center;border-radius:0.25rem;--tw-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}@keyframes svelte-e8i9pn-mouth{0%{transform:scaleY(0.4)}5%{transform:scaleY(1)}25%{transform:scaleY(0.4)}100%{transform:scaleY(1)}}@keyframes svelte-e8i9pn-lookaround{0%{transform:translate(0, 20%)}5%{transform:translate(-20%, 20%)}25%{transform:translate(40%, 20%)}30%{transform:translate(30%, 52%)}50%{transform:translate(30%, 52%)}55%{transform:translate(-30%, 44%)}85%{transform:translate(-30%, 44%)}100%{transform:translate(0, 20%)}}",
  map: '{"version":3,"file":"ResponseMascot.svelte","sources":["ResponseMascot.svelte"],"sourcesContent":["<script lang=\\"ts\\">import ChevronUp from \\"lucide-svelte/icons/chevron-up\\";\\nimport ChevronDown from \\"lucide-svelte/icons/chevron-down\\";\\nimport backgroundImage from \\"$assets/images/holo3.jpg\\";\\nimport { t, locale } from \\"$lib/translations\\";\\nimport { onMount, onDestroy } from \\"svelte\\";\\nexport let step;\\nexport let formSuccess;\\nexport let speechBubbleContentArray;\\nlet speechBubbleIndex = 0;\\nlet thinking = false;\\nconst getSpeechBubbleContent = (formSuccess2, step2, speechBubbleContentArray2) => {\\n  try {\\n    console.log(\\"speechBubbleContentArray\\", speechBubbleContentArray2);\\n    return step2 === 13 && !formSuccess2 ? speechBubbleContentArray2.find((el) => el.step === 13).errorContent : speechBubbleContentArray2.find((el) => el.step === step2).content;\\n  } catch (err) {\\n    console.error(\\"error in getSpeechBubbleContent\\", err);\\n    return [];\\n  }\\n};\\n$: speechBubbleContent = getSpeechBubbleContent(formSuccess, step, speechBubbleContentArray);\\nlet speechBubbleElement;\\nlet typingTimeoutId;\\n$: step, speechBubbleIndex = 0;\\n$: {\\n  if (speechBubbleElement) {\\n    console.log(\\"inside if speechBubbleElement\\");\\n    typeText(speechBubbleElement, speechBubbleContent[speechBubbleIndex], 30);\\n  }\\n}\\nconst typeText = (element, text, speed) => {\\n  try {\\n    let type = function() {\\n      if (index < text.length) {\\n        element.innerHTML += text.charAt(index);\\n        index++;\\n        typingTimeoutId = setTimeout(type, speed);\\n      }\\n    };\\n    console.log(\\"typeText\\");\\n    let index = 0;\\n    element.innerHTML = \\"\\";\\n    const tempElement = document.createElement(\\"div\\");\\n    tempElement.style.visibility = \\"hidden\\";\\n    tempElement.style.position = \\"absolute\\";\\n    tempElement.style.width = `${element.clientWidth}px`;\\n    tempElement.style.color = \\"red\\";\\n    tempElement.style.whiteSpace = \\"pre-wrap\\";\\n    tempElement.innerText = text;\\n    element.appendChild(tempElement);\\n    const targetHeight = tempElement.clientHeight;\\n    element.style.height = `${targetHeight}px`;\\n    element.removeChild(tempElement);\\n    if (typingTimeoutId) {\\n      clearTimeout(typingTimeoutId);\\n    }\\n    type();\\n  } catch (err) {\\n    console.error(\\"error typing text\\", err);\\n  }\\n};\\nconst addSpeechBubbleText = (text = \\"Hi\\") => {\\n  speechBubbleContent = [speechBubbleContent[0], text];\\n  speechBubbleIndex = 1;\\n};\\nexport const checkJudgement = async (judgement) => {\\n  thinking = true;\\n  try {\\n    const judgementRes = await fetch(\\"/api/ai/checkForJudgement\\", {\\n      method: \\"POST\\",\\n      headers: {\\n        \\"Content-Type\\": \\"application/json\\"\\n      },\\n      body: JSON.stringify({\\n        text: judgement,\\n        lang: $locale\\n      })\\n    });\\n    const res = await judgementRes.json();\\n    thinking = false;\\n    const answer = res.result;\\n    addSpeechBubbleText(answer);\\n  } catch (err) {\\n    console.error(\\"error in getting judgement\\", err);\\n  }\\n};\\nconst decreaseIndex = () => {\\n  console.log(\\"decreaseIndex\\");\\n  if (speechBubbleIndex > 0) speechBubbleIndex--;\\n};\\nconst increaseIndex = () => {\\n  console.log(\\"increaseIndex\\");\\n  if (speechBubbleContent.length > 1 && speechBubbleIndex === 0) speechBubbleIndex++;\\n};\\nonDestroy(() => {\\n  if (typingTimeoutId) {\\n    clearTimeout(typingTimeoutId);\\n  }\\n});\\n<\/script>\\n<div class=\\"mt-4 flex items-start gap-2\\">\\n\\t<div class=\\"relative left-0 right-0 flex h-12 flex-shrink-0 justify-center gap-1\\">\\n\\t\\t<div\\n\\t\\t\\tstyle=\\"background-image: url(\'{backgroundImage}\'); background-size: 300% 100%\\"\\n\\t\\t\\tclass=\\"animate-bg relative z-10 flex h-full w-[60px] items-center justify-center rounded-b rounded-t-[50px] shadow-lg transition duration-700\\"\\n\\t\\t>\\n\\t\\t\\t<div data-name=\\"face\\" class=\\"lookaround face-3 flex flex-col gap-1\\">\\n\\t\\t\\t\\t<div data-name=\\"eyes\\" class=\\"eyes flex items-center justify-center gap-2\\">\\n\\t\\t\\t\\t\\t<div class=\\"h-2 w-2 rounded-full border-2 border-white bg-black shadow-md\\"></div>\\n\\t\\t\\t\\t\\t<div class=\\"h-2 w-2 rounded-full border-2 border-white bg-black shadow-md\\"></div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t<div data-name=\\"mouth\\" class=\\"mouth flex items-center justify-center\\">\\n\\t\\t\\t\\t\\t<div class=\\"h-1.5 w-2.5 rounded-b-full bg-black\\"></div>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n\\t<div class=\\"flex flex-grow\\">\\n\\t\\t<div class=\\"triangle size-3 flex-shrink-0 bg-muted\\"></div>\\n\\t\\t<div\\n\\t\\t\\tclass=\\"rounded-tl-0 relative flex flex-grow rounded-b rounded-tr bg-muted px-2 pb-2 pt-1 text-sm leading-tight gap-2\\"\\n\\t\\t>\\n\\t\\t{#if thinking}\\n\\t\\t<div id=\\"speechBubble\\" class=\\"w-full\\">\\n\\t\\t\\t...\\n\\t\\t</div>\\n\\t\\t{:else}\\n\\t\\t\\t<div id=\\"speechBubble\\" bind:this={speechBubbleElement} class=\\"w-full\\"></div>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if speechBubbleContent.length > 1}\\n\\t\\t\\t<div class=\\"flex justify-end text-2xs\\">\\n\\t\\t\\t\\t<div class=\\"-mr-1 flex flex-col items-center gap-0.5\\">\\n\\t\\t\\t\\t\\t<button on:click={() => decreaseIndex()} class=\\"chevron\\">\\n\\t\\t\\t\\t\\t\\t<ChevronUp class=\\"size-2.5\\" />\\n\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t\\t<!-- <div class=\\"flex size-4 flex-shrink-0 items-center justify-center py-1\\">\\n\\t\\t\\t\\t\\t\\t{speechBubbleIndex + 1}/{speechBubbleContent.length}\\n\\t\\t\\t\\t\\t</div> -->\\n\\t\\t\\t\\t\\t<button on:click={() => increaseIndex()} class=\\"chevron\\">\\n\\t\\t\\t\\t\\t\\t<ChevronDown class=\\"size-2.5\\" />\\n\\t\\t\\t\\t\\t</button>\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</div>\\n\\t\\t\\t{/if}\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<!-- <button on:click={() => checkJudgement()}>Check Judgement</button> -->\\n\\n<!-- <button on:click={() => addSpeechBubbleText()}>Add Text</button> -->\\n\\n<style lang=\\"scss\\">.triangle {\\n  clip-path: polygon(0 0, 100% 0, 100% 100%);\\n}\\n\\n.mouth {\\n  animation: mouth 10s infinite;\\n}\\n\\n.lookaround {\\n  animation: lookaround 10s infinite;\\n}\\n\\n.chevron {\\n  display: flex;\\n  width: 1rem;\\n  height: 1rem;\\n  align-items: center;\\n  justify-content: center;\\n  border-radius: 0.25rem;\\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\\n}\\n\\n@keyframes mouth {\\n  0% {\\n    transform: scaleY(0.4);\\n  }\\n  5% {\\n    transform: scaleY(1);\\n  }\\n  25% {\\n    transform: scaleY(0.4);\\n  }\\n  100% {\\n    transform: scaleY(1);\\n  }\\n}\\n@keyframes lookaround {\\n  0% {\\n    transform: translate(0, 20%);\\n  }\\n  5% {\\n    transform: translate(-20%, 20%);\\n  }\\n  25% {\\n    transform: translate(40%, 20%);\\n  }\\n  30% {\\n    transform: translate(30%, 52%);\\n  }\\n  50% {\\n    transform: translate(30%, 52%);\\n  }\\n  55% {\\n    transform: translate(-30%, 44%);\\n  }\\n  85% {\\n    transform: translate(-30%, 44%);\\n  }\\n  100% {\\n    transform: translate(0, 20%);\\n  }\\n}</style>\\n"],"names":[],"mappings":"AAuJmB,uBAAU,CAC3B,SAAS,CAAE,QAAQ,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,IAAI,CAC3C,CAEA,oBAAO,CACL,SAAS,CAAE,mBAAK,CAAC,GAAG,CAAC,QACvB,CAEA,yBAAY,CACV,SAAS,CAAE,wBAAU,CAAC,GAAG,CAAC,QAC5B,CAEA,sBAAS,CACP,OAAO,CAAE,IAAI,CACb,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,aAAa,CAAE,OAAO,CACtB,WAAW,CAAE,6DAA6D,CAC1E,mBAAmB,CAAE,yEAAyE,CAC9F,UAAU,CAAE,IAAI,uBAAuB,CAAC,UAAU,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,UAAU,CAAC,CAAC,CAAC,IAAI,WAAW,CACxG,CAEA,WAAW,mBAAM,CACf,EAAG,CACD,SAAS,CAAE,OAAO,GAAG,CACvB,CACA,EAAG,CACD,SAAS,CAAE,OAAO,CAAC,CACrB,CACA,GAAI,CACF,SAAS,CAAE,OAAO,GAAG,CACvB,CACA,IAAK,CACH,SAAS,CAAE,OAAO,CAAC,CACrB,CACF,CACA,WAAW,wBAAW,CACpB,EAAG,CACD,SAAS,CAAE,UAAU,CAAC,CAAC,CAAC,GAAG,CAC7B,CACA,EAAG,CACD,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,GAAG,CAChC,CACA,GAAI,CACF,SAAS,CAAE,UAAU,GAAG,CAAC,CAAC,GAAG,CAC/B,CACA,GAAI,CACF,SAAS,CAAE,UAAU,GAAG,CAAC,CAAC,GAAG,CAC/B,CACA,GAAI,CACF,SAAS,CAAE,UAAU,GAAG,CAAC,CAAC,GAAG,CAC/B,CACA,GAAI,CACF,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,GAAG,CAChC,CACA,GAAI,CACF,SAAS,CAAE,UAAU,IAAI,CAAC,CAAC,GAAG,CAChC,CACA,IAAK,CACH,SAAS,CAAE,UAAU,CAAC,CAAC,CAAC,GAAG,CAC7B,CACF"}'
};
const ResponseMascot = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let speechBubbleContent;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  let { step } = $$props;
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
  if ($$props.step === void 0 && $$bindings.step && step !== void 0) $$bindings.step(step);
  if ($$props.formSuccess === void 0 && $$bindings.formSuccess && formSuccess !== void 0) $$bindings.formSuccess(formSuccess);
  if ($$props.speechBubbleContentArray === void 0 && $$bindings.speechBubbleContentArray && speechBubbleContentArray !== void 0) $$bindings.speechBubbleContentArray(speechBubbleContentArray);
  if ($$props.checkJudgement === void 0 && $$bindings.checkJudgement && checkJudgement !== void 0) $$bindings.checkJudgement(checkJudgement);
  $$result.css.add(css);
  speechBubbleContent = getSpeechBubbleContent(formSuccess, step, speechBubbleContentArray);
  $$unsubscribe_locale();
  return `<div class="mt-4 flex items-start gap-2"><div class="relative left-0 right-0 flex h-12 flex-shrink-0 justify-center gap-1" data-svelte-h="svelte-ido9h0"><div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}" class="animate-bg relative z-10 flex h-full w-[60px] items-center justify-center rounded-b rounded-t-[50px] shadow-lg transition duration-700"><div data-name="face" class="lookaround face-3 flex flex-col gap-1 svelte-e8i9pn"><div data-name="eyes" class="eyes flex items-center justify-center gap-2"><div class="h-2 w-2 rounded-full border-2 border-white bg-black shadow-md"></div> <div class="h-2 w-2 rounded-full border-2 border-white bg-black shadow-md"></div></div> <div data-name="mouth" class="mouth flex items-center justify-center svelte-e8i9pn"><div class="h-1.5 w-2.5 rounded-b-full bg-black"></div></div></div></div></div> <div class="flex flex-grow"><div class="triangle size-3 flex-shrink-0 bg-muted svelte-e8i9pn"></div> <div class="rounded-tl-0 relative flex flex-grow rounded-b rounded-tr bg-muted px-2 pb-2 pt-1 text-sm leading-tight gap-2">${thinking ? `<div id="speechBubble" class="w-full" data-svelte-h="svelte-534rav">...</div>` : `<div id="speechBubble" class="w-full"${add_attribute("this", speechBubbleElement, 0)}></div>`} ${speechBubbleContent.length > 1 ? `<div class="flex justify-end text-2xs"><div class="-mr-1 flex flex-col items-center gap-0.5"><button class="chevron svelte-e8i9pn">${validate_component(Chevron_up, "ChevronUp").$$render($$result, { class: "size-2.5" }, {}, {})}</button>  <button class="chevron svelte-e8i9pn">${validate_component(Chevron_down, "ChevronDown").$$render($$result, { class: "size-2.5" }, {}, {})}</button></div></div>` : ``}</div></div></div>  `;
});
export {
  ResponseMascot as R,
  ResponseFormStepper as a
};
