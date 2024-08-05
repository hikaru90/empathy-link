import { c as create_ssr_component, s as spread, g as escape_attribute_value, h as escape_object, a as add_attribute, e as escape, v as validate_component, f as each } from "../../chunks/ssr.js";
import "../../chunks/Avatar.svelte_svelte_type_style_lang.js";
import "../../chunks/page.js";
import { B as Button$1, M as Menu } from "../../chunks/Menu.js";
import { c as compute_rest_props, g as get_store_value, s as subscribe } from "../../chunks/utils.js";
import { t, a as locale } from "../../chunks/translations.js";
import { B as Button } from "../../chunks/index3.js";
import { b as backgroundImage } from "../../chunks/SparklePill.js";
import { I as IconFolder, a as IconEye, b as IconHeart, c as IconSwirl, d as IconSteps } from "../../chunks/icon-steps.js";
import "../../chunks/client.js";
import "clsx";
import { g as getContext } from "../../chunks/lifecycle.js";
import { c as cn } from "../../chunks/utils2.js";
const IconSelf = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="finger-print-outline">\n    <path class="cls-1" d="M17.53,4.78c-.08,0-.15-.02-.22-.06-3.23-1.82-7.18-1.82-10.41,0-.23.12-.51.04-.63-.19,0,0,0,0,0-.01-.12-.23-.04-.52.19-.66,3.5-1.97,7.78-1.98,11.29,0,.23.13.32.42.2.65-.07.17-.23.27-.41.28ZM4.15,9.88c-.1,0-.19-.03-.27-.09-.21-.16-.26-.46-.11-.68.89-1.33,2.1-2.42,3.51-3.17,3.02-1.57,6.62-1.58,9.64-.01,1.41.75,2.61,1.83,3.5,3.15.15.22.1.52-.11.68-.2.15-.49.11-.64-.09,0,0-.01-.02-.02-.02-.81-1.19-1.9-2.17-3.17-2.85-2.76-1.43-6.03-1.42-8.79.01-1.28.69-2.37,1.67-3.18,2.87-.07.13-.21.21-.37.2h0ZM10,21.59c-.13,0-.24-.05-.33-.15-.76-.75-1.4-1.61-1.88-2.56-.67-1.3-1.01-2.75-.98-4.21,0-2.92,2.37-5.29,5.29-5.29,2.92,0,5.29,2.37,5.29,5.29,0,.26-.21.47-.47.47s-.47-.21-.47-.47c-.05-2.41-2.04-4.32-4.45-4.26-2.33.05-4.21,1.93-4.26,4.26-.02,1.3.27,2.58.87,3.74.45.87,1.03,1.66,1.73,2.35.18.2.18.49,0,.69-.09.09-.21.14-.34.15ZM16.7,19.79c-1.03.03-2.05-.28-2.9-.86-1.39-.97-2.22-2.56-2.22-4.26-.01-.26.19-.48.45-.49s.48.19.49.45c0,.01,0,.03,0,.04,0,1.38.68,2.67,1.81,3.45.7.48,1.53.72,2.38.69.33,0,.65-.04.97-.1.25-.04.5.13.54.38,0,0,0,.01,0,.02.05.26-.12.51-.38.56-.37.07-.75.11-1.13.12h0ZM14.82,21.79s-.08,0-.12-.02c-3.24-.83-5.51-3.75-5.51-7.1,0-1.59,1.29-2.88,2.88-2.88,1.59,0,2.88,1.29,2.88,2.88.02,1.07.91,1.92,1.99,1.9,1.04-.02,1.88-.86,1.9-1.9-.04-3.7-3.08-6.67-6.78-6.63-2.65,0-5.06,1.52-6.18,3.91-.38.86-.57,1.78-.55,2.72,0,1.19.21,2.38.63,3.5.1.25-.02.52-.27.62,0,0,0,0,0,0-.24.09-.5-.03-.59-.26,0,0,0-.01,0-.02-.45-1.23-.68-2.53-.68-3.84-.02-1.08.2-2.15.64-3.15,1.8-3.87,6.4-5.55,10.27-3.74,2.68,1.25,4.42,3.92,4.47,6.88,0,1.59-1.29,2.88-2.88,2.88s-2.88-1.29-2.88-2.88c-.03-1.07-.93-1.92-2.01-1.88-1.03.03-1.85.86-1.88,1.88-.01,1.63.62,3.2,1.75,4.38.83.88,1.89,1.5,3.06,1.8.25.08.4.34.33.59-.04.21-.22.36-.44.37h0Z"/>\n  </g>\n</svg>';
const IconFight = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="Gruppe_159" data-name="Gruppe 159">\n    <g id="flash-outline">\n      <path class="cls-1" d="M9.97,19.34s-.09,0-.13-.01c-.31-.07-.51-.38-.44-.69l.98-5.4h-3.84c-.19,0-.37-.11-.45-.28s-.06-.38.06-.53L13.76,3.02h0c.13-.15.38-.25.56-.21.32.06.53.36.47.68l-.99,5.42h3.84c.19,0,.37.11.45.28s.06.38-.06.53l-7.6,9.4c-.09.12-.3.22-.45.22ZM10.39,18.8v.03s0-.02,0-.03ZM7.59,12.23h3.39c.15,0,.29.07.38.18.1.11.13.26.11.41l-.8,4.4,5.92-7.32h-3.39c-.15,0-.29-.07-.38-.18-.09-.11-.13-.26-.11-.41l.81-4.4-5.92,7.32ZM14.15,3.33h0,0Z"/>\n    </g>\n  </g>\n</svg>';
const IconFeedback = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="Pfad_52" data-name="Pfad 52">\n    <path class="cls-1" d="M12.49,20.75c-.3,0-.55-.25-.55-.55v-8.1H3.84c-.3,0-.55-.25-.55-.55s.25-.55.55-.55h8.1v-3.29c0-2.42,1.97-4.39,4.39-4.39s4.39,1.97,4.39,4.39-1.97,4.39-4.39,4.39h-3.29v8.1c0,.3-.25.55-.55.55ZM13.04,11h3.29c1.82,0,3.29-1.48,3.29-3.29s-1.48-3.29-3.29-3.29-3.29,1.48-3.29,3.29v3.29Z"/>\n  </g>\n  <g id="Pfad_53" data-name="Pfad 53">\n    <path class="cls-1" d="M6.73,14.93c-.13,0-.26-.05-.35-.15l-2.88-2.88c-.2-.2-.2-.51,0-.71l2.88-2.88c.2-.2.51-.2.71,0s.2.51,0,.71l-2.53,2.53,2.53,2.53c.2.2.2.51,0,.71-.1.1-.23.15-.35.15Z"/>\n  </g>\n</svg>';
const IconLearn = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="Pfad_62" data-name="Pfad 62">\n    <path class="cls-1" d="M18.21,17.39h.78c.23,0,.42-.19.42-.42V4.03c0-.23-.19-.42-.42-.42H6.65c-1.05,0-1.89.86-1.89,1.91v13.17s0,.06,0,.09c.1,1.02.96,1.8,1.99,1.8h12.24c.23,0,.42-.19.42-.42s-.19-.42-.42-.42h-.76c-.64-.01-1.16-.54-1.14-1.19.01-.62.5-1.12,1.12-1.14h0ZM5.61,5.51c0-.58.46-1.05,1.04-1.06h11.91v12.09h-.36l-11.45.04c-.41,0-.81.14-1.14.38V5.51ZM6.76,19.73c-.63.02-1.16-.48-1.18-1.11-.02-.63.48-1.16,1.11-1.18.02,0,.05,0,.07,0l9.78-.05c-.25.33-.39.74-.39,1.16,0,.42.14.83.39,1.17H6.76Z"/>\n  </g>\n</svg>';
const HeartFilled = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "size"]);
  let { color = "currentColor" } = $$props;
  let { size = 15 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `<svg${spread(
    [
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      { viewBox: "0 0 15 15" },
      { fill: "none" },
      { xmlns: "http://www.w3.org/2000/svg" },
      escape_object($$restProps)
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M1.35248 4.90532C1.35248 2.94498 2.936 1.35248 4.89346 1.35248C6.25769 1.35248 6.86058 1.92336 7.50002 2.93545C8.13946 1.92336 8.74235 1.35248 10.1066 1.35248C12.064 1.35248 13.6476 2.94498 13.6476 4.90532C13.6476 6.74041 12.6013 8.50508 11.4008 9.96927C10.2636 11.3562 8.92194 12.5508 8.00601 13.3664C7.94645 13.4194 7.88869 13.4709 7.83291 13.5206C7.64324 13.6899 7.3568 13.6899 7.16713 13.5206C7.11135 13.4709 7.05359 13.4194 6.99403 13.3664C6.0781 12.5508 4.73641 11.3562 3.59926 9.96927C2.39872 8.50508 1.35248 6.74041 1.35248 4.90532Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const HeartFilled$1 = HeartFilled;
const PaperPlane = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "size"]);
  let { color = "currentColor" } = $$props;
  let { size = 15 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `<svg${spread(
    [
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      { viewBox: "0 0 15 15" },
      { fill: "none" },
      { xmlns: "http://www.w3.org/2000/svg" },
      escape_object($$restProps)
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const PaperPlane$1 = PaperPlane;
const css$6 = {
  code: ":root{--duration:6s}.heart.svelte-gmmaq7{animation:svelte-gmmaq7-heart}.step5.svelte-gmmaq7{animation:svelte-gmmaq7-step5}.step4.svelte-gmmaq7{animation:svelte-gmmaq7-step4}.step3.svelte-gmmaq7{animation:svelte-gmmaq7-step3}.step2.svelte-gmmaq7{animation:svelte-gmmaq7-step2}.step1.svelte-gmmaq7{animation:svelte-gmmaq7-step1}.step1.svelte-gmmaq7,.step2.svelte-gmmaq7,.step3.svelte-gmmaq7,.step4.svelte-gmmaq7,.step5.svelte-gmmaq7,.heart.svelte-gmmaq7{animation-duration:var(--duration);animation-iteration-count:infinite;animation-fill-mode:forwards;animation-timing-function:ease-out}@keyframes svelte-gmmaq7-heart{0%,65%{opacity:0;transform:scale(0)}75%,90%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0)}}@keyframes svelte-gmmaq7-step5{0%,27.5%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity));opacity:0;transform:scale(0)}35%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity));opacity:1;transform:scale(1)}40%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity))}40.1%{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}50%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity))}55%{opacity:0}100%{opacity:0}}@keyframes svelte-gmmaq7-step4{0%,22.5%{transform:scale(0);opacity:0}30%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}@keyframes svelte-gmmaq7-step3{0%,17.5%{transform:scale(0);opacity:0}25%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}@keyframes svelte-gmmaq7-step2{0%,12.5%{transform:scale(0);opacity:0}20%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}@keyframes svelte-gmmaq7-step1{0%,10%{transform:scale(0);opacity:0}15%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}.pop-in.svelte-gmmaq7{animation:svelte-gmmaq7-popIn;animation-duration:var(--duration);animation-iteration-count:infinite;animation-fill-mode:forwards}@keyframes svelte-gmmaq7-popIn{0%{opacity:0;transform:translate(0, 0)}10%{opacity:1;transform:translate(0, 8em)}15%{opacity:0;transform:translate(0, 8em)}55%{opacity:0}65%{opacity:1}70%{opacity:0}100%{opacity:0;transform:translate(0, 8em)}}",
  map: null
};
const HeroAnimation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let menuItems = [
    {
      slug: "home",
      name: get_store_value(t)("default.menu.bar.home"),
      path: "/dashboard",
      icon: IconFolder,
      available: true
    },
    {
      slug: "selfempathy",
      name: get_store_value(t)("default.menu.bar.selfempathy"),
      path: "/selfempathy",
      icon: IconSelf,
      available: false
    },
    {
      slug: "fights",
      name: get_store_value(t)("default.menu.bar.fights"),
      path: "/fights",
      icon: IconFight,
      available: true
    },
    {
      slug: "feedback",
      name: get_store_value(t)("default.menu.bar.feedback"),
      path: "/feedback",
      icon: IconFeedback,
      available: false
    },
    {
      slug: "learn",
      name: get_store_value(t)("default.menu.bar.learn"),
      path: "/learn",
      icon: IconLearn,
      available: false
    }
  ];
  t.subscribe((value) => {
    const newMenuItems = menuItems.map((entry) => {
      const translation = value(`default.menu.bar.${entry.slug}`);
      entry.name = translation;
      return entry;
    });
    menuItems = [...newMenuItems];
  });
  $$result.css.add(css$6);
  return `<div class="relative h-full w-full bg-slate-800 p-2 sm:p-3 text-[8px] sm:text-base"><div class="absolute left-1/2 top-1.5 sm:top-3 transform -translate-x-1/2 -translate-y-1/2 w-5 sm:w-14 h-1.5 sm:h-4 bg-black rounded-full flex items-center justify-end px-[4px] pt-[2px]" data-svelte-h="svelte-o4dwok"><img src="phone-lens.jpg" alt="Phone Lens" class="w-1 h-1 sm:w-3 sm:h-3 rounded-full"></div> <div class="pop-in svelte-gmmaq7" data-svelte-h="svelte-cc3p9f"><div class="flex items-center justify-center"><div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}" class="animate-bg-fast flex h-1 w-2 sm:h-3 sm:w-6 flex-col items-center justify-center rounded-md"></div></div></div> <div class="relative flex h-full flex-col justify-between sm:pb-[50px]"><div class="flex flex-col gap-px sm:gap-1"><div class="step1 flex items-center justify-center rounded-sm bg-observation-background p-[0.3em] shadow-lg svelte-gmmaq7"><div class="w-[2em] fill-observation-foreground"><!-- HTML_TAG_START -->${IconEye}<!-- HTML_TAG_END --></div></div> <div class="step2 flex items-center justify-center rounded-sm bg-feelings-background p-[0.3em] shadow-lg svelte-gmmaq7"><div class="w-[2em] fill-feelings-foreground"><!-- HTML_TAG_START -->${IconHeart}<!-- HTML_TAG_END --></div></div> <div class="step3 flex items-center justify-center rounded-sm bg-needs-background p-[0.3em] shadow-lg svelte-gmmaq7"><div class="w-[2em] fill-needs-foreground"><!-- HTML_TAG_START -->${IconSwirl}<!-- HTML_TAG_END --></div></div> <div class="step4 flex items-center justify-center rounded-sm bg-request-background p-[0.3em] shadow-lg svelte-gmmaq7"><div class="w-[2em] fill-request-foreground"><!-- HTML_TAG_START -->${IconSteps}<!-- HTML_TAG_END --></div></div></div> <div class="step5 flex items-center justify-center rounded p-[0.2em] shadow-lg svelte-gmmaq7"><div class="flex w-full items-center justify-between fill-observation-foreground"><div class="h-[0.5em] w-[3em] rounded bg-slate-600"></div> ${validate_component(PaperPlane$1, "PaperPlane").$$render($$result, { class: "text-slate-500" }, {}, {})}</div></div> <div class="absolute w-full h-full flex items-center justify-center pb-16"><div class="heart svelte-gmmaq7">${validate_component(HeartFilled$1, "HeartFilled").$$render($$result, { class: "w-[4em] h-[4em] text-red-400" }, {}, {})}</div></div></div> <div class="fixed bottom-0 left-0 z-40 w-full bg-black px-1 sm:px-2 pb-1 sm:pb-4 pt-1 text-gray-200"><div class="absolute left-0 top-0 h-[0.5px] w-full -translate-y-full transform bg-black"></div> <div class="flex items-center justify-around">${each(menuItems, (item) => {
    return `<div class="relative flex flex-col items-center justify-center"><a${add_attribute("href", item.path, 0)} class="flex flex-col items-center justify-center"><div class="h-1.5 w-1.5 sm:h-3 sm:w-3 fill-white"><!-- HTML_TAG_START -->${item.icon}<!-- HTML_TAG_END --> </div></a> </div>`;
  })}</div></div> </div>`;
});
const css$5 = {
  code: ".animate-icon4-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:4s;animation-delay:400ms;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-icon3-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:4s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-icon2-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:3s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-icon1-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:2s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-phone-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:1s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}@keyframes svelte-1aoqqap-phonePulse{0%{opacity:0}100%{opacity:1}}",
  map: null
};
const AnimatedHeroBig = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let animationWidth = 1e3;
  $$result.css.add(css$5);
  $$unsubscribe_t();
  return `<div class="pt-20 lg:-mb-20 lg:pt-32"><h1 class="mb-10 max-w-[14em] font-display text-4xl md:text-5xl font-semibold leading-[106%] lg:text-7xl">${escape($t("default.page.home.hero"))}</h1> <a href="/auth/login">${validate_component(Button, "SparkleButton").$$render(
    $$result,
    {
      class: "px-3 py-5 font-bold text-black shadow-lg dark:shadow-gray-300/30 lg:px-6 lg:py-7 lg:text-lg"
    },
    {},
    {
      default: () => {
        return `${escape($t("default.page.home.cta"))}`;
      }
    }
  )}</a></div> <div class="py-4 -mx-[40%] -mb-48 md:-mb-[20%] md:-mx-[10%]"><div id="animation" class="relative w-full lg:mb-40"><div style="${"border-radius: " + escape(animationWidth / 75, true) + "px;"}" class="absolute left-[45.05%] top-[15.5%] z-[60] h-[48.8%] w-[9.9%] skew-y-[32deg] transform overflow-hidden">${validate_component(HeroAnimation, "HeroAnimation").$$render($$result, {}, {}, {})}</div> <img src="hero/phone_mobile.png" alt="" class="relative z-40 block w-full md:hidden"> <img src="hero/2phone.png" alt="" class="relative z-40 hidden w-full md:block"> <img src="hero/2phone_lit.png" alt="" class="animate-phone-pulse absolute left-0 top-0 z-50 hidden h-full w-full md:block"> <img src="hero/icon1.png" alt="" class="absolute left-0 top-0 hidden h-full w-full md:block"> <img src="hero/icon1_lit.png" alt="" class="animate-icon1-pulse absolute left-0 top-0 hidden h-full w-full md:block"> <img src="hero/icon2.png" alt="" class="absolute left-0 top-0 hidden h-full w-full md:block"> <img src="hero/icon2_lit.png" alt="" class="animate-icon2-pulse absolute left-0 top-0 hidden h-full w-full md:block"> <img src="hero/icon4.png" alt="" class="absolute left-0 top-0 hidden h-full w-full md:block"> <img src="hero/icon4_lit.png" alt="" class="animate-icon4-pulse absolute left-0 top-0 hidden h-full w-full md:block"> <img src="hero/icon3.png" alt="" class="absolute left-0 top-0 hidden h-full w-full md:block"> <img src="hero/icon3_lit.png" alt="" class="animate-icon3-pulse absolute left-0 top-0 hidden h-full w-full md:block"></div> </div>`;
});
const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["size", "role", "color", "ariaLabel", "withEvents"]);
  const ctx = getContext("iconCtx") ?? {};
  let { size = ctx.size || "24" } = $$props;
  let { role = ctx.role || "img" } = $$props;
  let { color = ctx.color || "currentColor" } = $$props;
  let { ariaLabel = "plus," } = $$props;
  let { withEvents = false } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.role === void 0 && $$bindings.role && role !== void 0)
    $$bindings.role(role);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
    $$bindings.ariaLabel(ariaLabel);
  if ($$props.withEvents === void 0 && $$bindings.withEvents && withEvents !== void 0)
    $$bindings.withEvents(withEvents);
  return `${withEvents ? `<svg${spread(
    [
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor"></path></svg>` : `<svg${spread(
    [
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      escape_object($$restProps),
      { role: escape_attribute_value(role) },
      {
        "aria-label": escape_attribute_value(ariaLabel)
      },
      { viewBox: "0 0 15 15" },
      { fill: escape_attribute_value(color) },
      { xmlns: "http://www.w3.org/2000/svg" }
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor"></path></svg>`} `;
});
const css$4 = {
  code: ".skeumorphic-button.svelte-5cv73o{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: null
};
const The4Steps = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cards;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$result.css.add(css$4);
  cards = [
    {
      heading: $t("default.page.home.components.the4steps.steps.observation.heading"),
      color: "observation-foreground",
      backgroundColor: "observation-background",
      icon: IconEye,
      text: $t("default.page.home.components.the4steps.steps.observation.text")
    },
    {
      heading: $t("default.page.home.components.the4steps.steps.feelings.heading"),
      color: "feelings-foreground",
      backgroundColor: "feelings-background",
      icon: IconHeart,
      text: $t("default.page.home.components.the4steps.steps.feelings.text")
    },
    {
      heading: $t("default.page.home.components.the4steps.steps.needs.heading"),
      color: "needs-foreground",
      backgroundColor: "needs-background",
      icon: IconSwirl,
      text: $t("default.page.home.components.the4steps.steps.needs.text")
    },
    {
      heading: $t("default.page.home.components.the4steps.steps.request.heading"),
      color: "request-foreground",
      backgroundColor: "request-background",
      icon: IconSteps,
      text: $t("default.page.home.components.the4steps.steps.request.text")
    }
  ];
  $$unsubscribe_t();
  return `<div class="flex flex-col items-center mb-40 pt-12 md:pt-0"><h2 class="mb-16 md:mb:20 max-w-[13em] text-center font-display text-3xl md:text-4xl font-semibold lg:text-5xl">${escape($t("default.page.home.components.the4steps.heading"))}</h2> <div class="relative mb-16 md:mb:20"><div class="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" data-svelte-h="svelte-ztm4yv"><img src="/connector.svg" alt="connector" class="w-28"></div> <div class="-m-4 flex flex-wrap items-stretch justify-center">${each(cards, (card) => {
    return `<div class="group relative h-64 md:h-72 w-full px-4 py-3 md:py-4 md:w-1/2 md:max-w-[460px]"><div class="absolute left-full top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-first:md:block"></div> <div class="absolute left-0 top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-last:md:block"></div> <div class="flex h-full flex-col justify-between rounded-3xl bg-white p-5 md:p-6 lg:p-8 shadow-lg"><div><div class="skeumorphic-button mb-2 md:mb-3 lg:mb-4 h-9 w-9 rounded-full bg-offwhite p-0.5 svelte-5cv73o"><div class="${"bg-" + escape(card.backgroundColor, true) + " fill-" + escape(card.color, true) + " flex items-center justify-center rounded-full p-1 shadow-inner svelte-5cv73o"}"><!-- HTML_TAG_START -->${card.icon}<!-- HTML_TAG_END --> </div></div> <h3 class="mb-6 font-display text-xl font-semibold md:text-2xl">${escape(card.heading)} </h3></div> <div class="flex"><p class="">${escape(card.text)}</p> <div class="flex items-end"><div class="ml-2 lg:ml-10 flex w-6 h-6 lg:h-8 lg:w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-offwhite shadow-md">${validate_component(Plus, "IconPlus").$$render($$result, {}, {}, {})} </div></div> </div></div> </div>`;
  })}</div></div> <div class="flex items-center justify-center">${validate_component(Button$1, "Button").$$render(
    $$result,
    {
      variant: "outline",
      class: "bg-transparent border-2 border-black/60 text-base"
    },
    {},
    {
      default: () => {
        return `${escape($t("default.page.home.components.the4steps.cta.text"))}`;
      }
    }
  )}</div> </div>`;
});
const Modules = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let modules;
  let $t, $$unsubscribe_t;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  modules = [
    {
      heading: $t("default.page.home.components.modules.modules.selfempathy"),
      icon: IconSelf,
      delayed: false
    },
    {
      heading: $t("default.page.home.components.modules.modules.fight"),
      icon: IconFight,
      delayed: false
    },
    {
      heading: $t("default.page.home.components.modules.modules.feedback"),
      icon: IconFeedback,
      delayed: true
    },
    {
      heading: $t("default.page.home.components.modules.modules.learn"),
      icon: IconLearn,
      delayed: true
    }
  ];
  $$unsubscribe_t();
  $$unsubscribe_locale();
  return `<div class="mb-40 flex flex-col items-center"><h2 class="mb-16 md:mb:20 max-w-[19em] text-center font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.modules.heading"))}</h2> <div class="relative"><div class="relative flex flex-row flex-wrap justify-center gap-4">${each(modules, (module) => {
    return `<div class="group relative flex items-center justify-center rounded-[36px] bg-white p-3 md:p-4 lg:p-6 text-sm shadow-xl md:w-auto"><div class="absolute left-full top-1/2 hidden h-1 w-4 -translate-y-1/2 transform bg-black/90 md:block group-last:md:hidden"></div> <div class="flex size-[100px] md:size-[120px] lg:size-[140px] flex-shrink-0 flex-col items-center justify-between rounded-3xl bg-black p-2 lg:p-4 text-offwhite shadow-xl"><div></div> <div class="flex w-16 h-16 lg:h-20 lg:w-20 flex-shrink-0 items-center justify-center rounded-full fill-offwhite/90 p-1 shadow-inner"><!-- HTML_TAG_START -->${module.icon}<!-- HTML_TAG_END --></div> <div class="relative">${module.delayed ? `<div class="absolute right-4 top-0.5 -translate-y-full translate-x-full transform rounded-full bg-red-500 px-2 py-0.5 text-xs">${escape($locale == "en" ? "soon" : "bald")} </div>` : ``} <span class="text-[10px] md:text-xs">${escape(module.heading)}</span> </div></div> </div>`;
  })}</div></div> </div>`;
});
const PhoneMockup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  let { mockup } = $$props;
  let { color } = $$props;
  let { inverted = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.mockup === void 0 && $$bindings.mockup && mockup !== void 0)
    $$bindings.mockup(mockup);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.inverted === void 0 && $$bindings.inverted && inverted !== void 0)
    $$bindings.inverted(inverted);
  return `<div${add_attribute("class", cn("flex items-center justify-center relative", className), 0)}><img src="phone_frontal.png" alt="Phone Mockup" class=""> <div class="bg-black bg-contain bg-bottom bg-no-repeat absolute w-[calc(100%-20px)] h-[calc(100%-20px)] rounded-[35px] transform translate-y-1px z-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]"></div> <div style="${"background-image: url('" + escape(mockup, true) + "')"}" class="${"bg-contain bg-bottom bg-no-repeat absolute w-[calc(100%-30px)] h-[calc(100%-30px)] " + escape(color, true) + " rounded-[26px] sm:rounded-[30px] md:rounded-[35px] transform translate-y-1px"}"><div class="relative"><div class="absolute top-0 left-0 z-10 w-full flex items-center justify-between px-6 py-3"><span class="${"text-[9px] font-bold " + escape(inverted ? "text-white" : "text-black", true)}">09:46</span> <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 sm:w-20 h-5 sm:h-6 bg-black rounded-full flex items-center justify-end px-[4px] pt-[2px]" data-svelte-h="svelte-1er9dk7"><img src="phone-lens.jpg" alt="Phone Lens" class="w-4 h-4 rounded-full"></div> <img${add_attribute(
    "src",
    inverted ? "phone-icons-inverted.svg" : "phone-icons.svg",
    0
  )} alt="Phone Icons" class="h-1.5 sm:h-2"></div></div></div></div>`;
});
const css$3 = {
  code: ".skeumorphic-button.svelte-5cv73o{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: null
};
const Selfempathy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let moduleName = void 0;
  locale.subscribe((value) => {
    moduleName = value === "en" ? "Module" : "Modul";
  });
  $$result.css.add(css$3);
  $$unsubscribe_t();
  return `<div class="flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-20 mb-40"><div class="flex flex-col items-center justify-center"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite p-1 svelte-5cv73o"><div class="bg-black fill-offwhite flex items-center justify-center rounded-full p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconSelf}<!-- HTML_TAG_END --></div></div> <div class="text-slate-500 mb-3 ml-0.5">1. ${escape(moduleName)}</div> <h2 class="font-display text-2xl font-semibold lg:text-4xl mb-8">${escape($t("default.page.home.components.selfempathy.heading"))}</h2> <p class="max-w-md">${escape($t("default.page.home.components.selfempathy.description"))}</p></div> <div class="relative flex">${validate_component(PhoneMockup, "PhoneMockup").$$render(
    $$result,
    {
      mockup: "screenshot-fight2.png",
      color: "bg-observation-background",
      inverted: true,
      class: "w-50 md:w-72"
    },
    {},
    {}
  )} ${validate_component(PhoneMockup, "PhoneMockup").$$render(
    $$result,
    {
      mockup: "screenshot-dashboard.png",
      color: "bg-offwhite",
      class: "w-50 md:w-72 -ml-36"
    },
    {},
    {}
  )}</div> </div>`;
});
const css$2 = {
  code: '.skeumorphic-button.svelte-ac5ap2{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}.label.svelte-ac5ap2{box-shadow:-4px -4px 8px 0 white;position:relative;height:1.25rem;width:1.25rem;flex-shrink:0;border-radius:9999px;border-width:1px;--tw-border-opacity:1;border-color:rgb(255 255 255 / var(--tw-border-opacity))}.label.svelte-ac5ap2:after{content:"";box-shadow:4px 4px 8px 0 rgba(0, 0, 0, 0.4);display:block;height:100%;width:100%;border-radius:9999px}.icon.svelte-ac5ap2{position:absolute;left:50%;top:50%;height:0.875rem;width:0.875rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.card-root{box-shadow:-5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1)}.need.svelte-ac5ap2{position:relative;z-index:10;display:inline}.need.svelte-ac5ap2:before{content:"";position:absolute;left:0px;top:0px;height:100%;width:100%;z-index:-1}',
  map: null
};
const Fight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tableRows;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let moduleName = void 0;
  locale.subscribe((value) => {
    moduleName = value === "en" ? "Module" : "Modul";
  });
  $$result.css.add(css$2);
  tableRows = [
    {
      icon: IconEye,
      color: "observation",
      type: "text",
      content: $t("default.page.home.components.fight.steps.observation")
    },
    {
      icon: IconHeart,
      color: "feelings",
      type: "array",
      content: $t("default.page.home.components.fight.steps.feelings")
    },
    {
      icon: IconSwirl,
      color: "needs",
      type: "array",
      content: $t("default.page.home.components.fight.steps.needs")
    },
    {
      icon: IconSteps,
      color: "request",
      type: "text",
      content: $t("default.page.home.components.fight.steps.request")
    }
  ];
  $$unsubscribe_t();
  return `<div class="mb-32"><div class="flex flex-col items-center"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite p-1 svelte-ac5ap2"><div class="flex items-center justify-center rounded-full bg-black fill-offwhite p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconFight}<!-- HTML_TAG_END --></div></div> <div class="mb-3 ml-0.5 text-slate-500">2. ${escape(moduleName)}</div> <h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.fight.heading"))}</h2></div> <div class="relative flex flex-col items-center justify-start gap-4 lg:mt-24 lg:flex-row lg:items-stretch lg:justify-center lg:gap-10"><div class="absolute left-1/2 top-[90px] hidden h-40 w-full -translate-x-1/2 -translate-y-full transform rounded-full border-4 border-black lg:block" data-svelte-h="svelte-sr86zg"><div class="hidden lg:block absolute left-1/2 -top-[2px] -translate-y-1/2 transform"><div class="h-4 w-4 rotate-45 transform border-l-4 border-b-4 border-black"></div></div></div> <div class="relative z-0"><div class="hidden lg:block absolute left-0 top-[88px] -ml-8 -translate-y-1/2 transform" data-svelte-h="svelte-1sp5qq2"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black"></div></div> <div class="relative w-full md:w-52 overflow-hidden rounded-lg shadow-xl shadow-black/5">${each(tableRows, (row) => {
    return `<div class="group flex items-stretch border-b border-black/5 bg-white text-xs shadow-md last:border-b-0"><div class="flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3"><div class="${"label bg-" + escape(row.color, true) + "-background svelte-ac5ap2"}"><div class="${"icon fill-" + escape(row.color, true) + "-foreground svelte-ac5ap2"}"><!-- HTML_TAG_START -->${row.icon}<!-- HTML_TAG_END --></div> </div></div> <div class="flex-grow break-all px-3 pb-3 pt-4">${escape(row.content)}</div> </div>`;
  })}</div> <p class="w-full md:w-52 py-4" data-svelte-h="svelte-n3xnjn">Du notierst Deine Beobachtung, Gefühle, Bedürfnisse und Bitten</p></div> <div class="relative z-0" data-svelte-h="svelte-19zfi6m"><div class="hidden lg:block absolute left-0 top-[88px] -ml-8 -translate-y-1/2 transform"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black"></div></div> <div class="hidden lg:block absolute right-0 top-[88px] -mr-6 -translate-y-1/2 transform"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black"></div></div> <div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}"${add_attribute("class", "shadow-black-5 flex h-[178.22px] w-full md:w-52 items-center justify-center rounded-lg bg-center bg-repeat-x shadow-xl", 0)}><div class="h-8 w-20 rounded-full border-4 border-white"></div></div> <p class="w-full md:w-52 py-4">Wir generieren einen Empathie-Link, den Du Deiner/m Streitpartner*in schickst</p></div> <div class="relative z-0"><div class="hidden lg:block absolute right-0 top-[88px] -mr-6 -translate-y-1/2 transform" data-svelte-h="svelte-3ljk9j"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black"></div></div> <div class="w-full md:w-52 overflow-hidden rounded-lg shadow-xl shadow-black/5">${each(tableRows, (row) => {
    return `<div class="group flex items-stretch border-b border-black/5 bg-white text-xs shadow-md last:border-b-0"><div class="flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3"><div class="${"label bg-" + escape(row.color, true) + "-background svelte-ac5ap2"}"><div class="${"icon fill-" + escape(row.color, true) + "-foreground svelte-ac5ap2"}"><!-- HTML_TAG_START -->${row.icon}<!-- HTML_TAG_END --></div> </div></div> <div class="flex-grow break-all px-3 pb-3 pt-4">${escape(row.content)}</div> </div>`;
  })}</div> <p class="w-full md:w-52 py-4" data-svelte-h="svelte-1tm7nl">Dein/e Streitpartner*in kann sich in Ruhe mit Deiner Sicht der Dinge auseinandersetzen und
				antwortet dann</p></div></div> </div>`;
});
const css$1 = {
  code: '.skeumorphic-button.svelte-ac5ap2{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}.label.svelte-ac5ap2{box-shadow:-4px -4px 8px 0 white;position:relative;height:1.25rem;width:1.25rem;flex-shrink:0;border-radius:9999px;border-width:1px;--tw-border-opacity:1;border-color:rgb(255 255 255 / var(--tw-border-opacity))}.label.svelte-ac5ap2:after{content:"";box-shadow:4px 4px 8px 0 rgba(0, 0, 0, 0.4);display:block;height:100%;width:100%;border-radius:9999px}.icon.svelte-ac5ap2{position:absolute;left:50%;top:50%;height:0.875rem;width:0.875rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.card-root{box-shadow:-5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1)}.need.svelte-ac5ap2{position:relative;z-index:10;display:inline}.need.svelte-ac5ap2:before{content:"";position:absolute;left:0px;top:0px;height:100%;width:100%;z-index:-1}',
  map: null
};
const Feedback = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tableRows;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let moduleName = void 0;
  locale.subscribe((value) => {
    moduleName = value === "en" ? "Module" : "Modul";
  });
  $$result.css.add(css$1);
  tableRows = [
    {
      icon: IconEye,
      color: "observation",
      type: "text",
      content: $t("default.page.home.components.feedback.steps.observation")
    },
    {
      icon: IconHeart,
      color: "feelings",
      type: "array",
      content: $t("default.page.home.components.feedback.steps.feelings")
    },
    {
      icon: IconSwirl,
      color: "needs",
      type: "array",
      content: $t("default.page.home.components.feedback.steps.needs")
    },
    {
      icon: IconSteps,
      color: "request",
      type: "text",
      content: $t("default.page.home.components.feedback.steps.request")
    }
  ];
  $$unsubscribe_t();
  return `<div class="mb-40"><div class="flex flex-col items-center"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite p-1 svelte-ac5ap2"><div class="flex items-center justify-center rounded-full bg-black fill-offwhite p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconFeedback}<!-- HTML_TAG_END --></div></div> <div class="mb-3 ml-0.5 text-slate-500">3. ${escape(moduleName)}</div> <div class="relative"><h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.feedback.heading"))}</h2> <div class="bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full">${escape($t("default.menu.soon"))}</div></div> <p class="max-w-md text-center mb-8">${escape($t("default.page.home.components.feedback.description"))}</p></div> <div class="relative flex flex-row flex-wrap justify-center -mx-3">${each(tableRows, (card) => {
    return `<div class="group relative p-3 text-sm w-full md:w-1/4 md:max-w-[460px]"><div class="absolute left-full -ml-3 top-1/2 hidden h-1 w-6 -translate-y-1/2 transform bg-black/90 md:block group-last:md:hidden"></div> <div class="group relative h-40 shadow-xl p-6 bg-white rounded-3xl"><div><div class="skeumorphic-button mb-8 h-9 w-9 rounded-full bg-offwhite p-0.5 svelte-ac5ap2"><div class="${"bg-" + escape(card.color, true) + "-background fill-" + escape(card.color, true) + "-foreground flex items-center justify-center rounded-full p-1 shadow-inner svelte-ac5ap2"}"><!-- HTML_TAG_START -->${card.icon}<!-- HTML_TAG_END --></div> </div></div> <div class="flex"><p class="">${escape(card.content)}</p> </div></div> </div>`;
  })}</div> </div>`;
});
const css = {
  code: ".skeumorphic-button.svelte-ac5ap2{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}.card-root{box-shadow:-5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1)}",
  map: null
};
const Learn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let moduleName = void 0;
  locale.subscribe((value) => {
    moduleName = value === "en" ? "Module" : "Modul";
  });
  $$result.css.add(css);
  [
    {
      icon: IconEye,
      color: "observation",
      type: "text",
      content: $t("default.page.home.components.feedback.steps.observation")
    },
    {
      icon: IconHeart,
      color: "feelings",
      type: "array",
      content: $t("default.page.home.components.feedback.steps.feelings")
    },
    {
      icon: IconSwirl,
      color: "needs",
      type: "array",
      content: $t("default.page.home.components.feedback.steps.needs")
    },
    {
      icon: IconSteps,
      color: "request",
      type: "text",
      content: $t("default.page.home.components.feedback.steps.request")
    }
  ];
  $$unsubscribe_t();
  return `<div class="mb-40"><div class="flex flex-col items-start"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite p-1 svelte-ac5ap2"><div class="flex items-center justify-center rounded-full bg-black fill-offwhite p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconLearn}<!-- HTML_TAG_END --></div></div> <div class="mb-3 ml-0.5 text-slate-500">4. ${escape(moduleName)}</div> <div class="relative"><h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.learn.heading"))}</h2> <div class="bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full">${escape($t("default.menu.soon"))}</div></div> <p class="max-w-md mb-8">${escape($t("default.page.home.components.learn.description"))}</p></div> </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  console.log("data", data);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="flex h-full flex-grow flex-col justify-between"><div class="flex-grow"><div class="absolute">${validate_component(Menu, "Menu").$$render($$result, {}, {}, {})}</div> <div class="mb-32 relative z-0"><div class="max-container">${validate_component(AnimatedHeroBig, "AnimatedHeroBig").$$render($$result, {}, {}, {})}</div></div> <div class="max-container pb-40 relative z-10 bg-offwhite">${validate_component(The4Steps, "The4Steps").$$render($$result, {}, {}, {})} ${validate_component(Modules, "Modules").$$render($$result, {}, {}, {})} ${validate_component(Selfempathy, "Selfempathy").$$render($$result, {}, {}, {})} ${validate_component(Fight, "Fight").$$render($$result, {}, {}, {})} ${validate_component(Feedback, "Feedback").$$render($$result, {}, {}, {})} ${validate_component(Learn, "Learn").$$render($$result, {}, {}, {})}</div></div></div>`;
});
export {
  Page as default
};
