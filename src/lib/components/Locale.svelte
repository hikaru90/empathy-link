<script lang="ts">
  import * as Select from "$lib/components/ui/select";
  import IconLang from "$assets/icons/icon-lang.svg?raw";
	import { setCookie } from '$scripts/helpers';
  import { locales } from '$src/paraglide/runtime'
  import { setLocale } from '$lib/translations'

  type SelectedChangeEvent = { value: string } | undefined;

  const handleSelect: (event: SelectedChangeEvent) => void = (event) => {
    if (event && (event.value === 'en' || event.value === 'de')) {
      setCookie('locale', event.value)
      setLocale(event.value)
    }
  }
</script>

  <Select.Root onSelectedChange={handleSelect}>
    <Select.Button class="p-1 flex items-center justify-center">
      <div class="w-4 flex items-center stroke-blue-500 dark:fill-white">
        {@html IconLang}
      </div>
    </Select.Button>
    <Select.Content >
      <Select.Group>
        {#each locales as locale}
        <Select.Item value={locale} label={locale} noIndicator="true" class="p-1"
        >{locale}</Select.Item
        >
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="favoriteFruit" />
  </Select.Root>