<script>
  import { locale, locales } from '$lib/translations'
  import * as Select from "$lib/components/ui/select";
  import IconLang from "$assets/icons/icon-lang.svg?raw";

  const handleSelect = (event) => {
    locale.update(() => event.value)
  }
</script>

  <Select.Root onSelectedChange={handleSelect}>
    <Select.Button class="p-1 flex items-center justify-center">
      <div class="w-4 flex items-center stroke-blue-500 dark:fill-white">
        {@html IconLang}
      </div>
    </Select.Button>
    <Select.Content>
      <Select.Group>
        {#each $locales as locale}
        <Select.Item value={locale} label={locale} noIndicator="true" class="p-1"
        >{locale}</Select.Item
        >
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="favoriteFruit" />
  </Select.Root>