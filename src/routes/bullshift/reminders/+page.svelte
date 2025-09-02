<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import ReminderForm from '$lib/components/ReminderForm.svelte';
	import { 
		Calendar, 
		Clock, 
		Repeat, 
		Trash2, 
		Edit,
		Play,
		Pause,
		Plus
	} from 'lucide-svelte';

	interface Reminder {
		id: string;
		title: string;
		message: string;
		scheduledFor: string;
		recurring: string;
		recurringData?: string;
		active: boolean;
		lastSent?: string;
		created: string;
	}

	let reminders: Reminder[] = $state([]);
	let loading = $state(false);
	let showCreateForm = $state(false);

	async function fetchReminders() {
		loading = true;
		try {
			const response = await fetch('/api/reminders?active=true');
			if (response.ok) {
				const data = await response.json();
				reminders = data.reminders;
			}
		} catch (error) {
			console.error('Failed to fetch reminders:', error);
		} finally {
			loading = false;
		}
	}

	async function toggleReminder(reminderId: string, active: boolean) {
		try {
			const response = await fetch(`/api/reminders/${reminderId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ active })
			});

			if (response.ok) {
				reminders = reminders.map(r => 
					r.id === reminderId ? { ...r, active } : r
				);
			}
		} catch (error) {
			console.error('Failed to toggle reminder:', error);
		}
	}

	async function deleteReminder(reminderId: string) {
		if (!confirm('Sind Sie sicher, dass Sie diese Erinnerung löschen möchten?')) {
			return;
		}

		try {
			const response = await fetch(`/api/reminders/${reminderId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				reminders = reminders.filter(r => r.id !== reminderId);
			}
		} catch (error) {
			console.error('Failed to delete reminder:', error);
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleString('de-DE');
	}

	function formatRecurring(recurring: string, recurringData?: string) {
		if (!recurring) return 'Einmalig';
		
		try {
			const data = recurringData ? JSON.parse(recurringData) : {};
			const interval = data.interval || 1;
			
			switch (recurring) {
				case 'daily':
					return interval === 1 ? 'Täglich' : `Alle ${interval} Tage`;
				case 'weekly':
					return interval === 1 ? 'Wöchentlich' : `Alle ${interval} Wochen`;
				case 'monthly':
					return interval === 1 ? 'Monatlich' : `Alle ${interval} Monate`;
				default:
					return recurring;
			}
		} catch {
			return recurring;
		}
	}

	function isOverdue(scheduledFor: string) {
		return new Date(scheduledFor) < new Date();
	}

	function getNextReminder() {
		const active = reminders.filter(r => r.active);
		if (active.length === 0) return null;
		
		return active.reduce((next, current) => {
			const currentDate = new Date(current.scheduledFor);
			const nextDate = new Date(next.scheduledFor);
			return currentDate < nextDate ? current : next;
		});
	}

	onMount(() => {
		fetchReminders();
	});

	const nextReminder = getNextReminder();
	const activeCount = reminders.filter(r => r.active).length;
	const overdueCount = reminders.filter(r => r.active && isOverdue(r.scheduledFor)).length;
</script>

<svelte:head>
	<title>Meine Erinnerungen - Empathy Link</title>
</svelte:head>

<div class="container mx-auto p-6">
	<div class="mb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold flex items-center gap-2 mb-2">
					<Calendar class="h-6 w-6" />
					Meine Erinnerungen
				</h1>
				<p class="text-gray-600">
					Verwalten Sie Ihre persönlichen Erinnerungen und erhalten Sie Benachrichtigungen zur gewünschten Zeit.
				</p>
			</div>
			
			<ReminderForm bind:open={showCreateForm} on:created={fetchReminders} />
		</div>
	</div>

	<!-- Statistics -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
		<Card.Root>
			<Card.Content class="p-4">
				<div class="flex items-center gap-2">
					<Calendar class="h-5 w-5 text-blue-500" />
					<div>
						<p class="text-sm text-gray-600">Aktive Erinnerungen</p>
						<p class="text-xl font-bold">{activeCount}</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="p-4">
				<div class="flex items-center gap-2">
					<Clock class="h-5 w-5 text-orange-500" />
					<div>
						<p class="text-sm text-gray-600">Überfällig</p>
						<p class="text-xl font-bold text-orange-600">{overdueCount}</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="p-4">
				<div class="flex items-center gap-2">
					<Repeat class="h-5 w-5 text-purple-500" />
					<div>
						<p class="text-sm text-gray-600">Wiederkehrend</p>
						<p class="text-xl font-bold">
							{reminders.filter(r => r.recurring && r.active).length}
						</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Next Reminder -->
	{#if nextReminder}
		<Card.Root class="mb-6 border-blue-200 bg-blue-50">
			<Card.Content class="p-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="p-2 bg-blue-100 rounded-full">
							<Clock class="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<h3 class="font-medium text-blue-900">Nächste Erinnerung</h3>
							<p class="text-sm text-blue-700">{nextReminder.title}</p>
							<p class="text-xs text-blue-600">
								{formatDate(nextReminder.scheduledFor)}
							</p>
						</div>
					</div>
					
					{#if isOverdue(nextReminder.scheduledFor)}
						<Badge variant="destructive">Überfällig</Badge>
					{:else}
						<Badge class="bg-blue-100 text-blue-800">Geplant</Badge>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Reminders List -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Alle Erinnerungen</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			{#if loading}
				<div class="p-8 text-center">
					<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
				</div>
			{:else if reminders.length === 0}
				<div class="p-8 text-center text-gray-500">
					<Calendar class="h-12 w-12 mx-auto mb-4 text-gray-300" />
					<p class="text-lg mb-2">Keine Erinnerungen</p>
					<p class="text-sm mb-4">Erstellen Sie Ihre erste Erinnerung, um benachrichtigt zu werden.</p>
					<Button onclick={() => showCreateForm = true} class="gap-2">
						<Plus class="h-4 w-4" />
						Erste Erinnerung erstellen
					</Button>
				</div>
			{:else}
				<div class="divide-y divide-gray-200">
					{#each reminders as reminder}
						<div class="p-4 hover:bg-gray-50">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-2">
										<h3 class="font-medium text-gray-900">
											{reminder.title}
										</h3>
										
										{#if reminder.recurring}
											<Badge variant="secondary" class="bg-purple-100 text-purple-800 gap-1">
												<Repeat class="h-3 w-3" />
												{formatRecurring(reminder.recurring, reminder.recurringData)}
											</Badge>
										{:else}
											<Badge variant="outline">Einmalig</Badge>
										{/if}
										
										{#if isOverdue(reminder.scheduledFor) && reminder.active}
											<Badge variant="destructive">Überfällig</Badge>
										{:else if !reminder.active}
											<Badge variant="secondary" class="bg-gray-100 text-gray-600">
												Inaktiv
											</Badge>
										{/if}
									</div>
									
									<p class="text-sm text-gray-600 mb-3">
										{reminder.message}
									</p>
									
									<div class="flex items-center gap-4 text-xs text-gray-500">
										<span class="flex items-center gap-1">
											<Calendar class="h-3 w-3" />
											{formatDate(reminder.scheduledFor)}
										</span>
										{#if reminder.lastSent}
											<span>Letzte Ausführung: {formatDate(reminder.lastSent)}</span>
										{/if}
									</div>
								</div>
								
								<div class="flex items-center gap-2 ml-4">
									<Button
										variant="ghost"
										size="sm"
										onclick={() => toggleReminder(reminder.id, !reminder.active)}
										title={reminder.active ? 'Deaktivieren' : 'Aktivieren'}
									>
										{#if reminder.active}
											<Pause class="h-4 w-4 text-orange-500" />
										{:else}
											<Play class="h-4 w-4 text-green-500" />
										{/if}
									</Button>
									<Button variant="ghost" size="sm" title="Bearbeiten">
										<Edit class="h-4 w-4" />
									</Button>
									<Button 
										variant="ghost" 
										size="sm"
										onclick={() => deleteReminder(reminder.id)}
										title="Löschen"
									>
										<Trash2 class="h-4 w-4 text-red-500" />
									</Button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>