<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { 
		Megaphone, 
		Plus, 
		Calendar, 
		Send, 
		Clock,
		Edit,
		Trash2,
		Eye
	} from 'lucide-svelte';

	interface Message {
		id: string;
		title: string;
		content: string;
		type: string;
		priority: number;
		scheduledFor?: string;
		sentAt?: string;
		created: string;
	}

	let messages: Message[] = $state([]);
	let showCreateForm = $state(false);
	let loading = $state(false);
	let title = $state('');
	let content = $state('');
	let priority = $state(1);
	let scheduledFor = $state('');
	let isScheduled = $state(false);

	async function fetchMessages() {
		try {
			const response = await fetch('/api/messages?type=public_announcement&perPage=50');
			if (response.ok) {
				const data = await response.json();
				messages = data.messages;
			}
		} catch (error) {
			console.error('Failed to fetch messages:', error);
		}
	}

	async function createAnnouncement() {
		if (!title || !content) return;

		loading = true;
		try {
			const messageData = {
				title,
				content,
				type: 'public_announcement',
				priority,
				scheduledFor: isScheduled && scheduledFor ? scheduledFor : undefined
			};

			const response = await fetch('/api/messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(messageData)
			});

			if (response.ok) {
				await fetchMessages();
				resetForm();
				showCreateForm = false;
			}
		} catch (error) {
			console.error('Failed to create announcement:', error);
		} finally {
			loading = false;
		}
	}

	async function deleteMessage(messageId: string) {
		if (!confirm('Sind Sie sicher, dass Sie diese Ankündigung löschen möchten?')) {
			return;
		}

		try {
			const response = await fetch(`/api/messages/${messageId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				await fetchMessages();
			}
		} catch (error) {
			console.error('Failed to delete message:', error);
		}
	}

	function resetForm() {
		title = '';
		content = '';
		priority = 1;
		scheduledFor = '';
		isScheduled = false;
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleString('de-DE');
	}

	function getPriorityLabel(priority: number) {
		switch (priority) {
			case 3: return 'Urgent';
			case 2: return 'Hoch';
			default: return 'Normal';
		}
	}

	function getPriorityColor(priority: number) {
		switch (priority) {
			case 3: return 'destructive';
			case 2: return 'secondary';
			default: return 'outline';
		}
	}

	onMount(() => {
		fetchMessages();
	});

	const today = new Date().toISOString().slice(0, 16);
</script>

<svelte:head>
	<title>Nachrichten-Administration - Empathy Link</title>
</svelte:head>

<div class="container mx-auto p-6">
	<div class="mb-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold flex items-center gap-2 mb-2">
					<Megaphone class="h-6 w-6" />
					Nachrichten-Administration
				</h1>
				<p class="text-gray-600">
					Verwalten Sie öffentliche Ankündigungen und geplante Nachrichten für alle Benutzer.
				</p>
			</div>
			
			<Button onclick={() => showCreateForm = true} class="gap-2">
				<Plus class="h-4 w-4" />
				Neue Ankündigung
			</Button>
		</div>
	</div>

	<!-- Statistics -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
		<Card.Root>
			<Card.Content class="p-4">
				<div class="flex items-center gap-2">
					<Megaphone class="h-5 w-5 text-blue-500" />
					<div>
						<p class="text-sm text-gray-600">Gesamt</p>
						<p class="text-xl font-bold">{messages.length}</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="p-4">
				<div class="flex items-center gap-2">
					<Send class="h-5 w-5 text-green-500" />
					<div>
						<p class="text-sm text-gray-600">Gesendet</p>
						<p class="text-xl font-bold">
							{messages.filter(m => m.sentAt).length}
						</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="p-4">
				<div class="flex items-center gap-2">
					<Clock class="h-5 w-5 text-orange-500" />
					<div>
						<p class="text-sm text-gray-600">Geplant</p>
						<p class="text-xl font-bold">
							{messages.filter(m => m.scheduledFor && !m.sentAt).length}
						</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="p-4">
				<div class="flex items-center gap-2">
					<Badge variant="destructive" class="rounded-full w-3 h-3 p-0"></Badge>
					<div>
						<p class="text-sm text-gray-600">Hohe Priorität</p>
						<p class="text-xl font-bold">
							{messages.filter(m => m.priority >= 2).length}
						</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Messages List -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Alle Ankündigungen</Card.Title>
		</Card.Header>
		<Card.Content class="p-0">
			{#if messages.length === 0}
				<div class="p-8 text-center text-gray-500">
					<Megaphone class="h-12 w-12 mx-auto mb-4 text-gray-300" />
					<p>Keine Ankündigungen vorhanden</p>
				</div>
			{:else}
				<div class="divide-y divide-gray-200">
					{#each messages as message}
						<div class="p-4 hover:bg-gray-50">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-3 mb-2">
										<h3 class="font-medium text-gray-900">{message.title}</h3>
										<Badge variant={getPriorityColor(message.priority)}>
											{getPriorityLabel(message.priority)}
										</Badge>
										{#if message.sentAt}
											<Badge variant="secondary" class="bg-green-100 text-green-800">
												Gesendet
											</Badge>
										{:else if message.scheduledFor}
											<Badge variant="secondary" class="bg-orange-100 text-orange-800">
												Geplant
											</Badge>
										{:else}
											<Badge variant="secondary" class="bg-blue-100 text-blue-800">
												Entwurf
											</Badge>
										{/if}
									</div>
									
									<p class="text-sm text-gray-600 mb-3 line-clamp-2">
										{message.content}
									</p>
									
									<div class="flex items-center gap-4 text-xs text-gray-500">
										<span>Erstellt: {formatDate(message.created)}</span>
										{#if message.scheduledFor}
											<span class="flex items-center gap-1">
												<Calendar class="h-3 w-3" />
												Geplant für: {formatDate(message.scheduledFor)}
											</span>
										{/if}
										{#if message.sentAt}
											<span class="flex items-center gap-1">
												<Send class="h-3 w-3" />
												Gesendet: {formatDate(message.sentAt)}
											</span>
										{/if}
									</div>
								</div>
								
								<div class="flex items-center gap-2 ml-4">
									<Button variant="ghost" size="sm">
										<Eye class="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="sm">
										<Edit class="h-4 w-4" />
									</Button>
									<Button 
										variant="ghost" 
										size="sm"
										onclick={() => deleteMessage(message.id)}
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

<!-- Create Announcement Dialog -->
<Dialog.Root bind:open={showCreateForm}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Megaphone class="h-5 w-5" />
				Neue Ankündigung erstellen
			</Dialog.Title>
			<Dialog.Description>
				Erstellen Sie eine öffentliche Ankündigung, die alle Benutzer sehen können.
			</Dialog.Description>
		</Dialog.Header>
		
		<form on:submit|preventDefault={createAnnouncement} class="space-y-4">
			<div class="space-y-2">
				<Label for="title">Titel</Label>
				<Input
					id="title"
					bind:value={title}
					placeholder="Ankündigung Titel"
					required
				/>
			</div>
			
			<div class="space-y-2">
				<Label for="content">Inhalt</Label>
				<Textarea
					id="content"
					bind:value={content}
					placeholder="Ankündigung Inhalt"
					required
					rows={4}
				/>
			</div>
			
			<div class="space-y-2">
				<Label>Priorität</Label>
				<Select.Root bind:value={priority} type="single">
					<Select.Trigger>
						{priority === 1 ? 'Normal' : 
						 priority === 2 ? 'Hoch' : 
						 priority === 3 ? 'Urgent' : 'Priorität wählen'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value={1} label="Normal">Normal</Select.Item>
						<Select.Item value={2} label="Hoch">Hoch</Select.Item>
						<Select.Item value={3} label="Urgent">Urgent</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			
			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					id="scheduled"
					bind:checked={isScheduled}
					class="rounded border-gray-300"
				/>
				<Label for="scheduled">Für später planen</Label>
			</div>
			
			{#if isScheduled}
				<div class="space-y-2">
					<Label for="scheduledFor">Sendezeitpunkt</Label>
					<Input
						id="scheduledFor"
						type="datetime-local"
						bind:value={scheduledFor}
						min={today}
						required={isScheduled}
					/>
				</div>
			{/if}
			
			<div class="flex justify-end gap-2 pt-4">
				<Button
					type="button"
					variant="outline"
					onclick={() => showCreateForm = false}
				>
					Abbrechen
				</Button>
				<Button type="submit" disabled={loading}>
					{#if loading}
						Erstelle...
					{:else if isScheduled}
						Planen
					{:else}
						Sofort senden
					{/if}
				</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>