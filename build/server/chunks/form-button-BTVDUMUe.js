import { e as compute_rest_props } from './exports-DdwBo3bR.js';
import { c as create_ssr_component, v as validate_component } from './ssr-DBUm3P54.js';
import './index3-xex4Pcf5.js';
import { B as Button } from './Menu-DZkbKn-u.js';

const Form_button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `${validate_component(Button, "Button.Root").$$render($$result, Object.assign({}, { type: "submit" }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});

export { Form_button as F };
//# sourceMappingURL=form-button-BTVDUMUe.js.map
