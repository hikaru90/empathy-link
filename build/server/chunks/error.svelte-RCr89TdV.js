import { f as subscribe } from './exports-BRB0bLON.js';
import { c as create_ssr_component, h as escape } from './ssr-BA-Jr39X.js';
import { p as page } from './stores-BZs2yA97.js';
import './lifecycle-BsyQvuw_.js';
import './client-Citk00eW.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});

export { Error as default };
//# sourceMappingURL=error.svelte-RCr89TdV.js.map
