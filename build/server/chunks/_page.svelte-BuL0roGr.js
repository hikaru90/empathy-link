import { e as subscribe, j as null_to_empty, f as compute_rest_props, g as get_store_value } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, v as validate_component, e as escape, b as each, a as add_attribute, s as spread, d as escape_attribute_value, f as escape_object } from './ssr-C1fln0Kh.js';
import { R as Root, C as Close } from './index3-BHwnx4G9.js';
import { b as backgroundColor, s as scroll, w as windowHeight, c as currentSection, a as windowWidth, d as derivedMode } from './page-C8qygIqX.js';
import { t as t2, a as locale } from './translations-CVEYc68s.js';
import 'clsx';
import { L as Logo, S as Sheet_content, a as Sheet_header, b as Sheet_title, B as Button$2, C as Cross1, R as Root$1, c as Select_trigger, V as Value, d as Select_content, e as Select_item, I as Input, f as Switch, g as Label } from './switch-rUCy8RtT.js';
import './client-BGiBm9n9.js';
import './auth-CaZN_opl.js';
import { B as Button$1 } from './index4-CpZrsxoR.js';
import { a as setCookie } from './helpers-D-BYfNSY.js';
import { B as Button } from './button-BuzP6sP8.js';
import { c as cn } from './utils2-CW1DFYkq.js';
import { b as backgroundImage } from './SparklePill-pUbgiSQ9.js';
import { I as IconEye, a as IconHeart, b as IconSwirl, c as IconSteps, d as IconFolder } from './icon-steps-DaXsOn4d.js';
import { P as PaperPlane$1 } from './PaperPlane-BjobfWsF.js';
import { g as getContext } from './lifecycle-Dr9vL0LE.js';
import 'posthog-js';
import 'tailwind-variants';
import './index2-BL47qDlJ.js';
import './scheduler-Be-hqvXf.js';
import './ssr2-BVSPLo1E.js';
import 'tailwind-merge';

