import { g as get_store_value, f as subscribe } from './exports-BRB0bLON.js';
import { o as onDestroy } from './lifecycle-BsyQvuw_.js';
import { c as create_ssr_component, v as validate_component } from './ssr-BA-Jr39X.js';
import { t as t2, a as locale } from './translations-CjpxX11l.js';
import './Avatar.svelte_svelte_type_style_lang-CKoyyoc4.js';
import './page-5nJ1lmTK.js';
import 'clsx';
import './client-Citk00eW.js';
import './auth-CMWyavi_.js';
import { p as page } from './stores-BZs2yA97.js';
import { z, s as superForm } from './index-BgK6iorh.js';
import { d as defaults } from './defaults-BI57CNOX.js';
import './index-DHSpIlkf.js';
import { z as zod, a as zodClient } from './zod-Bv-6xRnW.js';
import { p as pb } from './pocketbase-jOic377y.js';
import { S as Skeleton } from './skeleton-GWcDImbo.js';
import './root.svelte_svelte_type_style_lang-CYORmg_E.js';
import { a as toast } from './Toaster.svelte_svelte_type_style_lang-CekTRbI_.js';
import './index2-De7DMM6-.js';
import 'tailwind-variants';
import './ssr2-BVSPLo1E.js';
import './scheduler-M4PBPObN.js';
import './stringify-DX2pbVR5.js';
import '@internationalized/date';
import './utils2-CW1DFYkq.js';
import 'tailwind-merge';

const schema = z.object({
  email: z.string().email({ message: get_store_value(t2)("default.page.login.form.email.validEmailError") })
});
const css = {
  code: '.label.svelte-ljnb6t{box-shadow:4px 4px 8px 0 rgba(0, 0, 0, 0.4);position:relative;height:1.75rem;width:1.75rem;flex-shrink:0;border-radius:9999px;border-width:1px;--tw-border-opacity:1;border-color:rgb(255 255 255 / var(--tw-border-opacity))}.label.svelte-ljnb6t:after{content:"";box-shadow:-4px -4px 8px 0 white;display:block;height:100%;width:100%;border-radius:9999px}.icon.svelte-ljnb6t{position:absolute;left:50%;top:50%;height:0.875rem;width:0.875rem;--tw-translate-x:-50%;--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.skeumorphic-button.svelte-ljnb6t{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let shareableLink;
  let $t, $$unsubscribe_t;
  let $formData, $$unsubscribe_formData;
  let $locale, $$unsubscribe_locale;
  let $page, $$unsubscribe_page;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let record = void 0;
  let dialogOpen = false;
  const data = defaults(zod(schema));
  const checkValidation = async () => {
    const validationResult = await validateForm($formData, schema);
    if (!validationResult.valid) {
      errors.set(validationResult.errors);
      return false;
    }
    return true;
  };
  const form = superForm(data, {
    // SPA: true,
    resetForm: false,
    validators: zodClient(schema),
    async onSubmit({ validators, cancel }) {
      console.log("onSubmit");
      cancel();
      if (await checkValidation()) {
        sendLink();
      }
    }
  });
  const { form: formData, errors, enhance, validate, validateForm } = form;
  $$unsubscribe_formData = subscribe(formData, (value) => $formData = value);
  const sendLink = () => {
    try {
      const sendMailRes = fetch("/api/mails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: "sendLink",
          locale: $locale,
          to: $formData.email,
          owner: record.expand.owner.firstName,
          recipientName: record.name,
          link: shareableLink
        })
      });
      console.log("sendMailRes", sendMailRes);
      dialogOpen = false;
      toast.success($t("default.menu.share.mailLinkConfirmation"));
    } catch (err) {
      console.log("error sending link per mail");
      toast.error($t("default.menu.share.mailLinkError"));
    }
  };
  onDestroy(() => {
    pb.collection("responses").unsubscribe("*");
  });
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    shareableLink = `${$page.url.origin}/fights/${$page.params.id}/respond`;
    $$rendered = `${`<div class="flex h-full flex-grow items-center justify-center">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-[20px] w-[100px] rounded-full" }, {}, {})}</div>`}`;
  } while (!$$settled);
  $$unsubscribe_t();
  $$unsubscribe_formData();
  $$unsubscribe_locale();
  $$unsubscribe_page();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-CIgyux8Y.js.map
