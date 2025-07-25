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
  let feedbackSubmitted = $state(false);

	const handleRatingClick = (rating: number, event?: Event) => {
		console.log('Star clicked:', rating, event?.type);
		if (event) {
			event.preventDefault();
		}
		userRating = rating;
		feedbackStarted = true;
	};

	const handleRatingTouch = (rating: number, event: TouchEvent) => {
		console.log('Star touched:', rating);
		event.preventDefault();
		event.stopPropagation();
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
		feedbackSubmitted = true;
	};
</script>

<div class="rounded-lg bg-white p-6 shadow-xl mb-6 relative shadow-black/10">
  <h2 class="mb-4 font-bold text-gray-900">Feedback</h2>
  
  {#if feedbackSubmitted}
    <div class="rounded-lg bg-green-50 p-4 border border-green-200">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <p class="text-green-800 font-medium">Vielen Dank für dein Feedback!</p>
      </div>
      <p class="text-green-700 text-sm mt-1">Deine Bewertung und Kommentare helfen uns dabei, unsere Lernmodule zu verbessern.</p>
    </div>
  {:else}
    <div class="space-y-6">
    <!-- Rating -->
    <div class="relative z-10">
      <div id="rating-label" class="mb-2 block text-sm font-medium text-gray-700">
        Wie würdest du dieses Lernmodul bewerten?
      </div>
      <div class="flex gap-2" role="radiogroup" aria-labelledby="rating-label">
        {#each [1, 2, 3, 4, 5] as rating}
          <button
            type="button"
            onclick={(e) => handleRatingClick(rating, e)}
            ontouchstart={(e) => handleRatingTouch(rating, e)}
            class="cursor-pointer transition-colors size-8 touch-manipulation flex items-center justify-center rounded-md relative z-20 {userRating >= rating
              ? 'text-yellow-400 bg-yellow-50'
              : 'text-gray-300 bg-gray-50'} hover:text-yellow-400 hover:bg-yellow-50"
            aria-label="Rate {rating} stars"
            role="radio"
            aria-checked={userRating >= rating}
          >
            <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
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
  {/if}
</div>