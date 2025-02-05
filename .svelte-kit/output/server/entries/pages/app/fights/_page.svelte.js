import { c as compute_rest_props, s as subscribe, a as null_to_empty } from "../../../../chunks/utils.js";
import { c as create_ssr_component, s as spread, g as escape_attribute_value, h as escape_object, a as add_attribute, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { S as Skeleton } from "../../../../chunks/skeleton.js";
import { a as cn } from "../../../../chunks/page.js";
import { p as pb } from "../../../../chunks/pocketbase.js";
import { t } from "../../../../chunks/translations.js";
import { e as endDate } from "../../../../chunks/dashboard.js";
import "../../../../chunks/client.js";
import { u as user } from "../../../../chunks/auth.js";
import "clsx";
import { b as delay } from "../../../../chunks/helpers.js";
import { A as AppTopMenu, a as AppBottomMenu } from "../../../../chunks/AppBottomMenu.js";
import "../../../../chunks/index.js";
import "../../../../chunks/index3.js";
import "../../../../chunks/schema.js";
import "../../../../chunks/memoize.js";
import "../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
/* empty css                                                              */
import { B as Button$1 } from "../../../../chunks/index4.js";
import { B as Button } from "../../../../chunks/switch.js";
import { C as CaretLeft } from "../../../../chunks/CaretLeft.js";
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
const css$2 = {
  code: ".skeumorphic-button.svelte-5cv73o{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: null
};
const perPage = 5;
const FightOverviewAll = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  let $$unsubscribe_t;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t, (value) => value);
  let records = [];
  let page = 1;
  const fetchData = async () => {
    const newRecords2 = await pb.collection("fights").getList(page, perPage, {
      filter: `owner = '${$user.id}'`,
      sort: "-updated",
      expand: "responses"
    });
    if (newRecords2.items.length === 0)
      ;
    await delay(1e3);
    records = [...records, ...newRecords2.items];
  };
  endDate.subscribe(async () => {
    console.log("endDate changed -> fetching data");
    await fetchData();
  });
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${`${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-[20px] w-[100px] rounded-full" }, {}, {})}`}`;
  } while (!$$settled);
  $$unsubscribe_user();
  $$unsubscribe_t();
  return $$rendered;
});
const css$1 = {
  code: ".skeumorphic-button.svelte-5cv73o{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: null
};
const ReceivedLinks = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  let $$unsubscribe_t;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t, (value) => value);
  let { class: className = void 0 } = $$props;
  let pending = true;
  let records = [];
  let openedFights = [];
  const fetchData = async () => {
    try {
      pending = true;
      const existingRecords = await pb.collection("fights").getFullList({
        filter: `opponent = '${$user.id}'`,
        requestKey: "existingRecords",
        expand: "owner"
      });
      records = existingRecords;
      console.log("existingRecords", existingRecords.map((record) => record.id));
      openedFights = openedFights.filter((fightId) => !existingRecords.map((record) => record.id).includes(fightId));
      console.log("openedFights", openedFights);
      const filterString = openedFights.map((fightId) => `owner != '${$user.id}' && id = '${fightId}'`).join(" || ");
      console.log("filterString", filterString);
      if (filterString) {
        const newRecords2 = await pb.collection("fights").getFullList({
          sort: "-created",
          filter: filterString,
          requestKey: "receivedLinks",
          expand: "owner"
        });
        transferOpenedLinks(newRecords2);
      }
      await delay(1e3);
      records = [...records, ...newRecords];
      console.log("newRecords", newRecords);
      pending = false;
    } catch (error) {
      console.error("Error fetching receivedLinksdata", error);
    }
  };
  const transferOpenedLinks = (records2) => {
    console.log("transferRecords", records2);
    records2.forEach(async (record) => {
      if ($user.id === record.owner)
        return;
      await pb.collection("fights").update(record.id, { opponent: $user.id });
    });
  };
  endDate.subscribe(async () => {
    console.log("endDate changed -> fetching data");
    pending = true;
    await fetchData();
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="${escape(null_to_empty(cn(className, "")), true) + " svelte-5cv73o"}">${`${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-[20px] w-[100px] rounded-full" }, {}, {})}`} </div>`;
  } while (!$$settled);
  $$unsubscribe_user();
  $$unsubscribe_t();
  return $$rendered;
});
const css = {
  code: ".skeumorphic-button-dark.svelte-ef713u{transition:box-shadow 50ms;box-shadow:inset 0 0 8px 0 rgba(0, 0, 0, 0.2), var(--skeumorphic-shadow)}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  let $t, $$unsubscribe_t;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  $$result.css.add(css);
  $$unsubscribe_user();
  $$unsubscribe_t();
  return `${$user ? `<div class="flex h-full flex-grow flex-col justify-between overflow-hidden">${validate_component(AppTopMenu, "AppTopMenu").$$render($$result, {}, {}, {})} <div class="max-container flex-grow pb-40"><div class="relative z-10 mb-8 flex flex-row items-start justify-between py-4 md:items-center md:bg-transparent md:pb-6"><h1 class="font-heading text-lg font-semibold">${escape($t("default.page.fight.heading"))}</h1></div> ${validate_component(ReceivedLinks, "ReceivedLinks").$$render($$result, { class: "mb-14" }, {}, {})} ${validate_component(FightOverviewAll, "FightOverviewAll").$$render($$result, {}, {}, {})} ${validate_component(AppBottomMenu, "AppBottomMenu").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="relative flex h-auto items-center justify-between"><a href="/app/dashboard" class="block">${validate_component(Button, "Button").$$render(
        $$result,
        {
          decoration: "dark-op1",
          class: "flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
        },
        {},
        {
          default: () => {
            return `${validate_component(CaretLeft, "CaretLeft").$$render($$result, { class: "h-4 w-4 rounded-full" }, {}, {})}`;
          }
        }
      )}</a> <a href="/app/fights/create" class="skeumorphic-button-dark inline-block rounded-full mr-1 md:mr-0.5 svelte-ef713u">${validate_component(Button$1, "SparkleButton").$$render(
        $$result,
        {
          class: "flex items-center justify-between gap-10 rounded-full pl-5 pr-3 font-bold text-black dark:shadow-gray-300/30"
        },
        {},
        {
          default: () => {
            return `${escape($t("default.page.fights.create"))} ${validate_component(Plus$1, "Plus").$$render($$result, { class: "h-4 w-4" }, {}, {})}`;
          }
        }
      )}</a></div>`;
    }
  })}</div></div>` : ``}`;
});
export {
  Page as default
};
