import { c as compute_rest_props, s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, s as spread, g as escape_attribute_value, h as escape_object, a as add_attribute, v as validate_component, e as escape } from "../../../chunks/ssr.js";
import { e as endDate, S as Skeleton } from "../../../chunks/skeleton.js";
import "../../../chunks/index3.js";
import { p as pb } from "../../../chunks/pocketbase.js";
import { t } from "../../../chunks/translations.js";
import "../../../chunks/client.js";
import { u as user } from "../../../chunks/auth.js";
import "clsx";
import { M as Menu } from "../../../chunks/Menu.js";
import "../../../chunks/index.js";
import "../../../chunks/schema.js";
import "../../../chunks/memoize.js";
import "../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { B as Button } from "../../../chunks/index4.js";
const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "size"]);
  let { color = "currentColor" } = $$props;
  let { size = 15 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  return `<svg${spread(
    [
      { width: escape_attribute_value(size) },
      { height: escape_attribute_value(size) },
      { viewBox: "0 0 15 15" },
      { fill: "none" },
      { xmlns: "http://www.w3.org/2000/svg" },
      escape_object($$restProps)
    ],
    {}
  )}><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"${add_attribute("fill", color, 0)}></path></svg>`;
});
const Plus$1 = Plus;
const perPage = 5;
const FightOverviewAll = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  let $$unsubscribe_t;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t, (value) => value);
  let records = [];
  let page = 1;
  const fetchData = async () => {
    const newRecords = await pb.collection("fights").getList(page, perPage, {
      filter: `owner = '${$user.id}'`,
      sort: "-updated",
      expand: "responses"
    });
    if (newRecords.items.length === 0)
      ;
    records = [...records, ...newRecords.items];
  };
  endDate.subscribe(async () => {
    console.log("endDate changed -> fetching data");
    await fetchData();
    setTimeout(
      () => {
      },
      200
    );
  });
  $$unsubscribe_user();
  $$unsubscribe_t();
  return `${`${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-[20px] w-[100px] rounded-full" }, {}, {})}`}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  let $t, $$unsubscribe_t;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$unsubscribe_user();
  $$unsubscribe_t();
  return `${$user ? `<div class="flex h-full flex-grow flex-col justify-between"><div class="max-container flex-grow py-10">${validate_component(Menu, "Menu").$$render($$result, {}, {}, {})}  <a href="/fights/create" class="flex w-full items-center justify-center rounded-lg border border-border py-4 lg:py-12 mb-10">${validate_component(Button, "SparkleButton").$$render(
    $$result,
    {
      class: "flex items-center justify-between gap-10 px-3 py-5 font-bold text-black shadow-lg dark:shadow-gray-300/30 lg:px-6 lg:py-7 lg:text-lg"
    },
    {},
    {
      default: () => {
        return `${escape($t("default.page.fights.create"))} ${validate_component(Plus$1, "Plus").$$render($$result, { class: "h-5 w-5" }, {}, {})}`;
      }
    }
  )}</a> ${validate_component(FightOverviewAll, "FightOverviewAll").$$render($$result, {}, {}, {})}</div></div>` : ``}`;
});
export {
  Page as default
};