const CaretRight = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const CaretRight$1 = CaretRight;
const HamburgerMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const HamburgerMenu$1 = HamburgerMenu;
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
const Moon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M2.89998 0.499976C2.89998 0.279062 2.72089 0.0999756 2.49998 0.0999756C2.27906 0.0999756 2.09998 0.279062 2.09998 0.499976V1.09998H1.49998C1.27906 1.09998 1.09998 1.27906 1.09998 1.49998C1.09998 1.72089 1.27906 1.89998 1.49998 1.89998H2.09998V2.49998C2.09998 2.72089 2.27906 2.89998 2.49998 2.89998C2.72089 2.89998 2.89998 2.72089 2.89998 2.49998V1.89998H3.49998C3.72089 1.89998 3.89998 1.72089 3.89998 1.49998C3.89998 1.27906 3.72089 1.09998 3.49998 1.09998H2.89998V0.499976ZM5.89998 3.49998C5.89998 3.27906 5.72089 3.09998 5.49998 3.09998C5.27906 3.09998 5.09998 3.27906 5.09998 3.49998V4.09998H4.49998C4.27906 4.09998 4.09998 4.27906 4.09998 4.49998C4.09998 4.72089 4.27906 4.89998 4.49998 4.89998H5.09998V5.49998C5.09998 5.72089 5.27906 5.89998 5.49998 5.89998C5.72089 5.89998 5.89998 5.72089 5.89998 5.49998V4.89998H6.49998C6.72089 4.89998 6.89998 4.72089 6.89998 4.49998C6.89998 4.27906 6.72089 4.09998 6.49998 4.09998H5.89998V3.49998ZM1.89998 6.49998C1.89998 6.27906 1.72089 6.09998 1.49998 6.09998C1.27906 6.09998 1.09998 6.27906 1.09998 6.49998V7.09998H0.499976C0.279062 7.09998 0.0999756 7.27906 0.0999756 7.49998C0.0999756 7.72089 0.279062 7.89998 0.499976 7.89998H1.09998V8.49998C1.09998 8.72089 1.27906 8.89997 1.49998 8.89997C1.72089 8.89997 1.89998 8.72089 1.89998 8.49998V7.89998H2.49998C2.72089 7.89998 2.89998 7.72089 2.89998 7.49998C2.89998 7.27906 2.72089 7.09998 2.49998 7.09998H1.89998V6.49998ZM8.54406 0.98184L8.24618 0.941586C8.03275 0.917676 7.90692 1.1655 8.02936 1.34194C8.17013 1.54479 8.29981 1.75592 8.41754 1.97445C8.91878 2.90485 9.20322 3.96932 9.20322 5.10022C9.20322 8.37201 6.82247 11.0878 3.69887 11.6097C3.45736 11.65 3.20988 11.6772 2.96008 11.6906C2.74563 11.702 2.62729 11.9535 2.77721 12.1072C2.84551 12.1773 2.91535 12.2458 2.98667 12.3128L3.05883 12.3795L3.31883 12.6045L3.50684 12.7532L3.62796 12.8433L3.81491 12.9742L3.99079 13.089C4.11175 13.1651 4.23536 13.2375 4.36157 13.3059L4.62496 13.4412L4.88553 13.5607L5.18837 13.6828L5.43169 13.7686C5.56564 13.8128 5.70149 13.8529 5.83857 13.8885C5.94262 13.9155 6.04767 13.9401 6.15405 13.9622C6.27993 13.9883 6.40713 14.0109 6.53544 14.0298L6.85241 14.0685L7.11934 14.0892C7.24637 14.0965 7.37436 14.1002 7.50322 14.1002C11.1483 14.1002 14.1032 11.1453 14.1032 7.50023C14.1032 7.25044 14.0893 7.00389 14.0623 6.76131L14.0255 6.48407C13.991 6.26083 13.9453 6.04129 13.8891 5.82642C13.8213 5.56709 13.7382 5.31398 13.6409 5.06881L13.5279 4.80132L13.4507 4.63542L13.3766 4.48666C13.2178 4.17773 13.0353 3.88295 12.8312 3.60423L12.6782 3.40352L12.4793 3.16432L12.3157 2.98361L12.1961 2.85951L12.0355 2.70246L11.8134 2.50184L11.4925 2.24191L11.2483 2.06498L10.9562 1.87446L10.6346 1.68894L10.3073 1.52378L10.1938 1.47176L9.95488 1.3706L9.67791 1.2669L9.42566 1.1846L9.10075 1.09489L8.83599 1.03486L8.54406 0.98184ZM10.4032 5.30023C10.4032 4.27588 10.2002 3.29829 9.83244 2.40604C11.7623 3.28995 13.1032 5.23862 13.1032 7.50023C13.1032 10.593 10.596 13.1002 7.50322 13.1002C6.63646 13.1002 5.81597 12.9036 5.08355 12.5522C6.5419 12.0941 7.81081 11.2082 8.74322 10.0416C8.87963 10.2284 9.10028 10.3497 9.34928 10.3497C9.76349 10.3497 10.0993 10.0139 10.0993 9.59971C10.0993 9.24256 9.84965 8.94373 9.51535 8.86816C9.57741 8.75165 9.63653 8.63334 9.6926 8.51332C9.88358 8.63163 10.1088 8.69993 10.35 8.69993C11.0403 8.69993 11.6 8.14028 11.6 7.44993C11.6 6.75976 11.0406 6.20024 10.3505 6.19993C10.3853 5.90487 10.4032 5.60464 10.4032 5.30023Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const Moon$1 = Moon;
const Sun = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0.5 7C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H2.5C2.77614 8 3 7.77614 3 7.5C3 7.22386 2.77614 7 2.5 7H0.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const Sun$1 = Sun;
const IconSelf = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="finger-print-outline">\n    <path class="cls-1" d="M17.53,4.78c-.08,0-.15-.02-.22-.06-3.23-1.82-7.18-1.82-10.41,0-.23.12-.51.04-.63-.19,0,0,0,0,0-.01-.12-.23-.04-.52.19-.66,3.5-1.97,7.78-1.98,11.29,0,.23.13.32.42.2.65-.07.17-.23.27-.41.28ZM4.15,9.88c-.1,0-.19-.03-.27-.09-.21-.16-.26-.46-.11-.68.89-1.33,2.1-2.42,3.51-3.17,3.02-1.57,6.62-1.58,9.64-.01,1.41.75,2.61,1.83,3.5,3.15.15.22.1.52-.11.68-.2.15-.49.11-.64-.09,0,0-.01-.02-.02-.02-.81-1.19-1.9-2.17-3.17-2.85-2.76-1.43-6.03-1.42-8.79.01-1.28.69-2.37,1.67-3.18,2.87-.07.13-.21.21-.37.2h0ZM10,21.59c-.13,0-.24-.05-.33-.15-.76-.75-1.4-1.61-1.88-2.56-.67-1.3-1.01-2.75-.98-4.21,0-2.92,2.37-5.29,5.29-5.29,2.92,0,5.29,2.37,5.29,5.29,0,.26-.21.47-.47.47s-.47-.21-.47-.47c-.05-2.41-2.04-4.32-4.45-4.26-2.33.05-4.21,1.93-4.26,4.26-.02,1.3.27,2.58.87,3.74.45.87,1.03,1.66,1.73,2.35.18.2.18.49,0,.69-.09.09-.21.14-.34.15ZM16.7,19.79c-1.03.03-2.05-.28-2.9-.86-1.39-.97-2.22-2.56-2.22-4.26-.01-.26.19-.48.45-.49s.48.19.49.45c0,.01,0,.03,0,.04,0,1.38.68,2.67,1.81,3.45.7.48,1.53.72,2.38.69.33,0,.65-.04.97-.1.25-.04.5.13.54.38,0,0,0,.01,0,.02.05.26-.12.51-.38.56-.37.07-.75.11-1.13.12h0ZM14.82,21.79s-.08,0-.12-.02c-3.24-.83-5.51-3.75-5.51-7.1,0-1.59,1.29-2.88,2.88-2.88,1.59,0,2.88,1.29,2.88,2.88.02,1.07.91,1.92,1.99,1.9,1.04-.02,1.88-.86,1.9-1.9-.04-3.7-3.08-6.67-6.78-6.63-2.65,0-5.06,1.52-6.18,3.91-.38.86-.57,1.78-.55,2.72,0,1.19.21,2.38.63,3.5.1.25-.02.52-.27.62,0,0,0,0,0,0-.24.09-.5-.03-.59-.26,0,0,0-.01,0-.02-.45-1.23-.68-2.53-.68-3.84-.02-1.08.2-2.15.64-3.15,1.8-3.87,6.4-5.55,10.27-3.74,2.68,1.25,4.42,3.92,4.47,6.88,0,1.59-1.29,2.88-2.88,2.88s-2.88-1.29-2.88-2.88c-.03-1.07-.93-1.92-2.01-1.88-1.03.03-1.85.86-1.88,1.88-.01,1.63.62,3.2,1.75,4.38.83.88,1.89,1.5,3.06,1.8.25.08.4.34.33.59-.04.21-.22.36-.44.37h0Z"/>\n  </g>\n</svg>';
const IconFight = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="Gruppe_159" data-name="Gruppe 159">\n    <g id="flash-outline">\n      <path class="cls-1" d="M9.97,19.34s-.09,0-.13-.01c-.31-.07-.51-.38-.44-.69l.98-5.4h-3.84c-.19,0-.37-.11-.45-.28s-.06-.38.06-.53L13.76,3.02h0c.13-.15.38-.25.56-.21.32.06.53.36.47.68l-.99,5.42h3.84c.19,0,.37.11.45.28s.06.38-.06.53l-7.6,9.4c-.09.12-.3.22-.45.22ZM10.39,18.8v.03s0-.02,0-.03ZM7.59,12.23h3.39c.15,0,.29.07.38.18.1.11.13.26.11.41l-.8,4.4,5.92-7.32h-3.39c-.15,0-.29-.07-.38-.18-.09-.11-.13-.26-.11-.41l.81-4.4-5.92,7.32ZM14.15,3.33h0,0Z"/>\n    </g>\n  </g>\n</svg>';
const IconFeedback = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="Pfad_52" data-name="Pfad 52">\n    <path class="cls-1" d="M12.49,20.75c-.3,0-.55-.25-.55-.55v-8.1H3.84c-.3,0-.55-.25-.55-.55s.25-.55.55-.55h8.1v-3.29c0-2.42,1.97-4.39,4.39-4.39s4.39,1.97,4.39,4.39-1.97,4.39-4.39,4.39h-3.29v8.1c0,.3-.25.55-.55.55ZM13.04,11h3.29c1.82,0,3.29-1.48,3.29-3.29s-1.48-3.29-3.29-3.29-3.29,1.48-3.29,3.29v3.29Z"/>\n  </g>\n  <g id="Pfad_53" data-name="Pfad 53">\n    <path class="cls-1" d="M6.73,14.93c-.13,0-.26-.05-.35-.15l-2.88-2.88c-.2-.2-.2-.51,0-.71l2.88-2.88c.2-.2.51-.2.71,0s.2.51,0,.71l-2.53,2.53,2.53,2.53c.2.2.2.51,0,.71-.1.1-.23.15-.35.15Z"/>\n  </g>\n</svg>';
const IconLearn = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.18 24.18">\n  <defs>\n    <style>\n      .cls-1 {\n        stroke-width: 0px;\n      }\n    </style>\n  </defs>\n  <g id="Pfad_62" data-name="Pfad 62">\n    <path class="cls-1" d="M18.21,17.39h.78c.23,0,.42-.19.42-.42V4.03c0-.23-.19-.42-.42-.42H6.65c-1.05,0-1.89.86-1.89,1.91v13.17s0,.06,0,.09c.1,1.02.96,1.8,1.99,1.8h12.24c.23,0,.42-.19.42-.42s-.19-.42-.42-.42h-.76c-.64-.01-1.16-.54-1.14-1.19.01-.62.5-1.12,1.12-1.14h0ZM5.61,5.51c0-.58.46-1.05,1.04-1.06h11.91v12.09h-.36l-11.45.04c-.41,0-.81.14-1.14.38V5.51ZM6.76,19.73c-.63.02-1.16-.48-1.18-1.11-.02-.63.48-1.16,1.11-1.18.02,0,.05,0,.07,0l9.78-.05c-.25.33-.39.74-.39,1.16,0,.42.14.83.39,1.17H6.76Z"/>\n  </g>\n</svg>';
const WebsiteHamburgerMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let darkMode;
  let $mode, $$unsubscribe_mode;
  let $backgroundColor, $$unsubscribe_backgroundColor;
  let $t, $$unsubscribe_t;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_mode = subscribe(derivedMode, (value) => $mode = value);
  $$unsubscribe_backgroundColor = subscribe(backgroundColor, (value) => $backgroundColor = value);
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  let { menuItems } = $$props;
  let dialogOpen = false;
  const langs = [{ value: "en", label: "English" }, { value: "de", label: "German" }];
  const handleSelect = (event) => {
    if (event) {
      setCookie("locale", event.value);
      locale.update(() => event.value);
    }
  };
  if ($$props.menuItems === void 0 && $$bindings.menuItems && menuItems !== void 0)
    $$bindings.menuItems(menuItems);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    darkMode = $mode === "dark";
    $$rendered = `${validate_component(Root, "Sheet.Root").$$render(
      $$result,
      { open: dialogOpen },
      {
        open: ($$value) => {
          dialogOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<button class="flex items-center">${validate_component(HamburgerMenu$1, "HamburgerMenu").$$render($$result, { class: "size-6" }, {}, {})}</button> ${validate_component(Sheet_content, "Sheet.Content").$$render(
            $$result,
            {
              class: $backgroundColor + " z-[1003] flex flex-col border-muted"
            },
            {},
            {
              default: () => {
                return `${validate_component(Sheet_header, "Sheet.Header").$$render(
                  $$result,
                  {
                    class: "flex flex-row items-center justify-between border-b border-black/10 px-5 py-2.5"
                  },
                  {},
                  {
                    default: () => {
                      return `${validate_component(Sheet_title, "Sheet.Title").$$render($$result, { class: "pt-0.5" }, {}, {
                        default: () => {
                          return `${escape($t("default.menu.title"))}`;
                        }
                      })} ${validate_component(Close, "Sheet.Close").$$render($$result, { class: "!m-0" }, {}, {
                        default: () => {
                          return `${validate_component(Button$2, "ButtonOp1").$$render(
                            $$result,
                            {
                              decoration: "floating-op1",
                              class: "-mr-2 flex items-center justify-center border-neutral-200 bg-background p-1.5 text-sm text-neutral-800 transition hover:bg-offwhite dark:border-neutral-800 dark:bg-muted dark:text-white"
                            },
                            {},
                            {
                              default: () => {
                                return `${validate_component(Cross1, "Cross1").$$render($$result, { class: "size-4 text-red-600" }, {}, {})}`;
                              }
                            }
                          )}`;
                        }
                      })}`;
                    }
                  }
                )} <div class="flex h-full flex-col justify-between gap-2 p-5"><div class="mb-10 flex flex-col items-start gap-2">${each(menuItems, (item) => {
                  return `<button class="flex w-full items-center justify-between gap-2 text-lg font-bold">${escape(item.label)} <div class="mr-[2px] flex size-6 items-center justify-center rounded-full">${validate_component(CaretRight$1, "CaretRight").$$render($$result, { class: "size-4" }, {}, {})}</div> </button>`;
                })}</div> <div class="flex flex-col gap-5">${validate_component(Root$1, "Select.Root").$$render(
                  $$result,
                  {
                    selected: langs.find((lang) => lang.value === $locale),
                    onSelectedChange: handleSelect
                  },
                  {},
                  {
                    default: () => {
                      return `${validate_component(Select_trigger, "Select.Trigger").$$render($$result, { class: "" }, {}, {
                        default: () => {
                          return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "Language" }, {}, {})}`;
                        }
                      })} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
                        default: () => {
                          return `${each(langs, (lang) => {
                            return `${validate_component(Select_item, "Select.Item").$$render($$result, { value: lang.value, label: lang.label }, {}, {
                              default: () => {
                                return `${escape(lang.label)}`;
                              }
                            })}`;
                          })}`;
                        }
                      })} ${validate_component(Input, "Select.Input").$$render($$result, { name: "favoriteFruit" }, {}, {})}`;
                    }
                  }
                )} <div class="mb-4 flex items-center space-x-2">${validate_component(Switch, "Switch").$$render(
                  $$result,
                  {
                    id: "lightMode",
                    class: "bg-gray-500",
                    checked: darkMode
                  },
                  {
                    checked: ($$value) => {
                      darkMode = $$value;
                      $$settled = false;
                    }
                  },
                  {}
                )} ${validate_component(Label, "Label").$$render($$result, { for: "lightMode" }, {}, {
                  default: () => {
                    return `Dark Mode`;
                  }
                })}</div> <div class="mb-3 border-b border-gray-300/30 dark:border-gray-300/20"></div> ${validate_component(Button$1, "Button").$$render(
                  $$result,
                  {
                    variant: "outline",
                    class: "w-full font-bold dark:text-black rounded-lg"
                  },
                  {},
                  {
                    default: () => {
                      return `${escape($t("default.page.login.heading"))}`;
                    }
                  }
                )}</div></div>`;
              }
            }
          )}`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_mode();
  $$unsubscribe_backgroundColor();
  $$unsubscribe_t();
  $$unsubscribe_locale();
  return $$rendered;
});
const WebsiteMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let menuItems;
  let $windowWidth, $$unsubscribe_windowWidth;
  let $t, $$unsubscribe_t;
  let $$unsubscribe_mode;
  let $scroll, $$unsubscribe_scroll;
  let $backgroundColor, $$unsubscribe_backgroundColor;
  let $currentSection, $$unsubscribe_currentSection;
  $$unsubscribe_windowWidth = subscribe(windowWidth, (value) => $windowWidth = value);
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  $$unsubscribe_mode = subscribe(derivedMode, (value) => value);
  $$unsubscribe_scroll = subscribe(scroll, (value) => $scroll = value);
  $$unsubscribe_backgroundColor = subscribe(backgroundColor, (value) => $backgroundColor = value);
  $$unsubscribe_currentSection = subscribe(currentSection, (value) => $currentSection = value);
  menuItems = () => [
    {
      label: $t("default.menu.sections.the4steps"),
      target: "stepsTarget"
    },
    {
      label: $t("default.menu.sections.modules"),
      target: "modulesTarget"
    },
    {
      label: $t("default.menu.sections.selfempathy"),
      target: "selfempathyTarget"
    },
    {
      label: $t("default.menu.sections.fight"),
      target: "fightTarget"
    },
    {
      label: $t("default.menu.sections.feedback"),
      target: "feedbackTarget"
    },
    {
      label: $t("default.menu.sections.learn"),
      target: "learnTarget"
    }
  ];
  $$unsubscribe_windowWidth();
  $$unsubscribe_t();
  $$unsubscribe_mode();
  $$unsubscribe_scroll();
  $$unsubscribe_backgroundColor();
  $$unsubscribe_currentSection();
  return `<div style="${"width:" + escape($windowWidth, true) + "px;"}" class="fixed left-0 top-0 z-[100]"><div class="${escape(
    "max-h-96 opacity-100",
    true
  ) + " " + escape($scroll > 5 ? "shadow-xl shadow-black/5 delay-150" : "", true) + " overflow-hidden transition-all"}"><nav class="${escape($scroll > 5 ? $backgroundColor : "bg-white-background", true) + " flex items-center justify-between px-5 py-3 transition-all duration-500 lg:py-3"}"><a href="/" class="w-1 overflow-visible"><div>${validate_component(Logo, "Logo").$$render($$result, {}, {}, {})}</div></a> <div class="hidden items-center gap-7 lg:flex">${each(menuItems(), (item) => {
    return `<button class="group relative"><div class="shadow-x absolute -bottom-1 -left-3 -right-3 -top-1 z-0 rounded-md bg-white-background/30 opacity-0 shadow-md transition-opacity group-hover:opacity-100"></div> <div class="${escape(
      item.target === $currentSection ? "opacity-100" : "opacity-0",
      true
    ) + " absolute -bottom-1 -left-3 -right-3 -top-1 rounded-md bg-black/5 shadow-inner shadow-black/20 transition-opacity duration-300"}"></div> <div class="relative z-10">${escape(item.label)}</div> </button>`;
  })}</div> <div class="flex w-1 items-center justify-end gap-4"><div>${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "outline",
      size: "icon",
      class: "size-9"
    },
    {},
    {
      default: () => {
        return `${validate_component(Sun$1, "Sun").$$render(
          $$result,
          {
            class: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          },
          {},
          {}
        )} ${validate_component(Moon$1, "Moon").$$render(
          $$result,
          {
            class: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          },
          {},
          {}
        )} <span class="sr-only" data-svelte-h="svelte-ntgole">Toggle theme</span>`;
      }
    }
  )}</div> ${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "outline",
      class: "hidden font-bold lg:block"
    },
    {},
    {
      default: () => {
        return `${escape($t("default.page.login.heading"))}`;
      }
    }
  )} <div class="lg:hidden">${validate_component(WebsiteHamburgerMenu, "WebsiteHamburgerMenu").$$render($$result, { menuItems: menuItems() }, {}, {})}</div></div></nav></div> </div>`;
});
const css$7 = {
  code: ".step.svelte-11drj4t{display:flex;align-items:center;justify-content:center;border-radius:1.6em;padding:0.3em;--tw-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}:root{--duration:6s}.heart.svelte-11drj4t{animation:svelte-11drj4t-heart}.step5.svelte-11drj4t{animation:svelte-11drj4t-step5}.step4.svelte-11drj4t{animation:svelte-11drj4t-step4}.step3.svelte-11drj4t{animation:svelte-11drj4t-step3}.step2.svelte-11drj4t{animation:svelte-11drj4t-step2}.step1.svelte-11drj4t{animation:svelte-11drj4t-step1}.step1.svelte-11drj4t,.step2.svelte-11drj4t,.step3.svelte-11drj4t,.step4.svelte-11drj4t,.step5.svelte-11drj4t,.heart.svelte-11drj4t{animation-duration:var(--duration);animation-iteration-count:infinite;animation-fill-mode:forwards;animation-timing-function:ease-out}@keyframes svelte-11drj4t-heart{0%,65%{opacity:0;transform:scale(0)}75%,90%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0)}}@keyframes svelte-11drj4t-step5{0%,27.5%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity));opacity:0;transform:scale(0)}35%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity));opacity:1;transform:scale(1)}40%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity))}40.1%{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}50%{--tw-bg-opacity:1;background-color:rgb(51 65 85 / var(--tw-bg-opacity))}55%{opacity:0}100%{opacity:0}}@keyframes svelte-11drj4t-step4{0%,22.5%{transform:scale(0);opacity:0}30%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}@keyframes svelte-11drj4t-step3{0%,17.5%{transform:scale(0);opacity:0}25%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}@keyframes svelte-11drj4t-step2{0%,12.5%{transform:scale(0);opacity:0}20%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}@keyframes svelte-11drj4t-step1{0%,10%{transform:scale(0);opacity:0}15%{transform:scale(1);opacity:1}50%{transform:scale(1);opacity:1}55%,100%{transform:scale(0);opacity:0}}.pop-in.svelte-11drj4t{animation:svelte-11drj4t-popIn;animation-duration:var(--duration);animation-iteration-count:infinite;animation-fill-mode:forwards}@keyframes svelte-11drj4t-popIn{0%{opacity:0;transform:translate(0, 0)}10%{opacity:1;transform:translate(0, 8em)}15%{opacity:0;transform:translate(0, 8em)}55%{opacity:0}65%{opacity:1}70%{opacity:0}100%{opacity:0;transform:translate(0, 8em)}}",
  map: null
};
const HeroAnimation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let menuItems = [
    {
      slug: "home",
      name: get_store_value(t2)("default.menu.bar.home"),
      path: "/app/dashboard",
      icon: IconFolder,
      available: true
    },
    {
      slug: "selfempathy",
      name: get_store_value(t2)("default.menu.bar.selfempathy"),
      path: "/app/selfempathy",
      icon: IconSelf,
      available: false
    },
    {
      slug: "fights",
      name: get_store_value(t2)("default.menu.bar.fights"),
      path: "/app/fights",
      icon: IconFight,
      available: true
    },
    {
      slug: "feedback",
      name: get_store_value(t2)("default.menu.bar.feedback"),
      path: "/app/feedback",
      icon: IconFeedback,
      available: false
    },
    {
      slug: "learn",
      name: get_store_value(t2)("default.menu.bar.learn"),
      path: "/app/learn",
      icon: IconLearn,
      available: false
    }
  ];
  t2.subscribe((value) => {
    const newMenuItems = menuItems.map((entry) => {
      const translation = value(`default.menu.bar.${entry.slug}`);
      entry.name = translation;
      return entry;
    });
    menuItems = [...newMenuItems];
  });
  $$result.css.add(css$7);
  return `<div class="relative h-full w-full p-[1.2em]"><div class="pop-in svelte-11drj4t" data-svelte-h="svelte-1igc2am"><div class="flex items-center justify-center"><div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}" class="animate-bg-fast flex h-[1em] w-[2em] flex-col items-center justify-center rounded-full shadow-lg"></div></div></div> <div class="relative flex h-full flex-col justify-between pb-[3.6em]"><div class="flex flex-col gap-px sm:gap-[0.5em]"><div class="step step1 bg-observation-background svelte-11drj4t"><div class="w-[2em] fill-observation-foreground"><!-- HTML_TAG_START -->${IconEye}<!-- HTML_TAG_END --></div></div> <div class="step step2 bg-feelings-background svelte-11drj4t"><div class="w-[2em] fill-feelings-foreground"><!-- HTML_TAG_START -->${IconHeart}<!-- HTML_TAG_END --></div></div> <div class="step step3 bg-needs-background svelte-11drj4t"><div class="w-[2em] fill-needs-foreground"><!-- HTML_TAG_START -->${IconSwirl}<!-- HTML_TAG_END --></div></div> <div class="step step4 bg-request-background svelte-11drj4t"><div class="w-[2em] fill-request-foreground"><!-- HTML_TAG_START -->${IconSteps}<!-- HTML_TAG_END --></div></div></div> <div class="step5 flex items-center justify-center rounded-full p-[1em] shadow-lg svelte-11drj4t"><div class="flex w-full items-center justify-between fill-observation-foreground"><div class="h-[0.5em] w-[3em] rounded bg-slate-600"></div> ${validate_component(PaperPlane$1, "PaperPlane").$$render($$result, { class: "text-slate-500" }, {}, {})}</div></div> <div class="absolute flex h-full w-full items-center justify-center pb-[3em]"><div class="heart svelte-11drj4t">${validate_component(HeartFilled$1, "HeartFilled").$$render($$result, { class: "size-[5em] text-red-400" }, {}, {})}</div></div></div> <div class="fixed bottom-0 left-0 z-40 w-full rounded-b-[1em] bg-black px-[0.5em] py-[0.5em] text-gray-200"><div class="" data-svelte-h="svelte-1e4u1hl"><img src="/inverted-border.svg" alt="" class="absolute left-[0.01em] top-[0.02em] w-[1.6em] -translate-y-full transform"> <img src="/inverted-border.svg" alt="" class="absolute right-[0.13em] top-[0em] w-[1.6em] -translate-y-full -rotate-90 transform"></div> <div class="flex items-center justify-around">${each(menuItems, (item) => {
    return `<div class="relative flex flex-col items-center justify-center"><a${add_attribute("href", item.path, 0)} class="flex flex-col items-center justify-center"><div class="size-[1.4em] fill-white"><!-- HTML_TAG_START -->${item.icon}<!-- HTML_TAG_END --> </div></a> </div>`;
  })}</div></div> </div>`;
});
const css$6 = {
  code: ".screen-container.svelte-1g7h3w5{perspective:283em;perspective-origin:109% 131%}.screen.svelte-1g7h3w5{transform:translate(-53%, -52%) rotateY(-31deg) rotateX(20deg) rotateZ(-1deg)}",
  map: null
};
const MockupHero = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  $$result.css.add(css$6);
  return `<div class="text-[7px] md:text-[12px] lg:text-[16px]"><div class="${escape(null_to_empty(cn("relative screen-container float", className)), true) + " svelte-1g7h3w5"}"><img src="iphone_mockup.png" alt="" class="relative z-10"> <div class="screen shadow-[inset_0_0_20px_0_rgba(255,255,255,0.1)] bg-muted absolute top-1/2 left-1/2 w-[59%] h-[100%] rounded-[2em] overflow-hidden svelte-1g7h3w5">${validate_component(HeroAnimation, "HeroAnimation").$$render($$result, {}, {}, {})}</div></div> </div>`;
});
const css$5 = {
  code: ".animate-icon4-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:4s;animation-delay:400ms;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-icon3-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:4s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-icon2-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:3s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-icon1-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:2s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}.animate-phone-pulse{animation-name:svelte-1aoqqap-phonePulse;animation-duration:1s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:infinite}@keyframes svelte-1aoqqap-phonePulse{0%{opacity:0}100%{opacity:1}}",
  map: null
};
const AnimatedHeroBig = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  $$result.css.add(css$5);
  $$unsubscribe_t();
  return `<div class="relative z-10 flex h-svh flex-col pt-20 md:pt-32"><div class="flex-grow flex flex-col justify-center"><h1 class="mb-10 max-w-[14em] font-display text-4xl font-semibold leading-[106%] md:text-5xl lg:text-7xl">${escape($t("default.page.home.hero"))}</h1> <a href="/app/auth/login">${validate_component(Button$1, "SparkleButton").$$render(
    $$result,
    {
      class: "rounded-lg px-3 py-5 font-bold text-black shadow-lg dark:shadow-gray-300/30 lg:px-6 lg:py-7 lg:text-lg"
    },
    {},
    {
      default: () => {
        return `${escape($t("default.page.home.cta"))}`;
      }
    }
  )}</a></div> <div class="relative md:mb-32 lg:mb-60"><div class="-mx-5 mt-20 flex items-center md:mx-0" data-svelte-h="svelte-15kgd4m"><div class="hidden rounded-full bg-muted-dark/40 md:block md:size-32 lg:size-40"></div> <div class="-ml-16 hidden rounded-full bg-muted-dark md:block md:size-32 lg:size-40"></div> <div style="background-image: url('/women.jpg')" class="h-52 w-full bg-cover bg-right md:-ml-16 md:h-32 md:w-[300px] md:rounded-full md:bg-center lg:h-40 lg:w-[500px]"></div></div> ${validate_component(MockupHero, "MockupHero").$$render(
    $$result,
    {
      class: "absolute -right-4 top-0 w-40 md:w-60 lg:right-0 lg:w-96 -mt-20"
    },
    {},
    {}
  )}</div> </div>`;
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
const Connector = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.25 23.28">\n  <path stroke-miterlimit="10" stroke-width="3.3" d="M2,23.28h0c0-6.43,5.21-11.64,11.64-11.64h60.97C81.04,11.64,86.25,6.43,86.25,0h0"/>\n</svg>\n';
const css$4 = {
  code: ".skeumorphic-button.svelte-5cv73o{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: null
};
const The4Steps = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cards;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
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
  return `<div class="flex flex-col items-center mb-40 pt-12 md:pt-0"><h2 class="mb-16 md:mb:20 max-w-[13em] text-center font-display text-3xl md:text-4xl font-semibold lg:text-5xl">${escape($t("default.page.home.components.the4steps.heading"))}</h2> <div class="relative mb-16 md:mb:20"><div class="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><div class="w-28 stroke-black fill-none dark:stroke-neon"><!-- HTML_TAG_START -->${Connector}<!-- HTML_TAG_END --></div> </div> <div class="md:-m-4 flex flex-wrap items-stretch justify-center">${each(cards, (card) => {
    return `<div class="group relative h-52 md:h-72 w-full px-4 py-3 md:py-4 md:w-1/2 md:max-w-[460px]"><div class="absolute left-full top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-first:md:block dark:bg-neon"></div> <div class="absolute left-0 top-1/2 hidden h-1 w-8 -translate-x-4 -translate-y-1/2 transform bg-black/90 group-last:md:block dark:bg-neon"></div> <div class="flex h-full flex-col justify-between rounded-3xl bg-muted p-5 md:p-6 lg:p-8 shadow-lg"><div class="flex flex-row md:flex-col gap-4 items-center md:items-start"><div class="skeumorphic-button h-9 w-9 rounded-full bg-offwhite p-0.5 svelte-5cv73o"><div class="${"bg-" + escape(card.backgroundColor, true) + " fill-" + escape(card.color, true) + " flex items-center justify-center rounded-full p-1 shadow-inner svelte-5cv73o"}"><!-- HTML_TAG_START -->${card.icon}<!-- HTML_TAG_END --> </div></div> <h3 class="md:mb-6 font-display text-xl font-semibold md:text-2xl">${escape(card.heading)} </h3></div> <div class="flex"><p class="">${escape(card.text)}</p> <div class="flex items-end"><div class="ml-2 lg:ml-10 flex w-6 h-6 lg:h-8 lg:w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-white/60 shadow-md">${validate_component(Plus, "IconPlus").$$render($$result, {}, {}, {})} </div></div> </div></div> </div>`;
  })}</div></div>  </div>`;
});
const Modules = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let modules;
  let $t, $$unsubscribe_t;
  let $locale, $$unsubscribe_locale;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
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
    return `<div class="group relative flex items-center justify-center rounded-[36px] bg-muted p-3 lg:p-6 text-sm shadow-xl md:w-auto"><div class="absolute left-full top-1/2 hidden h-1 w-4 -translate-y-1/2 transform bg-black/90 dark:bg-neon md:block group-last:md:hidden"></div> <div class="flex size-[100px] md:size-[120px] lg:size-[140px] flex-shrink-0 flex-col items-center justify-between rounded-3xl bg-black p-2 lg:p-4 text-offwhite shadow-xl"><div></div> <div class="flex w-16 h-16 lg:h-20 lg:w-20 flex-shrink-0 items-center justify-center rounded-full fill-offwhite/90 dark:fill-white p-1 shadow-inner"><!-- HTML_TAG_START -->${module.icon}<!-- HTML_TAG_END --></div> <div class="relative">${module.delayed ? `<div class="absolute right-4 top-0.5 -translate-y-full translate-x-full transform rounded-full bg-red-500 px-2 py-0.5 text-xs">${escape($locale == "en" ? "soon" : "bald")} </div>` : ``} <span class="text-[10px] md:text-xs dark:text-white">${escape(module.heading)}</span> </div></div> </div>`;
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
  return `<div${add_attribute("class", cn("flex items-center justify-center relative", className), 0)}><img src="phone_frontal.png" alt="Phone Mockup" class=""> <div class="bg-black bg-contain bg-bottom bg-no-repeat absolute w-[calc(100%-20px)] h-[calc(100%-20px)] rounded-[35px] transform translate-y-1px z-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]"></div> <div style="${"background-image: url('" + escape(mockup, true) + "')"}" class="${"bg-contain bg-bottom bg-no-repeat absolute w-[calc(100%-30px)] h-[calc(100%-30px)] " + escape(color, true) + " rounded-[26px] sm:rounded-[30px] md:rounded-[35px] transform translate-y-1px"}"><div class="relative"><div class="absolute top-0 left-0 z-10 w-full flex items-center justify-between px-6 py-3"><span class="${"text-[9px] font-bold " + escape(inverted ? "text-white" : "text-black", true)}">09:46</span> <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 sm:w-20 h-5 sm:h-6 bg-black rounded-full flex items-center justify-end px-[4px] pt-[2px]" data-svelte-h="svelte-fpahys"><img src="/phone-lens.jpg" alt="Phone Lens" class="w-4 h-4 rounded-full"></div> <img${add_attribute(
    "src",
    inverted ? "/phone-icons-inverted.svg" : "/phone-icons.svg",
    0
  )} alt="Phone Icons" class="h-1.5 sm:h-2"></div></div></div></div>`;
});
const css$3 = {
  code: ".skeumorphic-button.svelte-5cv73o{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: null
};
const Selfempathy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  let moduleName = void 0;
  locale.subscribe((value) => {
    moduleName = value === "en" ? "Module" : "Modul";
  });
  $$result.css.add(css$3);
  $$unsubscribe_t();
  return `<div class="flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-20 mb-40"><div class="flex flex-col items-center justify-center xl:items-start"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1 svelte-5cv73o"><div class="bg-black fill-offwhite dark:fill-neon flex items-center justify-center rounded-full p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconSelf}<!-- HTML_TAG_END --></div></div> <div class="text-black/60 dark:text-white/80 mb-3 ml-0.5">1. ${escape(moduleName)}</div> <h2 class="font-display text-2xl font-semibold lg:text-4xl mb-8">${escape($t("default.page.home.components.selfempathy.heading"))}</h2> <p class="max-w-md">${escape($t("default.page.home.components.selfempathy.description"))}</p></div> <div class="relative flex">${validate_component(PhoneMockup, "PhoneMockup").$$render(
    $$result,
    {
      mockup: "screenshot-fight2.png",
      color: "bg-[#618BFF]",
      inverted: true,
      class: "w-50 md:w-72"
    },
    {},
    {}
  )} ${validate_component(PhoneMockup, "PhoneMockup").$$render(
    $$result,
    {
      mockup: "screenshot-dashboard.png",
      color: "bg-[#D7D5D1]",
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
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
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
  return `<div class="mb-32"><div class="flex flex-col items-center"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1 svelte-ac5ap2"><div class="flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconFight}<!-- HTML_TAG_END --></div></div> <div class="mb-3 ml-0.5 text-black/60 dark:text-white/80">2. ${escape(moduleName)}</div> <h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.fight.heading"))}</h2></div> <div class="relative flex flex-col items-center justify-start gap-4 lg:mt-24 lg:flex-row lg:items-stretch lg:justify-center lg:gap-10"><div class="absolute left-1/2 top-[90px] hidden h-40 w-full -translate-x-1/2 -translate-y-full transform rounded-full border-4 border-black dark:border-neon lg:block" data-svelte-h="svelte-79vc0a"><div class="absolute -top-[2px] left-1/2 hidden -translate-y-1/2 transform lg:block"><div class="h-4 w-4 rotate-45 transform border-b-4 border-l-4 border-black dark:border-neon"></div></div></div> <div class="relative z-0"><div class="absolute left-0 top-[88px] -ml-8 hidden -translate-y-1/2 transform lg:block" data-svelte-h="svelte-6usgx3"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div></div>  <div class="m-4"><div class="relative w-full overflow-hidden rounded-lg shadow-xl shadow-black/5 md:w-52">${each(tableRows, (row) => {
    return `<div class="group flex items-stretch border-b border-black/5 bg-white text-xs shadow-md last:border-b-0"><div class="flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3"><div class="${"label bg-" + escape(row.color, true) + "-background svelte-ac5ap2"}"><div class="${"icon fill-" + escape(row.color, true) + "-foreground svelte-ac5ap2"}"><!-- HTML_TAG_START -->${row.icon}<!-- HTML_TAG_END --></div> </div></div> <div class="flex-grow break-all px-3 pb-3 pt-4 dark:text-black">${escape(row.content)}</div> </div>`;
  })}</div> <p class="w-full py-4 md:w-52" data-svelte-h="svelte-1pur9mq">Du notierst Deine Beobachtung, Gefühle, Bedürfnisse und Bitten</p></div></div> <div class="relative z-0" data-svelte-h="svelte-17u2ho1"><div class="absolute left-0 top-[88px] -ml-8 hidden -translate-y-1/2 transform lg:block"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div></div> <div class="absolute right-0 top-[88px] -mr-6 hidden -translate-y-1/2 transform lg:block"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div></div>  <div class="m-4"><div style="${"background-image: url('" + escape(backgroundImage, true) + "'); background-size: 300% 100%"}"${add_attribute("class", "shadow-black-5 flex h-[178.22px] w-full items-center justify-center rounded-lg bg-center bg-repeat-x shadow-xl md:w-52", 0)}><div class="h-8 w-20 rounded-full border-4 border-white"></div></div> <p class="w-full py-4 md:w-52">Wir generieren einen Empathie-Link, den Du Deiner/m Streitpartner*in schickst</p></div></div> <div class="relative z-0"><div class="absolute right-0 top-[88px] -mr-6 hidden -translate-y-1/2 transform lg:block" data-svelte-h="svelte-1mtsf3o"><div class="h-4 w-4 rotate-45 transform border-r-4 border-t-4 border-black dark:border-neon"></div></div>  <div class="m-4"><div class="w-full overflow-hidden rounded-lg shadow-xl shadow-black/5 md:w-52">${each(tableRows, (row) => {
    return `<div class="group flex items-stretch border-b border-black/5 bg-white text-xs shadow-md last:border-b-0"><div class="flex flex-shrink-0 items-center justify-center border-r border-black/5 px-3 pb-3 pt-3"><div class="${"label bg-" + escape(row.color, true) + "-background svelte-ac5ap2"}"><div class="${"icon fill-" + escape(row.color, true) + "-foreground svelte-ac5ap2"}"><!-- HTML_TAG_START -->${row.icon}<!-- HTML_TAG_END --></div> </div></div> <div class="flex-grow break-all px-3 pb-3 pt-4 dark:text-black">${escape(row.content)}</div> </div>`;
  })}</div> <p class="w-full py-4 md:w-52" data-svelte-h="svelte-2rqqw4">Dein/e Streitpartner*in kann sich in Ruhe mit Deiner Sicht der Dinge auseinandersetzen und
					antwortet dann</p></div></div></div> </div>`;
});
const css$1 = {
  code: '.skeumorphic-button.svelte-ac5ap2{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}.label.svelte-ac5ap2{box-shadow:-4px -4px 8px 0 white;position:relative;height:1.25rem;width:1.25rem;flex-shrink:0;border-radius:9999px;border-width:1px;--tw-border-opacity:1;border-color:rgb(255 255 255 / var(--tw-border-opacity))}.label.svelte-ac5ap2:after{content:"";box-shadow:4px 4px 8px 0 rgba(0, 0, 0, 0.4);display:block;height:100%;width:100%;border-radius:9999px}.icon.svelte-ac5ap2{position:absolute;left:50%;top:50%;height:0.875rem;width:0.875rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.card-root{box-shadow:-5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1)}.need.svelte-ac5ap2{position:relative;z-index:10;display:inline}.need.svelte-ac5ap2:before{content:"";position:absolute;left:0px;top:0px;height:100%;width:100%;z-index:-1}',
  map: null
};
const Feedback = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tableRows;
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
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
  return `<div class="mb-40"><div class="flex flex-col items-center"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1 svelte-ac5ap2"><div class="flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconFeedback}<!-- HTML_TAG_END --></div></div> <div class="mb-3 ml-0.5 text-black/60 dark:text-white/80">3. ${escape(moduleName)}</div> <div class="relative"><h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.feedback.heading"))}</h2> <div class="bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full">${escape($t("default.menu.soon"))}</div></div> <p class="max-w-md text-center mb-8">${escape($t("default.page.home.components.feedback.description"))}</p></div> <div class="relative flex flex-row flex-wrap justify-center items-stretch -mx-3">${each(tableRows, (card) => {
    return `<div class="group mx-4 md:mx-0 relative p-3 text-sm w-full md:w-1/4 md:max-w-[460px]"><div class="absolute left-full -ml-3 top-1/2 hidden h-1 w-6 -translate-y-1/2 transform bg-black/90 dark:bg-neon md:block group-last:md:hidden"></div> <div class="group relative h-full shadow-xl p-6 bg-muted rounded-3xl hyphens-auto"><div><div class="skeumorphic-button mb-8 h-9 w-9 rounded-full bg-offwhite p-0.5 svelte-ac5ap2"><div class="${"bg-" + escape(card.color, true) + "-background fill-" + escape(card.color, true) + "-foreground flex items-center justify-center rounded-full p-1 shadow-inner svelte-ac5ap2"}"><!-- HTML_TAG_START -->${card.icon}<!-- HTML_TAG_END --></div> </div></div> <div class="flex"><p class="">${escape(card.content)}</p> </div></div> </div>`;
  })}</div> </div>`;
});
const css = {
  code: ".skeumorphic-button.svelte-ac5ap2{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}.card-root{box-shadow:-5px -5px 5px rgba(255, 255, 255, 0.9), 5px 5px 5px rgba(0, 0, 0, 0.1)}",
  map: null
};
const Learn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
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
  return `<div class="mb-40"><div class="flex flex-col items-center lg:items-start text-center lg:text-left"><div class="skeumorphic-button mb-4 h-12 w-12 rounded-full bg-offwhite dark:bg-muted p-1 svelte-ac5ap2"><div class="flex items-center justify-center rounded-full bg-black fill-offwhite dark:fill-neon p-1.5 shadow-inner"><!-- HTML_TAG_START -->${IconLearn}<!-- HTML_TAG_END --></div></div> <div class="mb-3 ml-0.5 text-black/60 dark:text-white/80">4. ${escape(moduleName)}</div> <div class="relative"><h2 class="mb-8 font-display text-2xl font-semibold lg:text-4xl">${escape($t("default.page.home.components.learn.heading"))}</h2> <div class="bg-red-500 rounded-full px-2 py-0.5 text-xs text-white absolute -top-0 -right-0 transform translate-x-full -translate-y-full">${escape($t("default.menu.soon"))}</div></div> <p class="max-w-md mb-8">${escape($t("default.page.home.components.learn.description"))}</p></div> </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $backgroundColor, $$unsubscribe_backgroundColor;
  $$unsubscribe_backgroundColor = subscribe(backgroundColor, (value) => $backgroundColor = value);
  let { data } = $$props;
  console.log("data", data);
  const targetColors = [
    {
      name: "topTarget",
      color: "bg-white-background"
    },
    {
      name: "stepsTarget",
      color: "bg-background"
    },
    {
      name: "modulesTarget",
      color: "bg-background"
    },
    {
      name: "selfempathyTarget",
      color: "bg-observation-background dark:bg-white-background"
    },
    {
      name: "fightTarget",
      color: "bg-feelings-background dark:bg-background"
    },
    {
      name: "feedbackTarget",
      color: "bg-needs-background dark:bg-white-background"
    },
    {
      name: "learnTarget",
      color: "bg-request-background dark:bg-background"
    }
  ];
  const updateBackgroundColor = () => {
    const targets = targetColors;
    let newColor = "";
    let section = "";
    const offset = 100;
    for (const target of targets) {
      const targetDiv = document.getElementById(target.name);
      if (targetDiv) {
        const rect = targetDiv.getBoundingClientRect();
        if (rect.top + offset >= 0 && rect.bottom + offset <= window.innerHeight) {
          newColor = target.color;
          section = target.name;
          break;
        }
      }
    }
    if (newColor) {
      backgroundColor.set(newColor);
      currentSection.set(section);
    }
  };
  scroll.subscribe(() => updateBackgroundColor());
  windowHeight.subscribe(() => updateBackgroundColor());
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$unsubscribe_backgroundColor();
  return `<div class="flex h-full flex-grow flex-col justify-between">${validate_component(WebsiteMenu, "WebsiteMenu").$$render($$result, {}, {}, {})} <div class="${escape($backgroundColor, true) + " flex-grow relative transition duration-500"}"><div id="topTarget"></div> <div class="mb-20 relative z-0"><div class="max-container">${validate_component(AnimatedHeroBig, "AnimatedHeroBig").$$render($$result, {}, {}, {})}</div></div> <div class="max-container pb-40 relative z-10"><div id="stepsTarget"></div> ${validate_component(The4Steps, "The4Steps").$$render($$result, {}, {}, {})} <div id="modulesTarget"></div> ${validate_component(Modules, "Modules").$$render($$result, {}, {}, {})} <div id="selfempathyTarget"></div> ${validate_component(Selfempathy, "Selfempathy").$$render($$result, {}, {}, {})} <div id="fightTarget"></div> ${validate_component(Fight, "Fight").$$render($$result, {}, {}, {})} <div id="feedbackTarget"></div> ${validate_component(Feedback, "Feedback").$$render($$result, {}, {}, {})} <div id="learnTarget"></div> ${validate_component(Learn, "Learn").$$render($$result, {}, {}, {})}</div></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-BuL0roGr.js.map
