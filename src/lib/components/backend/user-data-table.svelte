<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import { Input } from "$lib/components/ui/input";

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
		totalTokens: number;
		avgSentimentPolarity: number;
		avgEmpathyRate: number;
		lastActivity: string;
	}

	interface Props {
		data: UserStat[];
	}

	let { data }: Props = $props();

	let filterValue = $state("");

	function formatDateTime(dateString: string) {
		return new Date(dateString).toLocaleString('de-DE');
	}

	// Simple client-side filtering
	let filteredData = $derived(
		filterValue.trim() === "" 
			? data 
			: data.filter(user => {
				const search = filterValue.toLowerCase();
				return (
					user.firstName?.toLowerCase().includes(search) ||
					user.lastName?.toLowerCase().includes(search) ||
					user.email?.toLowerCase().includes(search) ||
					user.role?.toLowerCase().includes(search)
				);
			})
	);
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<Input
			placeholder="Filter users..."
			bind:value={filterValue}
			class="max-w-sm"
		/>
		<div class="text-sm text-muted-foreground">
			{filteredData?.length || 0} of {data?.length || 0} user(s)
		</div>
	</div>
	
	<div class="rounded-md border border-white/20 bg-offwhite">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="font-medium">User</Table.Head>
					<Table.Head class="font-medium">Role</Table.Head>
					<Table.Head class="font-medium text-right">Chats</Table.Head>
					<Table.Head class="font-medium text-right">Analyses</Table.Head>
					<Table.Head class="font-medium text-right">Traces</Table.Head>
					<Table.Head class="font-medium text-right">Errors</Table.Head>
					<Table.Head class="font-medium text-right">Total Tokens</Table.Head>
					<Table.Head class="font-medium text-right">Avg Sentiment</Table.Head>
					<Table.Head class="font-medium text-right">Avg Empathy</Table.Head>
					<Table.Head class="font-medium">Last Activity</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if filteredData?.length > 0}
					{#each filteredData as user}
						<Table.Row>
							<Table.Cell>
								<div>
									<div class="font-medium">{user.firstName} {user.lastName}</div>
									<div class="text-sm text-muted-foreground">{user.email}</div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium {user.role === 'admin' 
									? 'bg-red-50 text-red-700' 
									: 'bg-blue-50 text-blue-700'}">
									{user.role}
								</span>
							</Table.Cell>
							<Table.Cell class="text-right">{user.chatCount}</Table.Cell>
							<Table.Cell class="text-right">{user.analysisCount}</Table.Cell>
							<Table.Cell class="text-right">
								<span class="text-blue-600">{user.traceCount}</span>
							</Table.Cell>
							<Table.Cell class="text-right">
								<span class="text-red-600">{user.errorCount}</span>
							</Table.Cell>
							<Table.Cell class="text-right">
								{#if user.totalTokens > 0}
									<span class="text-purple-600">{user.totalTokens.toLocaleString()}</span>
								{:else}
									<span class="text-muted-foreground">-</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-right">
								{#if user.avgSentimentPolarity !== 0}
									<span class="{user.avgSentimentPolarity > 0 ? 'text-green-600' : 'text-red-600'}">
										{user.avgSentimentPolarity > 0 ? '+' : ''}{user.avgSentimentPolarity}
									</span>
								{:else}
									<span class="text-muted-foreground">-</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-right">
								{#if user.avgEmpathyRate !== 0}
									<span class="text-blue-600">{user.avgEmpathyRate}%</span>
								{:else}
									<span class="text-muted-foreground">-</span>
								{/if}
							</Table.Cell>
							<Table.Cell>{formatDateTime(user.lastActivity)}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan="10" class="text-center text-muted-foreground py-8">
							{#if !data || data.length === 0}
								No users found
							{:else}
								No users match your search
							{/if}
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>