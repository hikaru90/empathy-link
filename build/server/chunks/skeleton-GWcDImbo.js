import { w as writable } from './index2-De7DMM6-.js';
import { CalendarDate } from '@internationalized/date';
import { e as compute_rest_props } from './exports-BRB0bLON.js';
import { c as create_ssr_component, s as spread, b as escape_attribute_value, d as escape_object } from './ssr-BA-Jr39X.js';
import { c as cn } from './utils2-CW1DFYkq.js';

const todayDate = /* @__PURE__ */ new Date();
console.log("todayDate", todayDate);
let startDate = writable(
  new CalendarDate(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate()).subtract({
    days: 14
  })
);
let endDate = writable(
  new CalendarDate(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate())
);
startDate.subscribe((value) => {
  console.log("startDate changed", value);
});
endDate.subscribe((value) => {
  console.log("endDate changed", value);
});
const Skeleton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("animate-pulse rounded-md bg-primary/10", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}></div>`;
});

export { Skeleton as S, endDate as e, startDate as s };
//# sourceMappingURL=skeleton-GWcDImbo.js.map
