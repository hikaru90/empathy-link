<script lang="ts">
	import { user } from '$store/auth';

	interface Props {
		user?: App.User;
	}

	let { user: userProp }: Props = $props();

	const goals = [
		'Ich möchte meine Emotionen besser verstehen.',
		'Ich möchte lernen, Konflikte als Chance zu sehen.',
		'Ich möchte Konflikte schneller ansprechen.',
		'Ich wünsche mir mehr Ruhe und Gelassenheit für schwierige Gespräche.',
		'Ich möchte mich selbst und andere besser verstehen.',
		'Ich möchte meine Beziehungen stärken.',
	];

	let selectedGoal = $state<string>(userProp?.userGoal || '');
	let isSaving = $state(false);

	async function selectGoal(goal: string) {
		if (!userProp?.id) return;

		selectedGoal = goal;
		isSaving = true;

		try {
			const response = await fetch('/api/user/goal', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ userGoal: goal })
			});

			if (!response.ok) {
				throw new Error('Failed to save user goal');
			}

			// Update the auth store
			user.update(u => u ? { ...u, userGoal: goal } : u);
		} catch (error) {
			console.error('Failed to save user goal:', error);
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="flex flex-col gap-3">
	{#each goals as goal}
		<button
			type="button"
			class="rounded-full px-4 py-2 text-left transition-all {selectedGoal === goal
				? 'bg-black text-white border border-black'
				: 'bg-white/80 border border-white'}"
			onclick={() => selectGoal(goal)}
			disabled={isSaving}
		>
			<p class="text-sm">{goal}</p>
		</button>
	{/each}
</div>
