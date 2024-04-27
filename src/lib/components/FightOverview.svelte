<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { t, locale } from '$lib/translations';
	import { startDate, endDate } from '$store/dashboard';

	let initialized = false;
  let pending = true;
	let records = [];

	const fetchData = async () => {
    const filter = `created >= "${$startDate.toString()} 00:00:00" && created < "${$endDate.toString()} 00:00:00"`
    console.log('filter',filter);
		records = await pb.collection('fights').getFullList({
			filter: filter,
			sort: '-updated',
			expand: 'responses'
		});
	};

  endDate.subscribe(async() => {
    console.log('endDate changed -> fetching data');
    pending = true
    await fetchData()
    setTimeout(() => {
      pending = false
    }, 200);
  })

	onMount(async () => {
		await fetchData();
		initialized = true;
		pending = false;
	});
</script>

{#if !initialized || pending}
	<Skeleton class="h-[20px] w-[100px] rounded-full" />
{:else}
	<div class="rounded border border-input">
		<Table.Root>
			<Table.Caption>{$t('default.page.dashboard.fights.tableCaption')}</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Id</Table.Head>
					<Table.Head>Streitpartner</Table.Head>
					<Table.Head>Datum</Table.Head>
					<Table.Head class="text-right">Opened</Table.Head>
					<Table.Head class="text-right">Round</Table.Head>
					<Table.Head class="text-right"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each records as record}
					<Table.Row>
						<Table.Cell class="font-medium">{record.id}</Table.Cell>
						<Table.Cell>{record.name}</Table.Cell>
						<Table.Cell>{record.created}</Table.Cell>
						<Table.Cell class="text-right">{record.opened}</Table.Cell>
						<Table.Cell class="text-right">{record.responses?.length + 1}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{/if}
