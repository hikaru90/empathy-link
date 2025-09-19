<script lang="ts">
	import DataTable from "$lib/components/ui/data-table/data-table.svelte";
	import type { ColumnDef } from "@tanstack/table-core";
	import { renderComponent } from "$lib/components/ui/data-table/index.js";
	import SortableHeaderButton from "$lib/components/backend/sortable-header-button.svelte";

	interface UserStat {
		id: string;
		email: string;
		username: string;
		firstName: string;
		lastName: string;
		role: string;
		created: string;
		chatCount: number;
		analysisCount: number;
		traceCount: number;
		errorCount: number;
		learnSessionCount: number;
		completedSessionCount: number;
		startedSessionCount: number;
		totalTokens: number;
		avgSentimentPolarity: number;
		avgEmpathyRate: number;
		lastActivity: string;
	}

	interface Props {
		data: UserStat[];
	}

	let { data }: Props = $props();

	function formatDateTime(dateString: string) {
		return new Date(dateString).toLocaleString('de-DE');
	}

	const columns: ColumnDef<UserStat>[] = [
		{
			accessorFn: (row) => `${row.firstName} ${row.lastName}`,
			id: 'user',
			header: 'User',
			cell: ({ row }) => {
				const user = row.original;
				return `
					<div>
						<div class="font-medium">${user.firstName} ${user.lastName}</div>
						<div class="text-sm text-muted-foreground">${user.email}</div>
					</div>
				`;
			}
		},
		{
			accessorKey: 'role',
			header: 'Role',
			cell: ({ getValue }) => {
				const role = getValue() as string;
				const isAdmin = role === 'admin';
				return `
					<span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
						isAdmin ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
					}">
						${role}
					</span>
				`;
			}
		},
		{
			accessorKey: 'chatCount',
			header: ({ column }) => renderComponent(SortableHeaderButton, {
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
				text: 'Chats'
			}),
			cell: ({ getValue }) => `<div class="text-right">${getValue()}</div>`
		},
		{
			accessorKey: 'analysisCount',
			header: ({ column }) => renderComponent(SortableHeaderButton, {
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
				text: 'Analyses'
			}),
			cell: ({ getValue }) => `<div class="text-right">${getValue()}</div>`
		},
		{
			accessorKey: 'traceCount',
			header: ({ column }) => renderComponent(SortableHeaderButton, {
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
				text: 'Traces'
			}),
			cell: ({ getValue }) => `<div class="text-right"><span class="text-blue-600">${getValue()}</span></div>`
		},
		{
			accessorKey: 'errorCount',
			header: ({ column }) => renderComponent(SortableHeaderButton, {
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
				text: 'Errors'
			}),
			cell: ({ getValue }) => `<div class="text-right"><span class="text-red-600">${getValue()}</span></div>`
		},
		{
			accessorKey: 'learnSessionCount',
			header: 'Sessions',
			cell: ({ getValue }) => `<div class="text-right"><span class="text-indigo-600">${getValue()}</span></div>`
		},
		{
			accessorKey: 'completedSessionCount',
			header: 'Completed',
			cell: ({ getValue }) => `<div class="text-right"><span class="text-green-600">${getValue()}</span></div>`
		},
		{
			accessorKey: 'totalTokens',
			header: 'Total Tokens',
			cell: ({ getValue }) => {
				const tokens = getValue() as number;
				return tokens > 0 
					? `<div class="text-right"><span class="text-purple-600">${tokens.toLocaleString()}</span></div>`
					: `<div class="text-right"><span class="text-muted-foreground">-</span></div>`;
			}
		},
		{
			accessorKey: 'avgSentimentPolarity',
			header: 'Avg Sentiment',
			cell: ({ getValue }) => {
				const sentiment = getValue() as number;
				if (sentiment === 0) {
					return `<div class="text-right"><span class="text-muted-foreground">-</span></div>`;
				}
				const color = sentiment > 0 ? 'text-green-600' : 'text-red-600';
				const sign = sentiment > 0 ? '+' : '';
				return `<div class="text-right"><span class="${color}">${sign}${sentiment}</span></div>`;
			}
		},
		{
			accessorKey: 'avgEmpathyRate',
			header: 'Avg Empathy',
			cell: ({ getValue }) => {
				const empathy = getValue() as number;
				return empathy !== 0 
					? `<div class="text-right"><span class="text-blue-600">${empathy}%</span></div>`
					: `<div class="text-right"><span class="text-muted-foreground">-</span></div>`;
			}
		},
		{
			accessorKey: 'lastActivity',
			header: 'Last Activity',
			cell: ({ getValue }) => formatDateTime(getValue() as string)
		}
	];
</script>

<DataTable {data} {columns} />