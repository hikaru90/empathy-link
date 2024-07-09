import { g as get_store_value, s as subscribe } from "../../../../chunks/utils.js";
import { o as onDestroy } from "../../../../chunks/lifecycle.js";
import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import "../../../../chunks/index3.js";
import "../../../../chunks/page.js";
import { t, a as locale } from "../../../../chunks/translations.js";
import "clsx";
import "../../../../chunks/client.js";
import "../../../../chunks/auth.js";
import { p as page } from "../../../../chunks/stores.js";
import { s as superForm } from "../../../../chunks/memoize.js";
import { d as defaults } from "../../../../chunks/defaults.js";
import "../../../../chunks/index.js";
import { a as zod, z as zodClient } from "../../../../chunks/zod.js";
import { z } from "zod";
import { p as pb } from "../../../../chunks/pocketbase.js";
import "../../../../chunks/index5.js";
import { s as startDate, S as Skeleton } from "../../../../chunks/skeleton.js";
import "../../../../chunks/root.svelte_svelte_type_style_lang.js";
import { a as toast } from "../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
const schema = z.object({
  email: z.string().email({ message: get_store_value(t)("default.page.login.form.email.validEmailError") })
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let shareableLink;
  let $t, $$unsubscribe_t;
  let $formData, $$unsubscribe_formData;
  let $locale, $$unsubscribe_locale;
  let $page, $$unsubscribe_page;
  let $$unsubscribe_startDate;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
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
export {
  Page as default
};
