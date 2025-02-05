import { f as compute_rest_props } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, s as spread, d as escape_attribute_value, f as escape_object } from './ssr-DSt7LLAo.js';
import { e as cn } from './page-Bu8b23cc.js';

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

export { Skeleton as S };
//# sourceMappingURL=skeleton-qoOxuKBA.js.map
