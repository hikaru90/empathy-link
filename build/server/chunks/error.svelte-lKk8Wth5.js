import { e as subscribe } from './exports-CLG2BRq1.js';
import { c as create_ssr_component, e as escape } from './ssr-C1fln0Kh.js';
import { p as page } from './stores-DfFLgiwW.js';
import './lifecycle-Dr9vL0LE.js';
import './client-BGiBm9n9.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});

export { Error as default };
//# sourceMappingURL=error.svelte-lKk8Wth5.js.map
