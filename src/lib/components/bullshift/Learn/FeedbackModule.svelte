<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
  import Star from 'lucide-svelte/icons/star'

	interface Props {
		feedbackType: 'learnContent';
		name: string;
		color?: string;
		onFeedbackSubmit?: (feedback: {
			rating: number;
			feedback: string;
			improvements: string;
		}) => void;
	}

	let { feedbackType, name, color = '#10b981', onFeedbackSubmit }: Props = $props();

	let userRating = $state(0);
	let userFeedback = $state('');
	let improvements = $state('');
  let feedbackStarted = $state(false);

	const handleRatingClick = (rating: number) => {
		userRating = rating;
    feedbackStarted = true;
	};

	const submitFeedback = () => {
		if (onFeedbackSubmit) {
			onFeedbackSubmit({
				rating: userRating,
				feedback: userFeedback,
				improvements: improvements
			});
		}
	};
</script>

<div class="rounded-lg bg-white p-6 shadow-lg">
  <h2 class="mb-4 font-bold text-gray-900">Feedback</h2>
  <div class="space-y-6">
    <!-- Rating -->
    <div>
      <label class="mb-2 block text-sm font-medium text-gray-700">
        Wie würdest du dieses Lernmodul bewerten?
      </label>
      <div class="flex gap-2">
        {#each [1, 2, 3, 4, 5] as rating}
          <button
            type="button"
            onclick={() => handleRatingClick(rating)}
            class="text-3xl transition-colors {userRating >= rating
              ? 'text-yellow-400'
              : 'text-gray-300'} hover:text-yellow-400"
          >
          ★
          </button>
        {/each}
      </div>
    </div>

    {#if feedbackStarted}

    <!-- Feedback -->
    <div>
      <label for="feedback" class="mb-2 block text-sm font-medium text-gray-700">
        Was denkst du über dieses Modul? (optional)
      </label>
      <Textarea
        id="feedback"
        bind:value={userFeedback}
        placeholder="Teile deine Gedanken über den Inhalt, die Übungen und die Gesamterfahrung..."
        rows={4}
      />
    </div>

    <!-- Improvements -->
    <div>
      <label for="improvements" class="mb-2 block text-sm font-medium text-gray-700">
        Wie könnten wir dieses Modul verbessern? (optional)
      </label>
      <Textarea
        id="improvements"
        bind:value={improvements}
        placeholder="Vorschläge für Verbesserungen, zusätzliche Inhalte oder Änderungen, die du gerne sehen würdest..."
        rows={3}
      />
    </div>

    <!-- Submit Button -->
    <button
      type="button"
      onclick={submitFeedback}
      disabled={userRating === 0}
      class="w-full rounded-lg px-6 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      style="background-color: {userRating > 0 ? color : '#9CA3AF'}"
    >
      Feedback absenden
    </button>
    {/if}
  </div>
</div>