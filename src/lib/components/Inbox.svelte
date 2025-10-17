<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Trash2, Bell, CheckCircle, Circle, Calendar, AlertCircle } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	interface Message {
		id: string;
		title: string;
		content: string;
		type: 'system' | 'public_announcement' | 'user' | 'reminder';
		read: boolean;
		priority: number;
		created: string;
		sentAt: string;
		reminderData?: string;
	}

	interface MessagesResponse {
		messages: Message[];
		totalPages: number;
		currentPage: number;
		unreadCount: number;
	}

	let messages: Message[] = $state([]);
	let unreadCount = $state(0);
	let totalPages = $state(1);
	let currentPage = $state(1);
	let selectedMessage: Message | null = $state(null);
	let showMessageDialog = $state(false);
	let filterType = $state('all');
	let showUnreadOnly = $state(false);
	let loading = $state(false);

	async function fetchMessages() {
		loading = true;
		try {
			const params = new URLSearchParams({
				page: currentPage.toString(),
				perPage: '10'
			});
			
			if (filterType !== 'all') {
				params.append('type', filterType);
			}
			
			if (showUnreadOnly) {
				params.append('unread', 'true');
			}

			const response = await fetch(`/api/messages?${params}`);
			if (response.ok) {
				const data: MessagesResponse = await response.json();
				messages = data.messages;
				unreadCount = data.unreadCount;
				totalPages = data.totalPages;
			}
		} catch (error) {
			console.error('Failed to fetch messages:', error);
		} finally {
			loading = false;
		}
	}

	async function markAsRead(messageId: string) {
		try {
			// Use the new read receipt endpoint
			const response = await fetch(`/api/messages/${messageId}/read`, {
				method: 'POST'
			});

			if (response.ok) {
				// Update local state immediately
				messages = messages.map(m =>
					m.id === messageId ? { ...m, read: true } : m
				);
				if (selectedMessage?.id === messageId) {
					selectedMessage = { ...selectedMessage, read: true };
				}
				unreadCount = Math.max(0, unreadCount - 1);
			} else if (response.status === 404) {
				// Message no longer exists, remove it from the list
				console.warn('Message not found, removing from list:', messageId);
				messages = messages.filter(m => m.id !== messageId);
				if (selectedMessage?.id === messageId) {
					selectedMessage = null;
					showMessageDialog = false;
				}
				// Refetch to sync with server
				await fetchMessages();
			}
		} catch (error) {
			console.error('Failed to mark message as read:', error);
		}
	}

	async function deleteMessage(messageId: string) {
		try {
			const response = await fetch(`/api/messages/${messageId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				messages = messages.filter(m => m.id !== messageId);
				selectedMessage = null;
				showMessageDialog = false;
				if (messages.length === 0 && currentPage > 1) {
					currentPage = currentPage - 1;
					await fetchMessages();
				}
			}
		} catch (error) {
			console.error('Failed to delete message:', error);
		}
	}

	function openMessage(message: Message) {
		selectedMessage = message;
		showMessageDialog = true;
		if (!message.read) {
			markAsRead(message.id);
		}
	}

	function getTypeColor(type: string) {
		switch (type) {
			case 'public_announcement':
				return 'bg-blue-100 text-blue-800';
			case 'reminder':
				return 'bg-orange-100 text-orange-800';
			case 'system':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-green-100 text-green-800';
		}
	}

	function getTypeIcon(type: string) {
		switch (type) {
			case 'public_announcement':
				return Bell;
			case 'reminder':
				return Calendar;
			case 'system':
				return AlertCircle;
			default:
				return Circle;
		}
	}

	function getPriorityColor(priority: number) {
		switch (priority) {
			case 3:
				return 'border-l-red-500';
			case 2:
				return 'border-l-orange-500';
			default:
				return 'border-l-gray-300';
		}
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return 'Heute';
		} else if (diffDays === 1) {
			return 'Gestern';
		} else if (diffDays < 7) {
			return `vor ${diffDays} Tagen`;
		} else {
			return date.toLocaleDateString('de-DE');
		}
	}

	onMount(() => {
		fetchMessages();
	});

	// Refetch when filters change
	$effect(() => {
		// Track these dependencies
		filterType;
		showUnreadOnly;
		currentPage;
		// Refetch when any of these change
		fetchMessages();
	});
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-b border-gray-200 p-4">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold">
				Nachrichten
				{#if unreadCount > 0}
					<Badge variant="destructive" class="ml-2">{unreadCount}</Badge>
				{/if}
			</h2>
			
			<div class="flex items-center gap-2">
				<Select.Root bind:value={filterType} type="single">
					<Select.Trigger class="w-[140px]">
						{filterType === 'all' ? 'Alle' : 
						 filterType === 'public_announcement' ? 'Ankündigungen' : 
						 filterType === 'reminder' ? 'Erinnerungen' : 
						 filterType === 'system' ? 'System' : 'Filter'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="all" label="Alle">Alle</Select.Item>
						<Select.Item value="public_announcement" label="Ankündigungen">Ankündigungen</Select.Item>
						<Select.Item value="reminder" label="Erinnerungen">Erinnerungen</Select.Item>
						<Select.Item value="system" label="System">System</Select.Item>
					</Select.Content>
				</Select.Root>
				
				<Button
					variant={showUnreadOnly ? "default" : "outline"}
					size="sm"
					onclick={() => showUnreadOnly = !showUnreadOnly}
				>
					Nur ungelesene
				</Button>
			</div>
		</div>
	</div>

	<!-- Message List -->
	<div class="flex-1 overflow-y-auto">
		{#if loading}
			<div class="flex items-center justify-center p-8">
				<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
			</div>
		{:else if messages.length === 0}
			<div class="flex flex-col items-center justify-center p-8 text-center">
				<Bell class="h-12 w-12 text-gray-400 mb-4" />
				<p class="text-gray-500 text-lg mb-2">Keine Nachrichten</p>
				<p class="text-gray-400 text-sm">Alle Nachrichten sind gelesen oder es sind keine vorhanden.</p>
			</div>
		{:else}
			<div class="divide-y divide-gray-100">
				{#each messages as message}
					{@const TypeIcon = getTypeIcon(message.type)}
					<div
						class={cn(
							"cursor-pointer p-4 hover:bg-gray-50 border-l-4 transition-colors",
							message.read ? 'bg-white' : 'bg-blue-50',
							getPriorityColor(message.priority)
						)}
						onclick={() => openMessage(message)}
					>
						<div class="flex items-start justify-between">
							<div class="flex items-start gap-3 flex-1">
								<div class="flex items-center gap-2 mt-1">
									{#if !message.read}
										<Circle class="h-3 w-3 text-blue-500 fill-current" />
									{:else}
										<CheckCircle class="h-3 w-3 text-gray-400" />
									{/if}
									<TypeIcon class="h-4 w-4 text-gray-500" />
								</div>
								
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-1">
										<h3 class={cn(
											"font-medium truncate",
											!message.read ? 'text-gray-900' : 'text-gray-700'
										)}>
											{message.title}
										</h3>
										<Badge variant="secondary" class={getTypeColor(message.type)}>
											{message.type === 'public_announcement' ? 'Ankündigung' : 
											 message.type === 'reminder' ? 'Erinnerung' :
											 message.type === 'system' ? 'System' : 'Nachricht'}
										</Badge>
									</div>
									<p class="text-sm text-gray-600 truncate">{message.content}</p>
									<p class="text-xs text-gray-500 mt-1">
										{formatDate(message.sentAt || message.created)}
									</p>
								</div>
							</div>
							
							{#if message.priority > 1}
								<div class="flex items-center gap-1">
									{#if message.priority === 3}
										<Badge variant="destructive" class="text-xs">Urgent</Badge>
									{:else if message.priority === 2}
										<Badge variant="secondary" class="text-xs bg-orange-100 text-orange-800">High</Badge>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="flex items-center justify-between border-t border-gray-200 px-4 py-3">
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage === 1}
						onclick={() => currentPage = currentPage - 1}
					>
						Zurück
					</Button>
					<span class="text-sm text-gray-700">
						Seite {currentPage} von {totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage === totalPages}
						onclick={() => currentPage = currentPage + 1}
					>
						Weiter
					</Button>
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- Message Detail Dialog -->
<Dialog.Root bind:open={showMessageDialog}>
	<Dialog.Content class="max-w-2xl max-h-[80vh] overflow-y-auto">
		{#if selectedMessage}
			<Dialog.Header>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<Dialog.Title>{selectedMessage.title}</Dialog.Title>
						<Badge variant="secondary" class={getTypeColor(selectedMessage.type)}>
							{selectedMessage.type === 'public_announcement' ? 'Ankündigung' : 
							 selectedMessage.type === 'reminder' ? 'Erinnerung' :
							 selectedMessage.type === 'system' ? 'System' : 'Nachricht'}
						</Badge>
					</div>
					
					{#if selectedMessage.type !== 'public_announcement' && selectedMessage.type !== 'system'}
						<Button
							variant="ghost"
							size="sm"
							onclick={() => selectedMessage && deleteMessage(selectedMessage.id)}
						>
							<Trash2 class="h-4 w-4" />
						</Button>
					{/if}
				</div>
				
				<Dialog.Description class="text-sm text-gray-500">
					{formatDate(selectedMessage.sentAt || selectedMessage.created)}
				</Dialog.Description>
			</Dialog.Header>
			
			<div class="mt-4">
				<div class="prose max-w-none">
					<p class="whitespace-pre-wrap text-gray-700">{selectedMessage.content}</p>
				</div>
				
				{#if selectedMessage.reminderData}
					{@const reminderData = JSON.parse(selectedMessage.reminderData)}
					{#if reminderData.reminderId}
						<div class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
							<p class="text-sm text-orange-800">
								Diese Nachricht wurde durch eine Erinnerung ausgelöst.
							</p>
						</div>
					{/if}
				{/if}
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>