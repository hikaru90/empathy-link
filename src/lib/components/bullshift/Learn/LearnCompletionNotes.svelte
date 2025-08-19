<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import type { TaskCompletionBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';

	interface Props {
		content: TaskCompletionBlock;
		color: string;
		session: LearningSession | null;
		onResponse: (response: any) => void;
		gotoNextStep?: () => void;
		gotoPrevStep?: () => void;
	}

	let { content, color, session, onResponse, gotoNextStep, gotoPrevStep }: Props = $props();

	let completed = $state(false);
	let notes = $state('');
	let timeSpent = $state(0);
	let startTime = $state<number | null>(null);

	// Load existing response if available
	$effect(() => {
		if (session) {
			const existingResponse = session.responses.find(
				r => r.blockType === 'taskCompletion'
			);
			if (existingResponse) {
				completed = existingResponse.response.completed || false;
				notes = existingResponse.response.notes || '';
				timeSpent = existingResponse.response.timeSpent || 0;
			}
		}
	});

	// Start timing when component mounts
	$effect(() => {
		startTime = Date.now();
		return () => {
			if (startTime) {
				timeSpent += Math.floor((Date.now() - startTime) / 1000);
			}
		};
	});

	const handleCompletionChange = () => {
		completed = !completed;
		saveResponse();
	};

	const handleNotesChange = (value: string) => {
		notes = value;
		saveResponse();
	};

	const saveResponse = () => {
		if (startTime) {
			const currentTimeSpent = timeSpent + Math.floor((Date.now() - startTime) / 1000);
			onResponse({
				completed,
				notes: notes.trim() || undefined,
				timeSpent: currentTimeSpent
			});
		}
	};
</script>

<div class="mx-auto mb-8 max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
	<div class="space-y-4">
		<!-- Completion Checkbox -->
		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={handleCompletionChange}
				class="flex h-6 w-6 items-center justify-center rounded border-2 transition-colors"
				style="border-color: {color}; background-color: {completed ? color : 'transparent'}"
			>
				{#if completed}
					<svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
					</svg>
				{/if}
			</button>
			<span class="text-lg font-medium">
				{completed ? 'Aufgabe abgeschlossen' : 'Aufgabe als abgeschlossen markieren'}
			</span>
		</div>

		<!-- Notes Section -->
		{#if content.allowNotes !== false}
			<div class="space-y-2">
				<label for="completion-notes" class="block text-sm font-medium text-gray-700">
					Notizen (optional)
				</label>
				<Textarea
					id="completion-notes"
					value={notes}
					oninput={(e) => {
						const target = e.target as HTMLTextAreaElement;
						handleNotesChange(target.value);
					}}
					onkeydown={(e) => {
						// Always prevent event bubbling to parent components
						// This prevents collapsible blocks from folding when typing in text inputs
						e.stopPropagation();
					}}
					placeholder={content.notesPlaceholder || 'Hier kannst du deine Gedanken, Erkenntnisse oder Beobachtungen festhalten...'}
					rows={4}
					class="w-full resize-none"
				/>
			</div>
		{/if}

		<!-- Time Tracking Display -->
		{#if timeSpent > 0}
			<div class="text-sm text-gray-500">
				Zeit verbracht: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
			</div>
		{/if}
	</div>
</div> 