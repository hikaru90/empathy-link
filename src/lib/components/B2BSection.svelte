<script lang="ts">
	import { checkVisibility } from '$lib/actions';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import Briefcase from 'lucide-svelte/icons/briefcase';
	import Check from 'lucide-svelte/icons/check';
	import Send from 'lucide-svelte/icons/send';

	let name = $state('');
	let companyName = $state('');
	let email = $state('');
	let message = $state('');
	let isLoading = $state(false);
	let responseMessage = $state('');
	let isSuccess = $state(false);
	let isError = $state(false);

	const formFields = [
		{
			id: 'b2b-name',
			label: 'Name',
			type: 'text',
			placeholder: 'Max Mustermann',
			value: () => name,
			setValue: (val: string) => (name = val),
			gridCols: 'md:col-span-1'
		},
		{
			id: 'b2b-company',
			label: 'Firmenname',
			type: 'text',
			placeholder: 'Musterfirma GmbH',
			value: () => companyName,
			setValue: (val: string) => (companyName = val),
			gridCols: 'md:col-span-1'
		},
		{
			id: 'b2b-email',
			label: 'Firmen E-Mail',
			type: 'email',
			placeholder: 'kontakt@firma.de',
			value: () => email,
			setValue: (val: string) => (email = val),
			gridCols: 'md:col-span-2'
		},
		{
			id: 'b2b-message',
			label: 'Nachricht',
			type: 'textarea',
			placeholder:
				'Erzähl uns von deinen Herausforderungen und wie wir dich unterstützen können...',
			value: () => message,
			setValue: (val: string) => (message = val),
			gridCols: 'md:col-span-2',
			rows: 5
		}
	];

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!name || !companyName || !email || !message || isLoading) return;

		isLoading = true;
		responseMessage = '';
		isSuccess = false;
		isError = false;

		try {
			const response = await fetch('/api/mailing-list/b2b', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, companyName, email, message })
			});

			const data = await response.json();

			if (response.ok && data.success) {
				isSuccess = true;
				responseMessage =
					data.message || 'Vielen Dank für deine Anfrage! Wir melden uns in Kürze bei dir.';
				// Clear the form
				name = '';
				companyName = '';
				email = '';
				message = '';
			} else {
				isError = true;
				responseMessage = data.error || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
			}
		} catch (error) {
			console.error('B2B inquiry error:', error);
			isError = true;
			responseMessage = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
		} finally {
			isLoading = false;
		}
	}

	const isFormValid = $derived(name && companyName && email && message);
</script>

<div class="bg-black/80 py-24 text-white">
	<div
		use:checkVisibility
		class="max-container translate-y-10 transform rounded-2xl opacity-0 transition-all duration-700 is-visible:translate-y-0 is-visible:opacity-100"
	>
	<div class="flex flex-col md:flex-row">
		<div class="md:w-1/2 md:pr-8">
			<h2 class="mb-16 text-start font-display text-3xl font-semibold md:text-4xl">
				Konflikte kosten Zeit, Geld und die mentale Gesundheit deiner Mitarbeiter:innen
			</h2>
		</div>
	</div>
	</div>

	<div
		use:checkVisibility
		class="max-container translate-y-10 transform rounded-2xl opacity-0 transition-all duration-700 is-visible:translate-y-0 is-visible:opacity-100"
	>
		<div class="flex flex-col md:flex-row">
			<div class="md:w-1/2 md:pr-8">
				<div class="mb-8 space-y-4 text-white/80">
					<p>
						Führungskräfte verbringen bis zu 50 % ihrer wöchentlichen Zeit direkt oder indirekt mit
						Konflikten. Fehlzeiten durch Mobbing oder betriebliche Ängste verursachen allein in
						Deutschland jährliche Kosten von rund 30 Milliarden Euro.
					</p>
					<p>
						Mit Empathy Link unterstützen wir dein Unternehmen dabei, die Feedback- und
						Konfliktkultur nachhaltig zu verbessern: wissenschaftlich fundiert, KI-gestützt und
						alltagstauglich.
					</p>
					<p class="text-orange-800 font-medium">
						Wir suchen aktuell Pilotpartner! Lass uns sprechen!
					</p>
				</div>
			</div>

			<div class="md:w-1/2 md:pl-8">
				{#if isSuccess}
					<div
						class="flex items-center justify-center gap-2 rounded-lg bg-green-50 p-4 text-green-800"
					>
						<div class="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-400">
							<Check class="size-4" />
						</div>
						<p class="font-medium">{responseMessage}</p>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="space-y-4 -mt-4">
						<div class="grid gap-4 md:grid-cols-2">
							{#each formFields as field}
								<div class={field.gridCols}>
									<label for={field.id} class="ml-3 mb-1 block text-xs font-medium text-white/80">
										{field.label}
									</label>
									{#if field.type === 'textarea'}
										<Textarea
											id={field.id}
											value={field.value()}
											oninput={(e) => field.setValue(e.currentTarget.value)}
											placeholder={field.placeholder}
											required
											disabled={isLoading}
											rows={field.rows || 2}
											class="resize-none bg-white/5 h-8"
										/>
									{:else}
										<Input
											id={field.id}
											type={field.type}
											value={field.value()}
											oninput={(e) => field.setValue(e.currentTarget.value)}
											placeholder={field.placeholder}
											required
											disabled={isLoading}
											class="bg-white/5"
										/>
									{/if}
								</div>
							{/each}
						</div>

						{#if isError && responseMessage}
							<div class="rounded-lg bg-red-50 p-3 text-sm text-red-600">
								{responseMessage}
							</div>
						{/if}

						<button
							type="submit"
							disabled={isLoading || !isFormValid}
							class="w-full cursor-pointer"
						>
							{#if isLoading}
								<div
									class="flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-gray-400 px-6 py-3 text-black"
								>
									<span>Wird gesendet...</span>
								</div>
							{:else}
								<div
									class="flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-green-400 px-6 py-3 text-black"
								>
									<Send class="h-5 w-5" />
									<span>Anfrage senden</span>
								</div>
							{/if}
						</button>

						<p class="text-center text-xs text-neutral-300">
							Deine Daten werden vertraulich behandelt und nur für die Kontaktaufnahme verwendet.
						</p>
					</form>
				{/if}
			</div>
		</div>
	</div>
</div>
