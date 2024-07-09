import { g as get_store_value, f as subscribe } from './exports-DdwBo3bR.js';
import { o as onDestroy } from './lifecycle-BsyQvuw_.js';
import { c as create_ssr_component, v as validate_component } from './ssr-DBUm3P54.js';
import './index3-xex4Pcf5.js';
import './page-C0gcUhf4.js';
import { t as t2, a as locale } from './translations-BkqIZgNA.js';
import 'clsx';
import './client-CH6iu0g5.js';
import './auth-hi7hLRBX.js';
import { p as page } from './stores-eIeNDe2n.js';
import { z, s as superForm } from './index-B76MYh-W.js';
import { d as defaults } from './defaults-BI57CNOX.js';
import './index-DHSpIlkf.js';
import { z as zod, a as zodClient } from './zod-DucbyiJ7.js';
import { p as pb } from './pocketbase-jOic377y.js';
import './index5-BeL4rL4I.js';
import { s as startDate, S as Skeleton } from './skeleton-DzNRpiSR.js';
import './root.svelte_svelte_type_style_lang-B5lBKSjl.js';
import { a as toast } from './Toaster.svelte_svelte_type_style_lang-Cyl45pit.js';
import 'tailwind-variants';
import './index2-DDd9jZNR.js';
import './ssr2-BVSPLo1E.js';
import 'tailwind-merge';
import './stringify-DX2pbVR5.js';
import './scheduler-B6WqtzJY.js';
import '@internationalized/date';

const schema = z.object({
  email: z.string().email({ message: get_store_value(t2)("default.page.login.form.email.validEmailError") })
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let shareableLink;
  let $t, $$unsubscribe_t;
  let $formData, $$unsubscribe_formData;
  let $locale, $$unsubscribe_locale;
  let $page, $$unsubscribe_page;
  let $$unsubscribe_startDate;
  $$unsubscribe_t = subscribe(t2, (value) => $t = value);
  $$unsubscribe_locale = subscribe(locale, (value) => $locale = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_startDate = subscribe(startDate, (value) => value);
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
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    shareableLink = `${$page.url.origin}/fights/${$page.params.id}/respond`;
    $$rendered = `${`${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-[20px] w-[100px] rounded-full" }, {}, {})}`}`;
  } while (!$$settled);
  $$unsubscribe_t();
  $$unsubscribe_formData();
  $$unsubscribe_locale();
  $$unsubscribe_page();
  $$unsubscribe_startDate();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-9-38aBbW.js.map
