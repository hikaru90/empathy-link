import { e as subscribe, g as get_store_value } from './exports-CLG2BRq1.js';
import { o as onDestroy } from './lifecycle-Dr9vL0LE.js';
import { c as create_ssr_component, v as validate_component } from './ssr-C1fln0Kh.js';
import { a as locale } from './translations-CVEYc68s.js';
import { S as Sonner_1 } from './simplebar-D4e1o1R9.js';
import './page-C8qygIqX.js';
import { S as SparklePill } from './SparklePill-pUbgiSQ9.js';
import './client-BGiBm9n9.js';
import 'simplebar';
import 'resize-observer-polyfill';
import { w as writable } from './index2-BL47qDlJ.js';
import posthog from 'posthog-js';
import './Toaster.svelte_svelte_type_style_lang-B9JrK1jS.js';
import 'tailwind-variants';
import './ssr2-BVSPLo1E.js';
import 'clsx';
import './utils2-CW1DFYkq.js';
import 'tailwind-merge';

const featureFlags = writable({});
const createPostHogStore = () => {
  const { subscribe: subscribe2, update } = writable({
    initialized: false
  });
  const init = (distinctID, featureFlags2) => {
  };
  const capture = (eventName, properties = {}) => {
    if (get_store_value({ subscribe: subscribe2 }).initialized) {
      posthog.capture(eventName, properties);
      return;
    }
  };
  const reloadFeatureFlags = () => {
    if (get_store_value({ subscribe: subscribe2 }).initialized) {
      posthog.reloadFeatureFlags();
      return;
    }
  };
  const getFeatureFlag = (flagKey) => {
    if (get_store_value({ subscribe: subscribe2 }).initialized) {
      const flagValue = posthog.getFeatureFlag(flagKey);
      featureFlags.update((flags) => ({ ...flags, [flagKey]: flagValue }));
      return;
    }
  };
  return {
    subscribe: subscribe2,
    init,
    capture,
    reloadFeatureFlags,
    getFeatureFlag
  };
};
const postHog = createPostHogStore();
const css = {
  code: '@font-face{font-family:"Inter Tight";src:url("$assets/fonts/InterTight-Regular.eot");src:local("Inter Tight Regular"), local("InterTight-Regular"), url("$assets/fonts/InterTight-Regular.eot?#iefix") format("embedded-opentype"), url("$assets/fonts/InterTight-Regular.woff2") format("woff2"), url("$assets/fonts/InterTight-Regular.woff") format("woff"), url("$assets/fonts/InterTight-Regular.ttf") format("truetype"), url("$assets/fonts/InterTight-Regular.svg#InterTight-Regular") format("svg");font-weight:semibold;font-style:normal;font-display:swap}@font-face{font-family:"Inter";src:url("$assets/fonts/subset-Inter-Regular.eot");src:local("Inter Regular"), local("Inter-Regular"), url("$assets/fonts/subset-Inter-Regular.eot?#iefix") format("embedded-opentype"), url("$assets/fonts/subset-Inter-Regular.woff2") format("woff2"), url("$assets/fonts/subset-Inter-Regular.woff") format("woff"), url("$assets/fonts/subset-Inter-Regular.ttf") format("truetype"), url("$assets/fonts/subset-Inter-Regular.svg#subset-Inter-Regular") format("svg");font-weight:normal;font-style:normal;font-display:swap}@font-face{font-family:"Inter";src:url("$assets/fonts/subset-Inter-Bold.eot");src:local("Inter Bold"), local("Inter-Bold"), url("$assets/fonts/subset-Inter-Bold.eot?#iefix") format("embedded-opentype"), url("$assets/fonts/subset-Inter-Bold.woff2") format("woff2"), url("$assets/fonts/subset-Inter-Bold.woff") format("woff"), url("$assets/fonts/subset-Inter-Bold.ttf") format("truetype"), url("$assets/fonts/subset-Inter-Bold.svg#subset-Inter-Bold") format("svg");font-weight:bold;font-style:normal;font-display:swap}.animate-bg-fast{animation-name:svelte-bm8fdj-slide;animation-duration:2s;animation-timing-function:linear;animation-iteration-count:infinite}.animate-bg{animation-name:svelte-bm8fdj-slide;animation-duration:10s;animation-timing-function:linear;animation-iteration-count:infinite}.animate-bg-hover-fast{animation-name:svelte-bm8fdj-slide;animation-duration:10s;animation-timing-function:linear;animation-iteration-count:infinite}.animate-bg-hover-fast:hover{animation-duration:2s}.animate-wobble{animation-name:svelte-bm8fdj-sparkle;animation-duration:1s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}@keyframes svelte-bm8fdj-slide{0%{background-position:0% 50%}100%{background-position:150% 50%}}@keyframes svelte-bm8fdj-sparkle{0%{opacity:0.2}100%{opacity:1}}.float{animation-name:svelte-bm8fdj-float;animation-duration:2s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}@keyframes svelte-bm8fdj-float{0%{transform:translateY(0)}100%{transform:translateY(-10px)}}html, body{scrollbar-gutter:auto;height:5rem}body{--tw-bg-opacity:1;background-color:rgb(0 0 0 / var(--tw-bg-opacity));transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:500ms}.max-container{margin-left:auto;margin-right:auto;width:100%;max-width:1200px;padding-left:1.25rem;padding-right:1.25rem}@media(min-width: 768px){.max-container{padding-left:4rem;padding-right:4rem}}.input-fade-right{--mask:linear-gradient(\n  	to bottom,\n  	rgba(0, 0, 0, 0) 0,\n  	rgba(0, 0, 0, 1) 3%,\n  	rgba(0, 0, 0, 1) 97%,\n  	rgba(0, 0, 0, 0) 100%\n  );-webkit-mask:var(--mask);mask:var(--mask)}',
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_locale;
  $$unsubscribe_locale = subscribe(locale, (value) => value);
  let { data } = $$props;
  featureFlags.set(data.featureFlags);
  postHog.init(data.posthogId, data.featureFlags);
  console.log("+layout.svelte - user:", data.user);
  onDestroy(() => {
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  $$unsubscribe_locale();
  return `<main id="scrollContainer" class="min-h-svh bg-background">${`<div class="flex items-center justify-center py-60">${validate_component(SparklePill, "SparklePill").$$render(
    $$result,
    {
      fast: true,
      class: "h-6 w-16 shadow-xl dark:shadow-gray-200/30"
    },
    {},
    {}
  )}</div>`}</main> ${validate_component(Sonner_1, "Toaster").$$render($$result, {}, {}, {})}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-D8e--HYD.js.map
