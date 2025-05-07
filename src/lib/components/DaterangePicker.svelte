<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Calendar from 'lucide-svelte/icons/calendar';
	import type { DateRange } from 'bits-ui';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	// import { enUS, de } from '@internationalized/date/locale-data';
	import { startDate, endDate } from '$store/dashboard';
	import * as Dialog from '$lib/components/ui/dialog';
	import { t, locale } from '$lib/translations';

	const dispatch = createEventDispatcher();

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let className: string | undefined = undefined;
	export { className as class };
	export let popoverOpen = false;

	let value: DateRange | undefined = {
		start: $startDate,
		end: $endDate
	};

	let startValue: DateValue | undefined = undefined;

	$: if ((value?.start, value?.end)) dispatch('rangeChanged', value);
</script>

<div class={cn(className, 'relative grid w-full gap-2')}>
	<!-- <Popover.Root openFocus bind:open={popoverOpen}>
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
    <Popover.Content align="center" class="p-0 w-auto z-[1002] bg-background border-transparent">
      <RangeCalendar locale='de'
        bind:value
        bind:startValue
        placeholder={value?.start}
        initialFocus
        numberOfMonths={1}
      />
    </Popover.Content>
  </Popover.Root> -->

	<button
		on:click={() => {
			if (!popoverOpen) popoverOpen = !popoverOpen;
		}}
	>
		<Button
			decoration="dark-op1"
			wrapperClass="w-full"
			class={cn(
				'w-full justify-start border-neutral-900 bg-neutral-800 text-left font-normal text-zinc-200',
				!value && 'text-muted-foreground'
			)}
		>
			<!-- builders={[builder]} -->
			<Calendar class="mr-2 h-4 w-4" />
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
	</button>

	<Dialog.Root bind:open={popoverOpen} preventScroll={false} onOutsideClick={(e) => {setTimeout(() => {popoverOpen = false}, 2)}}>
		<Dialog.Content>
			<div class="relative">
				<Dialog.Header>
					<Dialog.Title class="mb-4 max-w-[9em] leading-tight"
						>{$t('default.page.dashboard.selectDate')}</Dialog.Title
					>
					<Dialog.Description>
						<div class="-mx-4">
							<RangeCalendar
								locale="de"
								bind:value
								bind:startValue
								placeholder={value?.start}
								initialFocus
								numberOfMonths={1}
							/>
						</div>
					</Dialog.Description>
				</Dialog.Header>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</div>
