<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Calendar, Plus } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		open?: boolean;
	}

	let { open = false }: Props = $props();
	
	const dispatch = createEventDispatcher();

	let title = $state('');
	let message = $state('');
	let scheduledDate = $state('');
	let scheduledTime = $state('');
	let recurring = $state('none');
	let recurringInterval = $state(1);
	let endDate = $state('');
	let loading = $state(false);

	async function createReminder() {
		if (!title || !message || !scheduledDate || !scheduledTime) {
			return;
		}

		loading = true;
		
		try {
			const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
			
			const reminderData = {
				title,
				message,
				scheduledFor,
				recurring: recurring === 'none' ? '' : recurring,
				recurringData: recurring !== 'none' ? JSON.stringify({
					interval: recurringInterval,
					endDate: endDate || null
				}) : ''
			};

			const response = await fetch('/api/reminders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(reminderData)
			});

			if (response.ok) {
				dispatch('created');
				resetForm();
				open = false;
			}
		} catch (error) {
			console.error('Failed to create reminder:', error);
		} finally {
			loading = false;
		}
	}

	function resetForm() {
		title = '';
		message = '';
		scheduledDate = '';
		scheduledTime = '';
		recurring = 'none';
		recurringInterval = 1;
		endDate = '';
	}

	// Set minimum date to today
	const today = new Date().toISOString().split('T')[0];
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger asChild let:builder>
		<Button builders={[builder]} class="gap-2">
			<Plus class="h-4 w-4" />
			Neue Erinnerung
		</Button>
	</Dialog.Trigger>
	
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Calendar class="h-5 w-5" />
				Neue Erinnerung erstellen
			</Dialog.Title>
			<Dialog.Description>
				Erstelle eine Erinnerung, die zu einem bestimmten Zeitpunkt als Nachricht gesendet wird.
			</Dialog.Description>
		</Dialog.Header>
		
		<form on:submit|preventDefault={createReminder} class="space-y-4">
			<div class="space-y-2">
				<Label for="title">Titel</Label>
				<Input
					id="title"
					bind:value={title}
					placeholder="Erinnerung Titel"
					required
				/>
			</div>
			
			<div class="space-y-2">
				<Label for="message">Nachricht</Label>
				<Textarea
					id="message"
					bind:value={message}
					placeholder="Was möchtest du dir merken?"
					required
					rows={3}
				/>
			</div>
			
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="date">Datum</Label>
					<Input
						id="date"
						type="date"
						bind:value={scheduledDate}
						min={today}
						required
					/>
				</div>
				
				<div class="space-y-2">
					<Label for="time">Uhrzeit</Label>
					<Input
						id="time"
						type="time"
						bind:value={scheduledTime}
						required
					/>
				</div>
			</div>
			
			<div class="space-y-2">
				<Label>Wiederholen</Label>
				<Select.Root bind:value={recurring} type="single">
					<Select.Trigger>
						{recurring === 'none' ? 'Einmalig' : 
						 recurring === 'daily' ? 'Täglich' : 
						 recurring === 'weekly' ? 'Wöchentlich' : 
						 recurring === 'monthly' ? 'Monatlich' : 'Wiederholung wählen'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="none" label="Einmalig">Einmalig</Select.Item>
						<Select.Item value="daily" label="Täglich">Täglich</Select.Item>
						<Select.Item value="weekly" label="Wöchentlich">Wöchentlich</Select.Item>
						<Select.Item value="monthly" label="Monatlich">Monatlich</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			
			{#if recurring !== 'none'}
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label for="interval">Alle</Label>
						<div class="flex items-center gap-2">
							<Input
								id="interval"
								type="number"
								min="1"
								max="365"
								bind:value={recurringInterval}
								class="w-20"
							/>
							<span class="text-sm text-gray-600">
								{recurring === 'daily' ? 'Tag(e)' :
								 recurring === 'weekly' ? 'Woche(n)' :
								 recurring === 'monthly' ? 'Monat(e)' : ''}
							</span>
						</div>
					</div>
					
					<div class="space-y-2">
						<Label for="endDate">Enddatum (optional)</Label>
						<Input
							id="endDate"
							type="date"
							bind:value={endDate}
							min={scheduledDate || today}
						/>
					</div>
				</div>
			{/if}
			
			<div class="flex justify-end gap-2 pt-4">
				<Button
					type="button"
					variant="outline"
					onclick={() => open = false}
				>
					Abbrechen
				</Button>
				<Button type="submit" disabled={loading}>
					{#if loading}
						Erstelle...
					{:else}
						Erstellen
					{/if}
				</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>