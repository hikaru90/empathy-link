import { g as get_store_value, s as subscribe } from "../../../../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, e as escape } from "../../../../../../chunks/ssr.js";
import { A as AppTopMenu } from "../../../../../../chunks/AppTopMenu.js";
import { A as AppBottomMenu } from "../../../../../../chunks/AppBottomMenu.js";
import { p as page } from "../../../../../../chunks/stores.js";
import "../../../../../../chunks/index4.js";
import { F as FormStepDisplay, b as Close } from "../../../../../../chunks/index10.js";
import { b as backgroundColor } from "../../../../../../chunks/page.js";
import "clsx";
import "../../../../../../chunks/index7.js";
import "../../../../../../chunks/index3.js";
import { t, l as locale } from "../../../../../../chunks/translations.js";
import "dequal";
import { u as user } from "../../../../../../chunks/auth.js";
import "../../../../../../chunks/client.js";
import { d as defaults } from "../../../../../../chunks/FormStepDisplay.svelte_svelte_type_style_lang.js";
import "ts-deepmerge";
import { s as superForm } from "../../../../../../chunks/formData.js";
import "../../../../../../chunks/index.js";
import { R as ResponseMascot, a as ResponseFormStepper } from "../../../../../../chunks/ResponseMascot.js";
import "memoize-weak";
import { a as zod, z as zodClient } from "../../../../../../chunks/zod.js";
import { z } from "zod";
import { I as IconFolder, a as IconEye, b as IconHeart, c as IconSwirl, d as IconSteps } from "../../../../../../chunks/icon-steps.js";
import { p as pb } from "../../../../../../chunks/pocketbase.js";
import { D as Drawer, a as Drawer_content, b as Drawer_header, c as Drawer_title } from "../../../../../../chunks/drawer-title.js";
import { X } from "../../../../../../chunks/x.js";
const schemaStep1 = z.object({});
const schemaStep2 = z.object({});
const schemaStep3 = z.object({});
const schemaStep4 = z.object({});
const schemaStep5 = z.object({});
const schemaStep6 = z.object({});
const schemaStep7 = z.object({});
const schemaStep8 = z.object({});
const schemaStep9 = schemaStep1.extend({
  observation: z.string().min(10, { message: get_store_value(t)("default.page.fights.form.observation.tooShortError") })
});
const schemaStep10 = schemaStep2.extend({
  feelings: z.array(z.string()).min(1, { message: get_store_value(t)("default.page.fights.form.feelings.tooFewError") })
});
const schemaStep11 = schemaStep3.extend({
  needs: z.array(z.string()).min(1, { message: get_store_value(t)("default.page.fights.form.needs.tooFewError") })
});
const schemaStep12 = schemaStep4.extend({
  request: z.string().optional()
});
const css = {
  code: '.form-label{margin-bottom:0.5rem;margin-top:1rem;display:block;width:100%;padding-bottom:0.5rem;font-size:1.25rem;line-height:1.75rem;font-weight:700;line-height:1.25}.form-label:not([data-fs-error]):is(.dark *){--tw-text-opacity:1;color:hsl(var(--foreground) / var(--tw-text-opacity, 1))}.breathe.svelte-15ze05s{animation:svelte-15ze05s-breathe 5s infinite alternate forwards}.breathe.svelte-15ze05s:after{content:"";position:absolute;left:50%;top:50%;z-index:-10;height:18rem;width:18rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));border-radius:9999px;background-color:hsl(var(--muted) / 0.4)}.breathe2.svelte-15ze05s{animation:svelte-15ze05s-breathe 5s ease-in-out infinite alternate forwards;animation-delay:1s}.breathe2.svelte-15ze05s:after{content:"";position:absolute;left:50%;top:50%;z-index:-10;height:10rem;width:10rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));border-radius:9999px;--tw-bg-opacity:1;background-color:hsl(var(--muted) / var(--tw-bg-opacity, 1))}@keyframes svelte-15ze05s-breathe{0%{transform:scale(0.2);opacity:0}100%{transform:scale(1);opacity:0.8}}',
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import AppTopMenu from \\"$lib/components/AppTopMenu.svelte\\";\\nimport AppBottomMenu from \\"$lib/components/AppBottomMenu.svelte\\";\\nimport { page } from \\"$app/stores\\";\\nimport { Button } from \\"$lib/components/ui/button\\";\\nimport * as Drawer from \\"$lib/components/ui/drawer\\";\\nimport Menu from \\"$lib/components/Menu.svelte\\";\\nimport * as Form from \\"$lib/components/ui/form\\";\\nimport * as ToggleGroup from \\"$lib/components/ui/toggle-group\\";\\nimport { defaults, superForm } from \\"sveltekit-superforms\\";\\nimport ResponseFormStepper from \\"$lib/components/ResponseFormStepper.svelte\\";\\nimport FormStepDisplay from \\"$lib/components/FormStepDisplay.svelte\\";\\nimport { t, locale } from \\"$lib/translations\\";\\nimport { get } from \\"svelte/store\\";\\nimport { zodClient, zod } from \\"sveltekit-superforms/adapters\\";\\nimport {\\n  schemaStep1,\\n  schemaStep2,\\n  schemaStep3,\\n  schemaStep4,\\n  schemaStep5,\\n  schemaStep6,\\n  schemaStep7,\\n  schemaStep8,\\n  schemaStep9,\\n  schemaStep10,\\n  schemaStep11,\\n  schemaStep12 as lastStep\\n} from \\"./schema\\";\\nimport IconFolder from \\"$assets/icons/icon-folder.svg?raw\\";\\nimport IconEye from \\"$assets/icons/icon-eye.svg?raw\\";\\nimport IconHeart from \\"$assets/icons/icon-heart.svg?raw\\";\\nimport IconSwirl from \\"$assets/icons/icon-swirl.svg?raw\\";\\nimport IconSteps from \\"$assets/icons/icon-steps.svg?raw\\";\\nimport { pb } from \\"$scripts/pocketbase\\";\\nimport { onMount } from \\"svelte\\";\\nimport { serializeNonPOJOs, groupBy, setCookie, deleteCookie } from \\"$scripts/helpers\\";\\nimport { Textarea } from \\"$lib/components/ui/textarea\\";\\nimport ResponseMascot from \\"$lib/components/ResponseMascot.svelte\\";\\nimport CircleHelp from \\"lucide-svelte/icons/circle-help\\";\\nimport X from \\"lucide-svelte/icons/x\\";\\nimport { backgroundColor } from \\"$store/page\\";\\nimport { browser } from \\"$app/environment\\";\\nimport { user } from \\"$store/auth\\";\\nconst data = defaults(zod(lastStep));\\nlet feelings = [];\\nlet needs = [];\\nlet fight = void 0;\\nlet checkJudgement;\\nlet speechBubbleContentArray = [{ step: 1, content: [\\"\\"] }];\\nconst steps = [\\n  zod(schemaStep1),\\n  zod(schemaStep2),\\n  zod(schemaStep3),\\n  zod(schemaStep4),\\n  zod(schemaStep5),\\n  zod(schemaStep6),\\n  zod(schemaStep7),\\n  zod(schemaStep8),\\n  zod(schemaStep9),\\n  zod(schemaStep10),\\n  zod(schemaStep11),\\n  zod(lastStep)\\n];\\nlet step = 1;\\nlet formSubmitted = false;\\nlet formSuccess = false;\\nlet checkForJudgement = false;\\nlet drawerOpen = false;\\nconst updateBackgroundColor = (step2) => {\\n  const color = \`bg-\${stepConstructor[step2 - 1].slug}-background\`;\\n  backgroundColor.set(color);\\n  return color;\\n};\\n$: () => {\\n  console.log(\\"check step\\", step);\\n  if (step === 9) checkForJudgement = true;\\n};\\n$: options.validators = steps[step - 1];\\n$: currentBackgroundColor = updateBackgroundColor(step);\\nconst handleSubmit = async () => {\\n  try {\\n    let data2 = $formData;\\n    data2.fight = fight.id;\\n    console.log(\\"submit form\\", data2);\\n    const record = await pb.collection(\\"responses\\").create(data2);\\n    formSuccess = true;\\n    formSubmitted = true;\\n  } catch (err) {\\n    console.log(\\"error handling submit\\", err);\\n    formSuccess = false;\\n    formSubmitted = true;\\n  }\\n};\\nconst checkSingleValidationStep = async (step2) => {\\n  const validations = [schemaStep1, schemaStep2, schemaStep3, schemaStep4, lastStep];\\n  const constraints = Object.keys(zod(validations[step2 - 1]).constraints);\\n  let allFieldsValid = true;\\n  for (const constraint of constraints) {\\n    const res = await validate(constraint, { update: false });\\n    if (res) allFieldsValid = false;\\n  }\\n  if (!allFieldsValid) {\\n    return false;\\n  }\\n  return true;\\n};\\nconst checkValidation = async () => {\\n  const validationResult = await validateForm($formData, lastStep);\\n  if (!validationResult.valid) {\\n    errors.set(validationResult.errors);\\n    return false;\\n  }\\n  return true;\\n};\\nconst validateObservation = async () => {\\n  const validationResult = await validateForm(lastStep);\\n  const observationError = validationResult.errors.observation;\\n  if (observationError) {\\n    errors.set(validationResult.errors);\\n    return false;\\n  }\\n  disableJudgementCheck();\\n  return true;\\n};\\nconst disableJudgementCheck = () => {\\n  checkJudgement($formData.observation);\\n  checkForJudgement = false;\\n};\\nconst form = superForm(data, {\\n  // SPA: true,\\n  resetForm: false,\\n  validators: zodClient(lastStep),\\n  async onSubmit({ validators, cancel }) {\\n    console.log(\\"onSubmit\\");\\n    cancel();\\n    if (await checkValidation()) {\\n      if (step == steps.length) handleSubmit();\\n      else step++;\\n    }\\n  },\\n  async onUpdated({ form: form2 }) {\\n    console.log(\\"onUpdated\\");\\n    if (form2.valid) step = 1;\\n  }\\n});\\nconst {\\n  form: formData,\\n  errors,\\n  message,\\n  enhance,\\n  validate,\\n  validateForm,\\n  options,\\n  updateForm\\n} = form;\\nformData.subscribe((value) => {\\n  console.log(\\"form was updated\\", value);\\n});\\nlet stepConstructor = [\\n  {\\n    slug: \\"greeting\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.info\\"),\\n    icon: IconFolder,\\n    invertedTextColor: false,\\n    hidden: true\\n  },\\n  {\\n    slug: \\"disclaimer\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.info\\"),\\n    icon: IconFolder,\\n    invertedTextColor: false,\\n    hidden: true\\n  },\\n  {\\n    slug: \\"breathe\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.info\\"),\\n    icon: IconFolder,\\n    invertedTextColor: false,\\n    hidden: true\\n  },\\n  {\\n    slug: \\"observation\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.observation\\"),\\n    icon: IconEye,\\n    invertedTextColor: true,\\n    hidden: true\\n  },\\n  {\\n    slug: \\"feelings\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.feelings\\"),\\n    icon: IconHeart,\\n    invertedTextColor: false,\\n    hidden: true\\n  },\\n  {\\n    slug: \\"needs\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.needs\\"),\\n    icon: IconSwirl,\\n    invertedTextColor: false,\\n    hidden: true\\n  },\\n  {\\n    slug: \\"request\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.request\\"),\\n    icon: IconSteps,\\n    invertedTextColor: false,\\n    hidden: true\\n  },\\n  {\\n    slug: \\"pause\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.observation\\"),\\n    icon: IconEye,\\n    invertedTextColor: true,\\n    hidden: true\\n  },\\n  {\\n    slug: \\"observation\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.observation\\"),\\n    icon: IconEye,\\n    invertedTextColor: true\\n  },\\n  {\\n    slug: \\"feelings\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.feelings\\"),\\n    icon: IconHeart,\\n    invertedTextColor: false\\n  },\\n  {\\n    slug: \\"needs\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.needs\\"),\\n    icon: IconSwirl,\\n    invertedTextColor: false\\n  },\\n  {\\n    slug: \\"request\\",\\n    name: get(t)(\\"default.page.fights.form.general.steps.request\\"),\\n    icon: IconSteps,\\n    invertedTextColor: false\\n  }\\n];\\nt.subscribe((value) => {\\n  const newSteps = stepConstructor.map((entry) => {\\n    const translation = value(\`default.page.fights.form.general.steps.\${entry.slug}\`);\\n    entry.name = translation;\\n    return entry;\\n  });\\n  stepConstructor = [...newSteps];\\n});\\nconst decreaseStep = () => {\\n  console.log(\\"decreaseStep\\");\\n  if (step > 1) {\\n    console.log(\\"step\\", step);\\n    step = step - 1;\\n    console.log(\\"step\\", step);\\n  }\\n};\\nconst initFeelings = async () => {\\n  const records = await pb.collection(\\"feelings\\").getFullList({\\n    sort: \\"category\\"\\n  });\\n  const data2 = serializeNonPOJOs(records);\\n  let res = groupBy(data2, \\"positive\\");\\n  res.map((entry) => {\\n    entry.content = groupBy(entry.content, \\"category\\");\\n    entry.content.map((category) => category.visible = false);\\n    return entry;\\n  });\\n  console.log(\\"res\\", res);\\n  feelings = res;\\n};\\nconst initNeeds = async () => {\\n  const records = await pb.collection(\\"needs\\").getFullList({\\n    sort: \\"category\\"\\n  });\\n  const data2 = serializeNonPOJOs(records);\\n  let res = groupBy(data2, \\"category\\");\\n  res.map((category) => category.visible = false);\\n  console.log(\\"res\\", res);\\n  needs = res;\\n};\\nconst initFight = async () => {\\n  const record = await pb.collection(\\"fights\\").getOne($page.params.id, {\\n    expand: \\"owner, feelings, needs\\"\\n  });\\n  fight = serializeNonPOJOs(record);\\n  console.log(\\"fight\\", fight);\\n};\\nconst changeStep = async (payload) => {\\n  console.log(\\"changeStep\\");\\n  const newStep = payload.detail.step;\\n  const targetStepIsValid = await checkSingleValidationStep(newStep);\\n  console.log(\\"targetStepIsValid\\", targetStepIsValid);\\n  if (targetStepIsValid) {\\n    step = newStep;\\n  }\\n};\\nconst toggleNeedsCatgeory = (feeling, category) => {\\n  if (feeling.nameEN !== category) return;\\n  const target = needs.find((entry) => entry.category === category);\\n  if (target) target.visible = !target.visible;\\n  needs = [...needs];\\n};\\nconst toggleFeelingsCatgeory = (feeling, category) => {\\n  if (feeling.nameEN !== category) return;\\n  const target0 = feelings[0].content.find((entry) => entry.category === category);\\n  const target1 = feelings[1].content.find((entry) => entry.category === category);\\n  if (target0) target0.visible = !target0.visible;\\n  if (target1) target1.visible = !target1.visible;\\n  feelings = [...feelings];\\n};\\nconst categoryIsVisible = (feeling, category) => {\\n  const feelingSlug = feeling.nameEN;\\n  const categorySlug = category.category;\\n  if (feelingSlug === categorySlug) return true;\\n  if (category.visible) return true;\\n  return false;\\n};\\nconst initSpeechBubbleContentArray = () => {\\n  speechBubbleContentArray = [\\n    {\\n      step: 1,\\n      content: [\\n        \`\${fight.expand.owner.firstName} \${$t(\\"default.page.respond.steps.greeting.heading\\")}. \${$t(\\"default.page.respond.steps.greeting.question\\")}\`\\n      ]\\n    },\\n    {\\n      step: 2,\\n      content: [\\n        \`\${$t(\\"default.page.respond.steps.disclaimer.heading\\")}: \${$t(\\"default.page.respond.steps.disclaimer.description\\")}\`\\n      ]\\n    },\\n    { step: 3, content: [\`\${$t(\\"default.page.respond.steps.breathe.heading\\")}\`] },\\n    {\\n      step: 4,\\n      content: [\\n        \`\${fight.expand.owner.firstName} \${$t(\\"default.page.respond.steps.ownerObservation.heading\\")}\`\\n      ]\\n    },\\n    {\\n      step: 5,\\n      content: [\\n        \`\${fight.expand.owner.firstName} \${$t(\\"default.page.respond.steps.ownerFeelings.heading\\")}\`\\n      ]\\n    },\\n    {\\n      step: 6,\\n      content: [\\n        \`\${fight.expand.owner.firstName} \${$t(\\"default.page.respond.steps.ownerNeeds.heading\\")}\`\\n      ]\\n    },\\n    {\\n      step: 7,\\n      content: [\\n        \`\${fight.expand.owner.firstName} \${$t(\\"default.page.respond.steps.ownerRequest.heading\\")}\`\\n      ]\\n    },\\n    { step: 8, content: [$t(\\"default.page.respond.steps.pause.heading\\")] },\\n    { step: 9, content: [$t(\\"default.page.fight.create.observation\\")] },\\n    { step: 10, content: [$t(\\"default.page.fight.create.feelings\\")] },\\n    { step: 11, content: [$t(\\"default.page.fight.create.needs\\")] },\\n    { step: 12, content: [$t(\\"default.page.fight.create.request\\")] },\\n    {\\n      step: 13,\\n      content: [$t(\\"default.page.respond.steps.success\\")],\\n      errorContent: [$t(\\"default.page.respond.steps.error\\")]\\n    }\\n  ];\\n};\\nonMount(async () => {\\n  await initFeelings();\\n  await initNeeds();\\n  await initFight();\\n  initSpeechBubbleContentArray();\\n  if (browser && $page.url) {\\n    const fightId = $page.params.id;\\n    if (fightId) {\\n      const openedFights = JSON.parse(localStorage.getItem(\\"openedFights\\") || \\"[]\\");\\n      if (!openedFights.includes(fightId)) {\\n        openedFights.push(fightId);\\n        localStorage.setItem(\\"openedFights\\", JSON.stringify(openedFights));\\n      }\\n    }\\n    if (!$user) {\\n      console.log(\\"setting cookie loginRedirectTarget\\");\\n      setCookie(\\"loginRedirectTarget\\", $page.url.pathname + $page.url.search, 0.1);\\n    } else {\\n      console.log(\\n        \\"deleting cookie loginRedirectTarget\\"\\n      );\\n      deleteCookie(\\"loginRedirectTarget\\");\\n    }\\n  }\\n});\\n<\/script>\\r\\n\\r\\n<!-- {#if $message}\\r\\n\\t<div class=\\"status\\" class:error={$page.status >= 400} class:success={$page.status == 200}>\\r\\n\\t\\t{$message}\\r\\n\\t</div>\\r\\n{/if} -->\\r\\n<div\\r\\n\\tclass=\\"flex flex-grow flex-col justify-between transition duration-500 {currentBackgroundColor} min-h-svh overflow-hidden dark:bg-background\\"\\r\\n>\\r\\n\\t<AppTopMenu />\\r\\n\\t<div class=\\"max-container relative flex flex-grow flex-col pb-40\\">\\r\\n\\t\\t<form\\r\\n\\t\\t\\ton:submit|preventDefault\\r\\n\\t\\t\\tuse:enhance\\r\\n\\t\\t\\tclass=\\"-mt-1 flex h-full flex-grow flex-col pb-[74px]\\"\\r\\n\\t\\t>\\r\\n\\t\\t\\t{#if !formSubmitted && !formSuccess}\\r\\n\\t\\t\\t\\t{#if step > 8}\\r\\n\\t\\t\\t\\t\\t<FormStepDisplay\\r\\n\\t\\t\\t\\t\\t\\ton:changeStep={changeStep}\\r\\n\\t\\t\\t\\t\\t\\t{step}\\r\\n\\t\\t\\t\\t\\t\\tsteps={stepConstructor}\\r\\n\\t\\t\\t\\t\\t\\tstepBackground={stepConstructor[step - 1].slug}\\r\\n\\t\\t\\t\\t\\t/>\\r\\n\\t\\t\\t\\t{/if}\\r\\n\\t\\t\\t\\t<ResponseMascot\\r\\n\\t\\t\\t\\t\\t{speechBubbleContentArray}\\r\\n\\t\\t\\t\\t\\t{step}\\r\\n\\t\\t\\t\\t\\tbind:checkJudgement\\r\\n\\t\\t\\t\\t\\tstepName={stepConstructor[step - 1].slug}\\r\\n\\t\\t\\t\\t\\t{formSuccess}\\r\\n\\t\\t\\t\\t/>\\r\\n\\t\\t\\t{/if}\\r\\n\\t\\t\\t{#if fight}\\r\\n\\t\\t\\t\\t{#key step}\\r\\n\\t\\t\\t\\t\\t{#if step === 1}\\r\\n\\t\\t\\t\\t\\t\\t<div\\r\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"form-content flex flex-col items-center justify-between pb-1 pt-10 text-center\\"\\r\\n\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div></div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<Button\\r\\n\\t\\t\\t\\t\\t\\t\\t\\ton:click={() => (drawerOpen = true)}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\tvariant=\\"ghost\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"mb-6 flex w-full items-center justify-start gap-2\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t><CircleHelp />\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{$t('default.page.respond.steps.greeting.explanationCta')}</Button\\r\\n\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if step === 2}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content flex flex-col items-center justify-center text-center\\"></div>\\r\\n\\t\\t\\t\\t\\t{:else if step === 3}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content flex items-center justify-center\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"relative my-40 flex flex-col text-center\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<span class=\\"relative z-10 -mb-2\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t{$t('default.page.respond.steps.breathe.heading')}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t</span>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"breathe\\"></div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"breathe2\\"></div>\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if step === 4}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"form-label pt-10\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{fight.expand.owner.firstName}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{$t('default.page.respond.steps.ownerObservation.heading')}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"rounded bg-white/10 px-4 py-3 shadow-xl\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{fight.observation}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if step === 5}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"form-label pt-10\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{fight.expand.owner.firstName}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{$t('default.page.respond.steps.ownerFeelings.heading')}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"flex flex-wrap items-center gap-2 pb-6\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{#each fight.expand.feelings as feeling}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"rounded-md bg-white/20 px-4 py-2 shadow-lg\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{$locale === 'de' ? feeling.nameDE : feeling.nameEN}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if step === 6}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"form-label pt-10\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{fight.expand.owner.firstName}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{$t('default.page.respond.steps.ownerNeeds.heading')}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"flex flex-wrap items-center gap-2 pb-6\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{#each fight.expand.needs as need}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"rounded-md bg-white/10 px-4 py-2 shadow-lg\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{$locale === 'de' ? need.nameDE : need.nameEN}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if step === 7}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"form-label pt-10\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{fight.expand.owner.firstName}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{$t('default.page.respond.steps.ownerRequest.heading')}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"rounded bg-white/10 px-4 py-3 pb-6 shadow-xl\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{fight.request}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if step === 8}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content flex items-center justify-center\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"flex max-w-[18em] flex-col gap-4 pb-6 text-center\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- {$t('default.page.respond.steps.pause.heading')} -->\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if step === 9}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<Form.Field {form} name=\\"observation\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.form.observation.label')}</Form.Label\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Textarea\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{...attrs}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:input={() => (checkForJudgement = true)}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tbind:value={$formData.observation}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"min-h-60\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t/>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t</Form.Control>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\r\\n\\t\\t\\t\\t\\t\\t\\t</Form.Field>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if step === 10}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<Form.Field {form} name=\\"feelings\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.form.feelings.label')}</Form.Label\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<ToggleGroup.Root\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"multiple\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{...attrs}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tbind:value={$formData.feelings}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"flex flex-col gap-4\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if feelings.length > 0}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each feelings as positive}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"text-{stepConstructor[step - 1]\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t.slug}-foreground mb-1 mt-3 flex items-center gap-3 text-xs\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{positive.category === 'true'\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? $t('default.page.fights.form.general.goodFeelings')\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: $t('default.page.fights.form.general.badFeelings')}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"border-b border-{stepConstructor[step - 1]\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t.slug}-foreground mr-2 flex-grow border-opacity-20\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t></div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"-mx-1 flex w-full flex-wrap justify-start transition-all\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each positive.content as category}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each category.content as feeling}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"button\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={toggleFeelingsCatgeory(feeling, category.category)}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"{categoryIsVisible(feeling, category) ||\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t$formData.feelings?.includes(feeling.id)\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? 'pointer-events-auto max-w-[1000px] p-1 opacity-100'\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'pointer-events-none m-0 max-w-0 p-0 opacity-0'} transition-all\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<ToggleGroup.Item\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tvalue={feeling.id}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"{feeling.nameEN === category.category\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? \`bg-white/40 font-bold dark:bg-muted\`\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'border border-white/40 dark:border-white/20'} max-w-[300px] py-0  text-black shadow hover:text-black data-[state=on]:bg-feelings-foreground data-[state=on]:text-white dark:text-white dark:data-[state=on]:bg-feelings-foreground\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{$locale === 'de' ? feeling.nameDE : feeling.nameEN}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</ToggleGroup.Item>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</button>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</ToggleGroup.Root>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t</Form.Control>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\r\\n\\t\\t\\t\\t\\t\\t\\t</Form.Field>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if step === 11}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<Form.Field {form} name=\\"needs\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.form.needs.label')}</Form.Label\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<ToggleGroup.Root\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"multiple\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{...attrs}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tbind:value={$formData.needs}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#if needs.length > 0}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"-m-1 flex w-full flex-wrap justify-start transition-all\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each needs as category}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{#each category.content as need}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<button\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ttype=\\"button\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\ton:click={toggleNeedsCatgeory(need, category.category)}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"{categoryIsVisible(need, category) ||\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t$formData.needs?.includes(need.id)\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? 'pointer-events-auto max-h-60 max-w-[1000px] p-1 opacity-100'\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'pointer-events-none m-0 max-h-0 max-w-0 p-0 opacity-0'} transition-all\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<ToggleGroup.Item\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tvalue={need.id}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"{need.nameEN === category.category\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t? \`bg-white/40 font-bold dark:bg-muted\`\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t: 'border border-white/40 dark:border-white/20'} max-w-[300px] py-0  text-black shadow hover:text-black data-[state=on]:bg-needs-foreground data-[state=on]:text-white dark:text-white dark:data-[state=on]:bg-needs-foreground\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{$locale === 'de' ? need.nameDE : need.nameEN}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</ToggleGroup.Item>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</button>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/each}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</ToggleGroup.Root>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t</Form.Control>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\r\\n\\t\\t\\t\\t\\t\\t\\t</Form.Field>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if !formSubmitted}\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<Form.Field {form} name=\\"request\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.Control let:attrs>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Form.Label class=\\"form-label\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.form.request.label')}</Form.Label\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Textarea {...attrs} bind:value={$formData.request} class=\\"min-h-60\\" />\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t</Form.Control>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<!-- <Form.Description>This is your public display name.</Form.Description> -->\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<Form.FieldErrors />\\r\\n\\t\\t\\t\\t\\t\\t\\t</Form.Field>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else if formSuccess}\\r\\n\\t\\t\\t\\t\\t<div class=\\"form-content\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"my-6\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{$t('default.page.respond.steps.success.heading')}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t{:else}\\r\\n\\t\\t\\t\\t\\t\\t{$t('default.page.respond.steps.error.heading')}\\r\\n\\t\\t\\t\\t\\t{/if}\\r\\n\\t\\t\\t\\t{/key}\\r\\n\\t\\t\\t{/if}\\r\\n\\t\\t\\t{#if !formSubmitted && !formSuccess}\\r\\n\\t\\t\\t\\t<AppBottomMenu>\\r\\n\\t\\t\\t\\t\\t<ResponseFormStepper\\r\\n\\t\\t\\t\\t\\t\\t{step}\\r\\n\\t\\t\\t\\t\\t\\t{checkForJudgement}\\r\\n\\t\\t\\t\\t\\t\\ton:validateObservation={validateObservation}\\r\\n\\t\\t\\t\\t\\t\\ton:disableJudgementCheck={disableJudgementCheck}\\r\\n\\t\\t\\t\\t\\t\\ton:toPrev={decreaseStep}\\r\\n\\t\\t\\t\\t\\t\\tprimaryButtonClass={\`bg-\${stepConstructor[step - 1].slug}-background\`}\\r\\n\\t\\t\\t\\t\\t\\tclass=\\"flex-shrink-0\\"\\r\\n\\t\\t\\t\\t\\t/>\\r\\n\\t\\t\\t\\t</AppBottomMenu>\\r\\n\\t\\t\\t{/if}\\r\\n\\t\\t</form>\\r\\n\\t</div>\\r\\n</div>\\r\\n\\r\\n<Drawer.Root bind:open={drawerOpen}>\\r\\n\\t<Drawer.Content class=\\"p-4\\">\\r\\n\\t\\t<Drawer.Header>\\r\\n\\t\\t\\t<div class=\\"flex items-center justify-between\\">\\r\\n\\t\\t\\t\\t<Drawer.Title>{$t('default.page.respond.explanationTitle')}</Drawer.Title>\\r\\n\\t\\t\\t\\t<!-- <Drawer.Description>This action cannot be undone.</Drawer.Description> -->\\r\\n\\t\\t\\t\\t<Drawer.Close>\\r\\n\\t\\t\\t\\t\\t<X class=\\"text-red-600\\" />\\r\\n\\t\\t\\t\\t</Drawer.Close>\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t</Drawer.Header>\\r\\n\\t\\t<p class=\\"mb-20 p-4\\">{$t('default.page.respond.explanation')}</p>\\r\\n\\t</Drawer.Content>\\r\\n</Drawer.Root>\\r\\n\\r\\n<style lang=\\"scss\\">:global(.form-label) {\\n  margin-bottom: 0.5rem;\\n  margin-top: 1rem;\\n  display: block;\\n  width: 100%;\\n  padding-bottom: 0.5rem;\\n  font-size: 1.25rem;\\n  line-height: 1.75rem;\\n  font-weight: 700;\\n  line-height: 1.25;\\n}\\n:global(.form-label):not([data-fs-error]):is(.dark *) {\\n  --tw-text-opacity: 1;\\n  color: hsl(var(--foreground) / var(--tw-text-opacity, 1));\\n}\\n\\n.breathe {\\n  animation: breathe 5s infinite alternate forwards;\\n}\\n.breathe:after {\\n  content: \\"\\";\\n  position: absolute;\\n  left: 50%;\\n  top: 50%;\\n  z-index: -10;\\n  height: 18rem;\\n  width: 18rem;\\n  --tw-translate-x: -50%;\\n  --tw-translate-y: -50%;\\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\\n  border-radius: 9999px;\\n  background-color: hsl(var(--muted) / 0.4);\\n}\\n\\n.breathe2 {\\n  animation: breathe 5s ease-in-out infinite alternate forwards;\\n  animation-delay: 1s;\\n}\\n.breathe2:after {\\n  content: \\"\\";\\n  position: absolute;\\n  left: 50%;\\n  top: 50%;\\n  z-index: -10;\\n  height: 10rem;\\n  width: 10rem;\\n  --tw-translate-x: -50%;\\n  --tw-translate-y: -50%;\\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\\n  border-radius: 9999px;\\n  --tw-bg-opacity: 1;\\n  background-color: hsl(var(--muted) / var(--tw-bg-opacity, 1));\\n}\\n\\n@keyframes breathe {\\n  0% {\\n    transform: scale(0.2);\\n    opacity: 0;\\n  }\\n  100% {\\n    transform: scale(1);\\n    opacity: 0.8;\\n  }\\n}</style>\\r\\n"],"names":[],"mappings":"AA8qB2B,WAAa,CACtC,aAAa,CAAE,MAAM,CACrB,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,KAAK,CACd,KAAK,CAAE,IAAI,CACX,cAAc,CAAE,MAAM,CACtB,SAAS,CAAE,OAAO,CAClB,WAAW,CAAE,OAAO,CACpB,WAAW,CAAE,GAAG,CAChB,WAAW,CAAE,IACf,CACQ,WAAY,KAAK,CAAC,aAAa,CAAC,CAAC,IAAI,KAAK,CAAC,CAAC,CAAE,CACpD,iBAAiB,CAAE,CAAC,CACpB,KAAK,CAAE,IAAI,IAAI,YAAY,CAAC,CAAC,CAAC,CAAC,IAAI,iBAAiB,CAAC,EAAE,CAAC,CAC1D,CAEA,uBAAS,CACP,SAAS,CAAE,sBAAO,CAAC,EAAE,CAAC,QAAQ,CAAC,SAAS,CAAC,QAC3C,CACA,uBAAQ,MAAO,CACb,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,KAAK,CACb,KAAK,CAAE,KAAK,CACZ,gBAAgB,CAAE,IAAI,CACtB,gBAAgB,CAAE,IAAI,CACtB,SAAS,CAAE,UAAU,IAAI,gBAAgB,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,CAAC,CAAC,OAAO,IAAI,WAAW,CAAC,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,CAAC,CAC/L,aAAa,CAAE,MAAM,CACrB,gBAAgB,CAAE,IAAI,IAAI,OAAO,CAAC,CAAC,CAAC,CAAC,GAAG,CAC1C,CAEA,wBAAU,CACR,SAAS,CAAE,sBAAO,CAAC,EAAE,CAAC,WAAW,CAAC,QAAQ,CAAC,SAAS,CAAC,QAAQ,CAC7D,eAAe,CAAE,EACnB,CACA,wBAAS,MAAO,CACd,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,GAAG,CAAE,GAAG,CACR,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,KAAK,CACb,KAAK,CAAE,KAAK,CACZ,gBAAgB,CAAE,IAAI,CACtB,gBAAgB,CAAE,IAAI,CACtB,SAAS,CAAE,UAAU,IAAI,gBAAgB,CAAC,CAAC,CAAC,IAAI,gBAAgB,CAAC,CAAC,CAAC,OAAO,IAAI,WAAW,CAAC,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,MAAM,IAAI,WAAW,CAAC,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,CAAC,CAAC,OAAO,IAAI,YAAY,CAAC,CAAC,CAC/L,aAAa,CAAE,MAAM,CACrB,eAAe,CAAE,CAAC,CAClB,gBAAgB,CAAE,IAAI,IAAI,OAAO,CAAC,CAAC,CAAC,CAAC,IAAI,eAAe,CAAC,EAAE,CAAC,CAC9D,CAEA,WAAW,sBAAQ,CACjB,EAAG,CACD,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,OAAO,CAAE,CACX,CACA,IAAK,CACH,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,OAAO,CAAE,GACX,CACF"}`
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
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => value);
  const data = defaults(zod(schemaStep12));
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
        if (step == steps.length) handleSubmit();
        else step++;
      }
    },
    async onUpdated({ form: form2 }) {
      console.log("onUpdated");
      if (form2.valid) step = 1;
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
      name: get_store_value(t)("default.page.fights.form.general.steps.info"),
      icon: IconFolder,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "disclaimer",
      name: get_store_value(t)("default.page.fights.form.general.steps.info"),
      icon: IconFolder,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "breathe",
      name: get_store_value(t)("default.page.fights.form.general.steps.info"),
      icon: IconFolder,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "observation",
      name: get_store_value(t)("default.page.fights.form.general.steps.observation"),
      icon: IconEye,
      invertedTextColor: true,
      hidden: true
    },
    {
      slug: "feelings",
      name: get_store_value(t)("default.page.fights.form.general.steps.feelings"),
      icon: IconHeart,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "needs",
      name: get_store_value(t)("default.page.fights.form.general.steps.needs"),
      icon: IconSwirl,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "request",
      name: get_store_value(t)("default.page.fights.form.general.steps.request"),
      icon: IconSteps,
      invertedTextColor: false,
      hidden: true
    },
    {
      slug: "pause",
      name: get_store_value(t)("default.page.fights.form.general.steps.observation"),
      icon: IconEye,
      invertedTextColor: true,
      hidden: true
    },
    {
      slug: "observation",
      name: get_store_value(t)("default.page.fights.form.general.steps.observation"),
      icon: IconEye,
      invertedTextColor: true
    },
    {
      slug: "feelings",
      name: get_store_value(t)("default.page.fights.form.general.steps.feelings"),
      icon: IconHeart,
      invertedTextColor: false
    },
    {
      slug: "needs",
      name: get_store_value(t)("default.page.fights.form.general.steps.needs"),
      icon: IconSwirl,
      invertedTextColor: false
    },
    {
      slug: "request",
      name: get_store_value(t)("default.page.fights.form.general.steps.request"),
      icon: IconSteps,
      invertedTextColor: false
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
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    options.validators = steps[step - 1];
    currentBackgroundColor = updateBackgroundColor(step);
    $$rendered = ` <div class="${"flex flex-grow flex-col justify-between transition duration-500 " + escape(currentBackgroundColor, true) + " min-h-svh overflow-hidden dark:bg-background svelte-15ze05s"}">${validate_component(AppTopMenu, "AppTopMenu").$$render($$result, {}, {}, {})} <div class="max-container relative flex flex-grow flex-col pb-40"><form class="-mt-1 flex h-full flex-grow flex-col pb-[74px]">${!formSubmitted && !formSuccess ? `${step > 8 ? `${validate_component(FormStepDisplay, "FormStepDisplay").$$render(
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
                      return `${validate_component(X, "X").$$render($$result, { class: "text-red-600" }, {}, {})}`;
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
export {
  Page as default
};
