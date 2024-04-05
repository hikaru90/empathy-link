<script>
  import { locale, locales } from 'svelte-i18n'
  import * as Select from "$lib/components/ui/select";

  const handleSelect = (event) => {
    locale.update(() => event.value)
  }
</script>

<Select.Root onSelectedChange={handleSelect}>
  <Select.Trigger class="w-16">
    <Select.Value placeholder={$locale} />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each $locales as locale}
        <Select.Item value={locale} label={locale}
          >{locale}</Select.Item
        >
      {/each}
    </Select.Group>
  </Select.Content>
  <Select.Input name="favoriteFruit" />
</Select.Root>
