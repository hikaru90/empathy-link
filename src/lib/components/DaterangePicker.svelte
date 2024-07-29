<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import CalendarIcon from "svelte-radix/Calendar.svelte";
  import type { DateRange } from "bits-ui";
  import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button-op1/index.js";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  // import { enUS, de } from '@internationalized/date/locale-data';
  import { startDate, endDate } from '$store/dashboard'
  
  const dispatch = createEventDispatcher();

  const df = new DateFormatter("en-US", {
    dateStyle: "medium"
  });

  let className: string | undefined = undefined;
	export { className as class };
 
  let value: DateRange | undefined = {
    start: $startDate,
    end: $endDate
  };

  let startValue: DateValue | undefined = undefined;

  $: if(value?.start, value?.end) dispatch('rangeChanged', value);
</script>
 
<div class={cn(className, 'grid gap-2 w-full relative')}>
  <Popover.Root openFocus>
    <Popover.Trigger asChild let:builder>
      <Button decoration="dark-op1" wrapperClass="w-full"
        class={cn(
          "w-full justify-start text-left font-normal bg-neutral-800 text-zinc-200 border-neutral-900",
          !value && "text-muted-foreground"
        )}
        builders={[builder]}
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {#if value && value.start}
          {#if value.end}
            {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
              value.end.toDate(getLocalTimeZone())
            )}
          {:else}
            {df.format(value.start.toDate(getLocalTimeZone()))}
          {/if}
        {:else if startValue}
          {df.format(startValue.toDate(getLocalTimeZone()))}
        {:else}
          Pick a date
        {/if}
      </Button>
    </Popover.Trigger>
    <Popover.Content class="p-0 w-auto z-[1002]" align="start">
      <RangeCalendar locale='de'
        bind:value
        bind:startValue
        placeholder={value?.start}
        initialFocus
        numberOfMonths={2}
      />
    </Popover.Content>
  </Popover.Root>
</div>