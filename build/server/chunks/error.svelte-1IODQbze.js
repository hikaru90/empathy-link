import { e as subscribe } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, e as escape } from './ssr-DSt7LLAo.js';
import { p as page } from './stores-CxxJpioQ.js';
import './lifecycle-DfHz3eeH.js';
import './client-BGiBm9n9.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});

export { Error as default };
//# sourceMappingURL=error.svelte-1IODQbze.js.map
