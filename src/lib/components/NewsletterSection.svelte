<script lang="ts">
	import { checkVisibility } from '$lib/actions';
	import { m } from '$lib/translations';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Mail from 'lucide-svelte/icons/mail';
	import Check from 'lucide-svelte/icons/check';

	let email = $state('');
	let isLoading = $state(false);
	let message = $state('');
	let isSuccess = $state(false);
	let isError = $state(false);

	async function handleSubscribe(event: Event) {
		event.preventDefault();

		if (!email || isLoading) return;

		isLoading = true;
		message = '';
		isSuccess = false;
		isError = false;

		try {
			const response = await fetch('/api/mailing-list/newsletter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			});

			const data = await response.json();

			if (response.ok && data.success) {
				isSuccess = true;
				message = data.message || 'Erfolgreich angemeldet! Wir freuen uns, dich in unserem Newsletter begrüßen zu dürfen.';
				email = ''; // Clear the input
			} else {
				isError = true;
				message = data.error || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
			}
		} catch (error) {
			console.error('Newsletter subscription error:', error);
			isError = true;
			message = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="-mt-16 mb-24 md:mb-40 flex items-center justify-center">
	<div
		use:checkVisibility
		class="is-visible:translate-y-0 is-visible:opacity-100 transform translate-y-10 opacity-0 rounded-2xl bg-white p-8 transition-all duration-700 md:p-12"
	>
		<div class="mx-auto max-w-2xl">
			<h2 class="mb-16 font-display text-3xl font-semibold md:text-4xl">
				Bleib auf dem Laufenden
			</h2>

			<p class="mb-4 text-gray-600">
				Erhalte Updates zu neuen Features und Impulse, wie du schwierige Gespräche führst, deine Gefühle verstehst und Konflikte klärst – einfach, empathisch, umsetzbar.
			</p>

			{#if isSuccess}
				<div
					class="flex items-center gap-2 text-green-800"
				>
				<div class="size-5 bg-green-400 rounded-full flex items-center justify-center shrink-0">
					<Check class="size-3" />
				</div>
					<p class="font-medium">{message}</p>
				</div>
			{:else}
				<form onsubmit={handleSubscribe} class="">
					<div class="flex flex-col gap-4 md:flex-row items-center">
						<Input
							type="email"
							bind:value={email}
							placeholder="deine@email.de"
							required
							disabled={isLoading}
							class="flex-1"
						/>
						<button type="submit" disabled={isLoading || !email} class="whitespace-nowrap cursor-pointer">
							{#if isLoading}
								Wird gesendet...
							{:else}
							<div class="flex items-center gap-2 bg-green-400 px-4 py-1.5 rounded-lg border border-black/10">
								<Mail class="h-4 w-4" />
								Anmelden
							</div>
							{/if}
						</button>
					</div>

					{#if isError && message}
						<p class="mt-3 text-sm text-red-600">{message}</p>
					{/if}

					<p class="mt-2 text-xs text-gray-500">
						Wir spammen nicht. Du kannst dich jederzeit abmelden. Versprochen ✌️.
					</p>
				</form>
			{/if}
		</div>
	</div>
</div>
