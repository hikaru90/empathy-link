import { c as compute_rest_props, s as subscribe, a as null_to_empty } from "../../../../chunks/utils.js";
import { c as create_ssr_component, s as spread, g as escape_attribute_value, h as escape_object, a as add_attribute, v as validate_component, e as escape } from "../../../../chunks/ssr.js";
import { S as Skeleton } from "../../../../chunks/skeleton.js";
import { c as cn } from "../../../../chunks/index3.js";
import { p as pb } from "../../../../chunks/pocketbase.js";
import { t } from "../../../../chunks/translations.js";
import { e as endDate } from "../../../../chunks/dashboard.js";
import "../../../../chunks/client.js";
import { u as user } from "../../../../chunks/auth.js";
import "clsx";
import { b as delay } from "../../../../chunks/helpers.js";
import "dequal";
import { A as AppTopMenu } from "../../../../chunks/AppTopMenu.js";
import { A as AppBottomMenu } from "../../../../chunks/AppBottomMenu.js";
import "../../../../chunks/index4.js";
import "../../../../chunks/schema.js";
import "ts-deepmerge";
import "../../../../chunks/formData.js";
import "../../../../chunks/index.js";
import "memoize-weak";
import "zod-to-json-schema";
import "../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
/* empty css                                                              */
import { B as Button$1 } from "../../../../chunks/index6.js";
import "../../../../chunks/page.js";
import { B as Button } from "../../../../chunks/index5.js";
import { C as CaretLeft } from "../../../../chunks/CaretLeft.js";
const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "size"]);
  let { color = "currentColor" } = $$props;
  let { size = 15 } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
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
const css$2 = {
  code: ".skeumorphic-button.svelte-5cv73o{transition:box-shadow 50ms;box-shadow:var(--skeumorphic-shadow-light)}",
  map: `{"version":3,"file":"FightOverviewAll.svelte","sources":["FightOverviewAll.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { Skeleton } from \\"$lib/components/ui/skeleton\\";\\nimport { Button } from \\"$lib/components/ui/button-op1/index.js\\";\\nimport { onMount } from \\"svelte\\";\\nimport { pb } from \\"$scripts/pocketbase\\";\\nimport { t } from \\"$lib/translations\\";\\nimport { endDate } from \\"$store/dashboard\\";\\nimport { goto } from \\"$app/navigation\\";\\nimport { CaretRight, Check, Cross2 } from \\"radix-icons-svelte\\";\\nimport { user } from \\"$store/auth\\";\\nimport SparklePill from \\"$lib/components/SparklePill.svelte\\";\\nimport { Plus } from \\"radix-icons-svelte\\";\\nimport { delay } from \\"$scripts/helpers\\";\\nimport { Switch } from \\"$lib/components/ui/switch\\";\\nimport { Label } from \\"$lib/components/ui/label/index.js\\";\\nlet initialized = false;\\nlet pending = true;\\nlet records = [];\\nlet page = 1;\\nconst perPage = 5;\\nlet endReached = false;\\nlet displayResolved = true;\\nconst fetchData = async () => {\\n  pending = true;\\n  const newRecords = await pb.collection(\\"fights\\").getList(page, perPage, {\\n    filter: \`owner = '\${$user.id}'\`,\\n    sort: \\"-updated\\",\\n    expand: \\"responses\\"\\n  });\\n  if (newRecords.items.length === 0) endReached = true;\\n  await delay(1e3);\\n  records = [...records, ...newRecords.items];\\n  pending = false;\\n};\\n$: filteredRecords = displayResolved ? records : records.filter((record) => !record.resolved);\\nendDate.subscribe(async () => {\\n  console.log(\\"endDate changed -> fetching data\\");\\n  pending = true;\\n  await fetchData();\\n});\\nconst loadMore = () => {\\n  page++;\\n  fetchData();\\n};\\nconst gotoFight = (id) => {\\n  console.log(\\"gotoFight\\");\\n  goto(\`/app/fights/\${id}\`);\\n};\\nonMount(async () => {\\n  await fetchData();\\n  console.log(\\"records\\", records);\\n  initialized = true;\\n  console.log(\\"$user\\", $user);\\n});\\n<\/script>\\r\\n\\r\\n{#if !initialized}\\r\\n\\t<Skeleton class=\\"h-[20px] w-[100px] rounded-full\\" />\\r\\n{:else}\\r\\n\\t<div class=\\"relative z-0\\">\\r\\n\\t\\t<div\\r\\n\\t\\t\\tstyle=\\"background: radial-gradient(circle at center, rgba(255,255,255,0.7), transparent 67%);\\"\\r\\n\\t\\t\\tclass=\\"absolute left-0 top-20 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 transform dark:opacity-10\\"\\r\\n\\t\\t></div>\\r\\n\\t</div>\\r\\n\\t<div class=\\"relative z-10\\">\\r\\n\\t\\t<div\\r\\n\\t\\t\\tclass=\\"rounded-t-xl border-b border-black/5 bg-almostwhite px-5 pb-3 pt-4 shadow-2xl shadow-black/10 dark:bg-muted\\"\\r\\n\\t\\t>\\r\\n\\t\\t\\t<div class=\\"flex items-center justify-between mb-4\\">\\r\\n\\t\\t\\t\\t<h2 class=\\"text-md font-bold\\">\\r\\n\\t\\t\\t\\t\\t{$t('default.page.fight.title')}\\r\\n\\t\\t\\t\\t</h2>\\r\\n\\t\\t\\t\\t<div class=\\"flex items-center gap-1\\">\\r\\n\\t\\t\\t\\t\\t<Switch\\r\\n\\t\\t\\t\\t\\t\\tid=\\"lightMode\\"\\r\\n\\t\\t\\t\\t\\t\\tbind:checked={displayResolved}\\r\\n\\t\\t\\t\\t\\t\\ton:click={() => (displayResolved = !displayResolved)}\\r\\n\\t\\t\\t\\t\\t\\tclass=\\"bg-gray-500 transform scale-75\\"\\r\\n\\t\\t\\t\\t\\t\\t/>\\r\\n\\t\\t\\t\\t\\t\\t<Label for=\\"lightMode\\" class=\\"cursor-pointer\\">{$t('default.page.fights.displayResolved')}</Label>\\r\\n\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t\\t<div class=\\"flex items-center text-2xs text-neutral-400\\">\\r\\n\\t\\t\\t\\t<div class=\\"w-1/6\\">\\r\\n\\t\\t\\t\\t\\t{$t('default.page.dashboard.fights.table.resolved')}\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t<div class=\\"w-1/3\\">\\r\\n\\t\\t\\t\\t\\t{$t('default.page.dashboard.fights.table.partner')}\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t<div class=\\"w-1/4\\">\\r\\n\\t\\t\\t\\t\\t{$t('default.page.dashboard.fights.table.date')}\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t<div class=\\"w-1/6\\">\\r\\n\\t\\t\\t\\t\\t{$t('default.page.dashboard.fights.table.opened')}\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t<div class=\\"w-1/6\\"></div>\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t</div>\\r\\n\\t\\t<div\\r\\n\\t\\t\\tclass=\\"rounded-b-xl bg-almostwhite px-4 pb-3 pt-2 shadow-2xl shadow-black/10 dark:bg-muted\\"\\r\\n\\t\\t>\\r\\n\\t\\t\\t<div>\\r\\n\\t\\t\\t\\t{#each filteredRecords as record}\\r\\n\\t\\t\\t\\t\\t<button\\r\\n\\t\\t\\t\\t\\t\\ton:click={gotoFight(record.id)}\\r\\n\\t\\t\\t\\t\\t\\tclass=\\"group flex w-full items-center border-b border-black/5 py-2 text-left text-xs last:border-b-0 sm:py-3\\"\\r\\n\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"flex w-1/6\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t{#if record.resolved}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"rounded-full text-green-600/80 p-1 text-2xs\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Check class=\\"size-3\\" />\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{:else}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"rounded-full text-red-600/80 p-1 text-2xs\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Cross2 class=\\"size-3\\" />\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t{/if}\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"input-fade-right mr-2 w-1/3 overflow-hidden whitespace-nowrap\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t{record.name}\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"w-1/4\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t{new Intl.DateTimeFormat('de-DE', {\\r\\n\\t\\t\\t\\t\\t\\t\\t\\tmonth: 'short',\\r\\n\\t\\t\\t\\t\\t\\t\\t\\tday: 'numeric'\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t// year: 'numeric',\\r\\n\\t\\t\\t\\t\\t\\t\\t}).format(new Date(record.created))}\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"w-1/6\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t{#if record.opened}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<Check class=\\"h-3 w-3 text-black\\" />\\r\\n\\t\\t\\t\\t\\t\\t\\t{:else}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<Cross2 class=\\"h-3 w-3 text-black\\" />\\r\\n\\t\\t\\t\\t\\t\\t\\t{/if}\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t<div class=\\"flex w-1/6 justify-end\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"skeumorphic-button rounded-full p-0.5\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<CaretRight\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"h-4 w-4 rounded-full group-hover:bg-neutral-300 group-hover:text-black\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t/>\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t</button>\\r\\n\\t\\t\\t\\t{/each}\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t\\t{#if !endReached}\\r\\n\\t\\t\\t\\t<div class=\\"mt-4 flex items-center justify-center\\">\\r\\n\\t\\t\\t\\t\\t<Button\\r\\n\\t\\t\\t\\t\\t\\tdecoration=\\"floating-op1\\"\\r\\n\\t\\t\\t\\t\\t\\tnoInnerShadow\\r\\n\\t\\t\\t\\t\\t\\ton:click={loadMore}\\r\\n\\t\\t\\t\\t\\t\\tclass=\\"gap-3 border-neutral-100 bg-almostwhite text-black hover:bg-almostwhite dark:border-neutral-800 dark:bg-muted dark:text-white\\"\\r\\n\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t<SparklePill\\r\\n\\t\\t\\t\\t\\t\\t\\tfast={true}\\r\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"-ml-2 -mr-1 h-3 w-5 shadow-xl transition-all duration-500 dark:shadow-gray-200/30 {pending\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t? 'max-h-4 max-w-10 opacity-100'\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t: 'max-h-0 max-w-0 opacity-0'}\\"\\r\\n\\t\\t\\t\\t\\t\\t/>\\r\\n\\t\\t\\t\\t\\t\\t{$t('default.page.fights.loadMore')}\\r\\n\\t\\t\\t\\t\\t\\t<Plus class=\\"-mr-2 h-4 w-4\\" />\\r\\n\\t\\t\\t\\t\\t</Button>\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t{:else}\\r\\n\\t\\t\\t\\t<div class=\\"mt-6 flex items-center gap-2 text-2xs text-neutral-400\\">\\r\\n\\t\\t\\t\\t\\t{$t('default.page.dashboard.fights.endReached')}\\r\\n\\t\\t\\t\\t\\t<div class=\\"mt-0.5 flex-grow border-t border-black/5\\"></div>\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t{/if}\\r\\n\\t\\t</div>\\r\\n\\t</div>\\r\\n{/if}\\r\\n\\r\\n<style lang=\\"scss\\">.skeumorphic-button {\\n  transition: box-shadow 50ms;\\n  box-shadow: var(--skeumorphic-shadow-light);\\n}</style>\\r\\n"],"names":[],"mappings":"AA6KmB,iCAAoB,CACrC,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,IAAI,0BAA0B,CAC5C"}`
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
    if (newRecords2.items.length === 0) ;
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
  map: `{"version":3,"file":"ReceivedLinks.svelte","sources":["ReceivedLinks.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { Skeleton } from \\"$lib/components/ui/skeleton\\";\\nimport { onMount } from \\"svelte\\";\\nimport { pb } from \\"$scripts/pocketbase\\";\\nimport { t } from \\"$lib/translations\\";\\nimport { endDate } from \\"$store/dashboard\\";\\nimport { goto } from \\"$app/navigation\\";\\nimport { CaretRight, Check, Cross2 } from \\"radix-icons-svelte\\";\\nimport { delay } from \\"$scripts/helpers\\";\\nimport { Switch } from \\"$lib/components/ui/switch\\";\\nimport { Label } from \\"$lib/components/ui/label/index.js\\";\\nimport { browser } from \\"$app/environment\\";\\nimport { cn } from \\"$lib/utils\\";\\nimport { user } from \\"$store/auth\\";\\nlet className = void 0;\\nexport { className as class };\\nlet initialized = false;\\nlet pending = true;\\nlet records = [];\\nlet page = 1;\\nlet endReached = false;\\nlet displayResolved = true;\\nlet openedFights = [];\\nconst fetchData = async () => {\\n  try {\\n    pending = true;\\n    const existingRecords = await pb.collection(\\"fights\\").getFullList({\\n      filter: \`opponent = '\${$user.id}'\`,\\n      requestKey: \\"existingRecords\\",\\n      expand: \\"owner\\"\\n    });\\n    records = existingRecords;\\n    console.log(\\"existingRecords\\", existingRecords.map((record) => record.id));\\n    openedFights = openedFights.filter((fightId) => !existingRecords.map((record) => record.id).includes(fightId));\\n    console.log(\\"openedFights\\", openedFights);\\n    const filterString = openedFights.map((fightId) => \`owner != '\${$user.id}' && id = '\${fightId}'\`).join(\\" || \\");\\n    console.log(\\"filterString\\", filterString);\\n    if (filterString) {\\n      const newRecords2 = await pb.collection(\\"fights\\").getFullList({\\n        sort: \\"-created\\",\\n        filter: filterString,\\n        requestKey: \\"receivedLinks\\",\\n        expand: \\"owner\\"\\n      });\\n      transferOpenedLinks(newRecords2);\\n    }\\n    await delay(1e3);\\n    records = [...records, ...newRecords];\\n    console.log(\\"newRecords\\", newRecords);\\n    pending = false;\\n  } catch (error) {\\n    console.error(\\"Error fetching receivedLinksdata\\", error);\\n  }\\n};\\n$: filteredRecords = displayResolved ? records : records.filter((record) => !record.resolved);\\nconst transferOpenedLinks = (records2) => {\\n  console.log(\\"transferRecords\\", records2);\\n  if (browser) {\\n    localStorage.removeItem(\\"openedFights\\");\\n  }\\n  records2.forEach(async (record) => {\\n    if ($user.id === record.owner) return;\\n    await pb.collection(\\"fights\\").update(record.id, { opponent: $user.id });\\n  });\\n};\\nendDate.subscribe(async () => {\\n  console.log(\\"endDate changed -> fetching data\\");\\n  pending = true;\\n  await fetchData();\\n});\\nconst loadMore = () => {\\n  page++;\\n  fetchData();\\n};\\nconst gotoFight = (id) => {\\n  console.log(\\"gotoFight\\");\\n  goto(\`/app/fights/\${id}/respond\`);\\n};\\nonMount(async () => {\\n  if (browser) {\\n    const storedFights = localStorage.getItem(\\"openedFights\\");\\n    if (storedFights) {\\n      openedFights = JSON.parse(storedFights);\\n    }\\n  }\\n  await fetchData();\\n  initialized = true;\\n});\\n<\/script>\\r\\n\\r\\n<div class={cn(className, '')}>\\r\\n\\t{#if !initialized}\\r\\n\\t\\t<Skeleton class=\\"h-[20px] w-[100px] rounded-full\\" />\\r\\n\\t{:else}\\r\\n\\t\\t<div class=\\"relative z-0\\">\\r\\n\\t\\t\\t<div\\r\\n\\t\\t\\t\\tstyle=\\"background: radial-gradient(circle at center, rgba(255,255,255,0.7), transparent 67%);\\"\\r\\n\\t\\t\\t\\tclass=\\"absolute right-0 top-20 z-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 transform dark:opacity-10\\"\\r\\n\\t\\t\\t></div>\\r\\n\\t\\t</div>\\r\\n\\t\\t<div class=\\"relative z-10 shadow-2xl shadow-black/10\\">\\r\\n\\t\\t\\t<div\\r\\n\\t\\t\\t\\tclass=\\"rounded-t-xl border-b border-black/5 bg-white/30 dark:bg-neutral-900 px-5 pb-3 pt-4 \\"\\r\\n\\t\\t\\t>\\r\\n\\t\\t\\t\\t<div class=\\"mb-4 flex items-center justify-between\\">\\r\\n\\t\\t\\t\\t\\t<h2 class=\\"text-md font-bold\\">\\r\\n\\t\\t\\t\\t\\t\\t{$t('default.page.fights.receivedLinks.heading')}\\r\\n\\t\\t\\t\\t\\t</h2>\\r\\n\\t\\t\\t\\t\\t<div class=\\"flex items-center gap-1\\">\\r\\n\\t\\t\\t\\t\\t\\t<Switch\\r\\n\\t\\t\\t\\t\\t\\t\\tid=\\"lightMode\\"\\r\\n\\t\\t\\t\\t\\t\\t\\tbind:checked={displayResolved}\\r\\n\\t\\t\\t\\t\\t\\t\\ton:click={() => (displayResolved = !displayResolved)}\\r\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"scale-75 transform bg-gray-500\\"\\r\\n\\t\\t\\t\\t\\t\\t/>\\r\\n\\t\\t\\t\\t\\t\\t<Label for=\\"lightMode\\" class=\\"cursor-pointer\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t>{$t('default.page.fights.displayResolved')}</Label\\r\\n\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t<div class=\\"flex items-center text-2xs text-neutral-400\\">\\r\\n\\t\\t\\t\\t\\t<div class=\\"w-1/6\\">\\r\\n\\t\\t\\t\\t\\t\\t{$t('default.page.dashboard.fights.table.resolved')}\\r\\n\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t<div class=\\"w-1/3\\">\\r\\n\\t\\t\\t\\t\\t\\t{$t('default.page.dashboard.fights.table.partner')}\\r\\n\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t<div class=\\"w-1/4\\">\\r\\n\\t\\t\\t\\t\\t\\t{$t('default.page.dashboard.fights.table.date')}\\r\\n\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t<div class=\\"w-1/6\\">\\r\\n\\t\\t\\t\\t\\t\\t{$t('default.page.dashboard.fights.table.opened')}\\r\\n\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t<div class=\\"w-1/6\\"></div>\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t\\t<div\\r\\n\\t\\t\\t\\tclass=\\"rounded-b-xl bg-white/30 dark:bg-neutral-900 px-4 pb-3 pt-2 shadow-2xl shadow-black/10\\"\\r\\n\\t\\t\\t>\\r\\n\\t\\t\\t\\t<div>\\r\\n\\t\\t\\t\\t\\t{#each filteredRecords as record}\\r\\n\\t\\t\\t\\t\\t\\t<button\\r\\n\\t\\t\\t\\t\\t\\t\\ton:click={gotoFight(record.id)}\\r\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"group flex w-full items-center border-b border-black/5 py-2 text-left text-xs last:border-b-0 sm:py-3\\"\\r\\n\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"flex w-1/6\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{#if record.resolved}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"rounded-full p-1 text-2xs text-green-600/80\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<Check class=\\"size-3\\" />\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{:else}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"rounded-full p-1 text-2xs text-red-600/80\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\t<Cross2 class=\\"size-3\\" />\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"input-fade-right mr-2 w-1/3 overflow-hidden whitespace-nowrap\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{record.expand.owner.firstName}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"w-1/4\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{new Intl.DateTimeFormat('de-DE', {\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tmonth: 'short',\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\tday: 'numeric'\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t// year: 'numeric',\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t}).format(new Date(record.created))}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"w-1/6\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{#if record.opened}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Check class=\\"h-3 w-3 text-black\\" />\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{:else}\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<Cross2 class=\\"h-3 w-3 text-black\\" />\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t{/if}\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t<div class=\\"flex w-1/6 justify-end\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t<div class=\\"skeumorphic-button rounded-full p-0.5\\">\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t<CaretRight\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t\\tclass=\\"h-4 w-4 rounded-full group-hover:bg-neutral-300 group-hover:text-black\\"\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t\\t/>\\r\\n\\t\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t\\t\\t\\t</button>\\r\\n\\t\\t\\t\\t\\t{/each}\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t</div>\\r\\n\\t{/if}\\r\\n</div>\\r\\n\\r\\n<style lang=\\"scss\\">.skeumorphic-button {\\n  transition: box-shadow 50ms;\\n  box-shadow: var(--skeumorphic-shadow-light);\\n}</style>\\r\\n"],"names":[],"mappings":"AA2LmB,iCAAoB,CACrC,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,IAAI,0BAA0B,CAC5C"}`
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
      if ($user.id === record.owner) return;
      await pb.collection("fights").update(record.id, { opponent: $user.id });
    });
  };
  endDate.subscribe(async () => {
    console.log("endDate changed -> fetching data");
    pending = true;
    await fetchData();
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0) $$bindings.class(className);
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
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import FightOverviewAll from \\"$lib/components/FightOverviewAll.svelte\\";\\nimport AppTopMenu from \\"$lib/components/AppTopMenu.svelte\\";\\nimport AppBottomMenu from \\"$lib/components/AppBottomMenu.svelte\\";\\nimport LoginForm from \\"$lib/components/LoginForm.svelte\\";\\nimport { t } from \\"$lib/translations\\";\\nimport { Button as SparkleButton } from \\"$lib/components/ui/button-sparkle\\";\\nimport { Plus } from \\"radix-icons-svelte\\";\\nimport { user } from \\"$store/auth\\";\\nimport { onMount } from \\"svelte\\";\\nimport { goto } from \\"$app/navigation\\";\\nimport { Button } from \\"$lib/components/ui/button-op1/index.js\\";\\nimport { CaretLeft } from \\"radix-icons-svelte\\";\\nimport { backgroundColor } from \\"$store/page\\";\\nimport ReceivedLinks from \\"$lib/components/ReceivedLinks.svelte\\";\\nonMount(() => {\\n  if (!$user) goto(\\"/app/auth/login\\");\\n  backgroundColor.set(\\"bg-background\\");\\n});\\n<\/script>\\r\\n\\r\\n{#if $user}\\r\\n\\t<div class=\\"flex h-full flex-grow flex-col justify-between overflow-hidden\\">\\r\\n\\t\\t<AppTopMenu />\\r\\n\\t\\t<div class=\\"max-container flex-grow pb-40\\">\\r\\n\\t\\t\\t<div\\r\\n\\t\\t\\t\\tclass=\\"relative z-10 mb-8 flex flex-row items-start justify-between py-4 md:items-center md:bg-transparent md:pb-6\\"\\r\\n\\t\\t\\t>\\r\\n\\t\\t\\t\\t<h1 class=\\"font-heading text-lg font-semibold\\">{$t('default.page.fight.heading')}</h1>\\r\\n\\t\\t\\t</div>\\r\\n\\t\\t\\t<ReceivedLinks class=\\"mb-14\\" />\\r\\n\\t\\t\\t<FightOverviewAll />\\r\\n\\t\\t\\t<AppBottomMenu>\\r\\n\\t\\t\\t\\t<div class=\\"relative flex h-auto items-center justify-between\\">\\r\\n\\t\\t\\t\\t\\t<a href=\\"/app/dashboard\\" class=\\"block\\">\\r\\n\\t\\t\\t\\t\\t\\t<Button\\r\\n\\t\\t\\t\\t\\t\\t\\tdecoration=\\"dark-op1\\"\\r\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200\\"\\r\\n\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t<CaretLeft class=\\"h-4 w-4 rounded-full\\" />\\r\\n\\t\\t\\t\\t\\t\\t</Button>\\r\\n\\t\\t\\t\\t\\t</a>\\r\\n\\t\\t\\t\\t\\t<a href=\\"/app/fights/create\\" class=\\"skeumorphic-button-dark inline-block rounded-full mr-1 md:mr-0.5\\">\\r\\n\\t\\t\\t\\t\\t\\t<SparkleButton\\r\\n\\t\\t\\t\\t\\t\\t\\tclass=\\"flex items-center justify-between gap-10 rounded-full pl-5 pr-3 font-bold text-black dark:shadow-gray-300/30\\"\\r\\n\\t\\t\\t\\t\\t\\t>\\r\\n\\t\\t\\t\\t\\t\\t\\t{$t('default.page.fights.create')}\\r\\n\\t\\t\\t\\t\\t\\t\\t<Plus class=\\"h-4 w-4\\" />\\r\\n\\t\\t\\t\\t\\t\\t</SparkleButton>\\r\\n\\t\\t\\t\\t\\t</a>\\r\\n\\t\\t\\t\\t</div>\\r\\n\\t\\t\\t</AppBottomMenu>\\r\\n\\t\\t</div>\\r\\n\\t</div>\\r\\n{/if}\\r\\n\\r\\n<style lang=\\"scss\\">.skeumorphic-button-dark {\\n  transition: box-shadow 50ms;\\n  box-shadow: inset 0 0 8px 0 rgba(0, 0, 0, 0.2), var(--skeumorphic-shadow);\\n}</style>\\r\\n"],"names":[],"mappings":"AAuDmB,sCAAyB,CAC1C,UAAU,CAAE,UAAU,CAAC,IAAI,CAC3B,UAAU,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,IAAI,oBAAoB,CAC1E"}`
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
            return `${escape($t("default.page.fights.create"))} ${validate_component(Plus, "Plus").$$render($$result, { class: "h-4 w-4" }, {}, {})}`;
          }
        }
      )}</a></div>`;
    }
  })}</div></div>` : ``}`;
});
export {
  Page as default
};
