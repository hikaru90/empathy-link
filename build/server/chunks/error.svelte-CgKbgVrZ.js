import { f as subscribe } from './exports-DdwBo3bR.js';
import { c as create_ssr_component, h as escape } from './ssr-DBUm3P54.js';
import { p as page } from './stores-eIeNDe2n.js';
import './lifecycle-BsyQvuw_.js';
import './client-CH6iu0g5.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});

export { Error as default };
//# sourceMappingURL=error.svelte-CgKbgVrZ.js.map
