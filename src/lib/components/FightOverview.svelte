<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { t, locale } from '$lib/translations';
	import { startDate, endDate } from '$store/dashboard';
	import { goto } from '$app/navigation';
	import { CaretRight } from 'radix-icons-svelte';

	let initialized = false;
	let pending = true;
	let records = [];

	const fetchData = async () => {
		const filter = `created >= "${$startDate.toString()} 00:00:00" && created < "${$endDate.toString()} 00:00:00"`;
		console.log('filter', filter);
		records = await pb.collection('fights').getFullList({
			filter: filter,
			sort: '-updated',
			expand: 'responses'
		});
	};

	endDate.subscribe(async () => {
		console.log('endDate changed -> fetching data');
		pending = true;
		await fetchData();
		setTimeout(() => {
			pending = false;
		}, 200);
	});

	const gotoFight = (id) => {
		console.log('gotoFight');
		goto(`/fights/${id}`);
	};

	onMount(async () => {
		await fetchData();
		initialized = true;
		pending = false;
	});
</script>

{#if !initialized}
	<Skeleton class="h-[20px] w-[100px] rounded-full" />
{:else}
	<div class="rounded border border-input">
		<Table.Root>
			<Table.Caption>{$t('default.page.dashboard.fights.tableCaption')}</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">{$t('default.page.dashboard.fights.table.id')}</Table.Head>
					<Table.Head>{$t('default.page.dashboard.fights.table.partner')}</Table.Head>
					<Table.Head>{$t('default.page.dashboard.fights.table.date')}</Table.Head>
					<Table.Head class="">{$t('default.page.dashboard.fights.table.opened')}</Table.Head>
					<Table.Head class="">{$t('default.page.dashboard.fights.table.round')}</Table.Head>
					<Table.Head class="text-right"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each records as record}
					<Table.Row on:click={gotoFight(record.id)} class="group cursor-pointer leading-loose">
						<Table.Cell class="font-medium">{record.id}</Table.Cell>
						<Table.Cell>{record.name}</Table.Cell>
						<Table.Cell>{record.created}</Table.Cell>
						<Table.Cell class="">{record.opened}</Table.Cell>
						<Table.Cell class="">{record.responses?.length + 1}</Table.Cell>
						<Table.Cell class="text-right">
							<CaretRight class="h-4 w-4 group-hover:bg-neon group-hover:text-black rounded-full" />
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{/if}
