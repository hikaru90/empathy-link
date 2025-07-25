<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import LearnGotoNextButton from './LearnGotoNextButton.svelte';
	import IconPlay from '$assets/icons/audio.svg?raw';
	import * as Popover from '$lib/components/ui/popover/index.js';

	interface Props {
		content: any;
		pageIndex: number;
		blockIndex: number;
		isPreview?: boolean;
		gotoNextStep?: () => void;
		learningContext?: any;
	}

	let {
		content,
		pageIndex,
		blockIndex,
		isPreview = false,
		gotoNextStep,
		learningContext
	}: Props = $props();

	// Animation state
	let isBreathing = $state(false);
	let breathingPhase = $state<'inhale' | 'exhale' | 'pause' | 'hold'>('pause');
	let breathingText = $state('Bereit zum Atmen?');
	let isComplete = $state(false);
	let remainingTime = $state(0);
	let totalDuration = $state(content.duration || 60); // Default 1 minute
	let selectedDuration = $state(content.duration || 60);
	let shouldCompleteAfterExhale = $state(false);

	// Breathing patterns
	type BreathingPattern = '5-7' | '5-5' | 'box';
	let selectedPattern = $state<BreathingPattern>('5-7');

	// Audio elements
	let inhaleAudio: HTMLAudioElement;
	let exhaleAudio: HTMLAudioElement;

	// Animation tweens
	const dotScale = tweened(1, { duration: 1000, easing: cubicInOut });
	const dotOpacity = tweened(0.8, { duration: 1000, easing: cubicInOut });
	const dotRotation = tweened(0, { duration: 1000, easing: cubicInOut });

	// Breathing patterns configuration
	const breathingPatterns = {
		'5-7': {
			name: '5-7 Atmung',
			description: '5s ein-, 7s ausatmen',
			inhale: 5000,
			exhale: 7000,
			hold: 0
		},
		'5-5': {
			name: '5-5 Atmung',
			description: '5s ein-, 5s ausatmen',
			inhale: 5000,
			exhale: 5000,
			hold: 0
		},
		box: {
			name: 'Box Atmung',
			description: '4s ein-, 4s halten, 4s ausatmen, 4s halten',
			inhale: 4000,
			exhale: 4000,
			hold: 4000
		}
	};

	// Current pattern timings
	const currentPattern = $derived(breathingPatterns[selectedPattern]);
	const INHALE_TIME = $derived(currentPattern.inhale);
	const EXHALE_TIME = $derived(currentPattern.exhale);
	const HOLD_TIME = $derived(currentPattern.hold);
	const PAUSE_TIME = $derived(currentPattern.pause);

	let breathingInterval: NodeJS.Timeout;
	let phaseTimeout: NodeJS.Timeout;
	let countdownInterval: NodeJS.Timeout;

	onMount(() => {
		// Initialize audio elements
		try {
			inhaleAudio = new Audio('/audio/breathe-in.mp3');
			exhaleAudio = new Audio('/audio/breathe-out.mp3');

			// Set audio properties
			inhaleAudio.volume = 1;
			exhaleAudio.volume = 1;
			inhaleAudio.preload = 'auto';
			exhaleAudio.preload = 'auto';

			console.log('Audio files initialized successfully');
		} catch (error) {
			console.error('Error initializing audio:', error);
		}
	});

	onDestroy(() => {
		stopBreathing();
	});

	function startBreathing() {
		if (isBreathing) return;

		isBreathing = true;
		isComplete = false;
		remainingTime = selectedDuration;
		breathingPhase = 'inhale';
		breathingText = getPhaseText('inhale');

		// Start inhale animation
		dotScale.set(1.8);
		dotOpacity.set(1);
		dotRotation.set(180);

		// Play inhale audio
		if (inhaleAudio) {
			inhaleAudio.currentTime = 0;
			inhaleAudio.play().catch((error) => {
				console.error('Error playing inhale audio:', error);
			});
		}

		// Start timer countdown
		startTimer();

		// Start breathing cycle
		runBreathingCycle();
	}

	function getPhaseText(phase: 'inhale' | 'exhale' | 'hold' | 'pause'): string {
		const pattern = currentPattern;
		switch (phase) {
			case 'inhale':
				return `Einatmen`;
			case 'exhale':
				return `Ausatmen`;
			case 'hold':
				return `Halten`;
			case 'pause':
				return 'Pause';
			default:
				return 'Bereit zum Atmen?';
		}
	}

	function stopBreathing() {
		isBreathing = false;
		shouldCompleteAfterExhale = false;
		clearTimeout(phaseTimeout);
		clearInterval(breathingInterval);
		clearInterval(countdownInterval);

		// Reset to initial state
		dotScale.set(1);
		dotOpacity.set(0.8);
		dotRotation.set(0);
		breathingPhase = 'pause';
		breathingText = 'Bereit zum Atmen?';

		// Stop audio
		if (inhaleAudio) {
			inhaleAudio.pause();
		}
		if (exhaleAudio) {
			exhaleAudio.pause();
		}
	}

	function startTimer() {
		countdownInterval = setInterval(() => {
			remainingTime--;
			if (remainingTime <= 0) {
				// Don't complete immediately - wait for current exhale to finish
				shouldCompleteAfterExhale = true;
				clearInterval(countdownInterval);
			}
		}, 1000);
	}

	function runBreathingCycle() {
		if (!isBreathing) return;

		// Inhale phase
		phaseTimeout = setTimeout(() => {
			if (!isBreathing) return;

			// Check if we have a hold phase after inhale (box breathing)
			if (HOLD_TIME > 0) {
				breathingPhase = 'hold';
				breathingText = getPhaseText('hold');

				// Hold at full inhale
				dotScale.set(1.8);
				dotOpacity.set(1);
				dotRotation.set(0);

				phaseTimeout = setTimeout(() => {
					if (!isBreathing) return;
					startExhalePhase();
				}, HOLD_TIME);
			} else {
				startExhalePhase();
			}
		}, INHALE_TIME);
	}

	function startExhalePhase() {
		breathingPhase = 'exhale';
		breathingText = getPhaseText('exhale');

		// Start exhale animation
		dotScale.set(0.8);
		dotOpacity.set(0.6);
		dotRotation.set(180);

		// Play exhale audio
		if (exhaleAudio) {
			exhaleAudio.currentTime = 0;
			exhaleAudio.play().catch((error) => {
				console.error('Error playing exhale audio:', error);
			});
		}

		// Exhale phase
		phaseTimeout = setTimeout(() => {
			if (!isBreathing) return;

			// Check if we should complete after this exhale
			if (shouldCompleteAfterExhale) {
				completeBreathing();
				return;
			}

			// Check if we have a hold phase after exhale (box breathing)
			if (selectedPattern === 'box' && HOLD_TIME > 0) {
				breathingPhase = 'hold';
				breathingText = getPhaseText('hold');

				// Hold at full exhale
				dotScale.set(0.6);
				dotOpacity.set(0.6);
				dotRotation.set(0);

				phaseTimeout = setTimeout(() => {
					if (!isBreathing) return;
					
					// Check again after hold phase
					if (shouldCompleteAfterExhale) {
						completeBreathing();
						return;
					}
					
					startPausePhase();
				}, HOLD_TIME);
			} else {
				startPausePhase();
			}
		}, EXHALE_TIME);
	}

	function startPausePhase() {
		// Short pause between cycles
		breathingPhase = 'pause';
		breathingText = getPhaseText('pause');

		dotScale.set(1);
		dotOpacity.set(0.8);
		dotRotation.set(0);

		phaseTimeout = setTimeout(() => {
			if (!isBreathing) return;

			breathingPhase = 'inhale';
			breathingText = getPhaseText('inhale');

			dotScale.set(1.8);
			dotOpacity.set(1);
			dotRotation.set(0);

			// Play inhale audio
			if (inhaleAudio) {
				inhaleAudio.currentTime = 0;
				inhaleAudio.play().catch((error) => {
					console.error('Error playing inhale audio:', error);
				});
			}

			// Continue cycle
			runBreathingCycle();
		}, PAUSE_TIME);
	}

	function completeBreathing() {
		isBreathing = false;
		isComplete = true;
		breathingPhase = 'pause';
		breathingText = 'Atemübung abgeschlossen!';
		remainingTime = 0;
		shouldCompleteAfterExhale = false;

		// Clear all timers
		clearTimeout(phaseTimeout);
		clearInterval(countdownInterval);

		// Reset animation
		dotScale.set(1);
		dotOpacity.set(0.8);
		dotRotation.set(0);

		// Stop audio
		if (inhaleAudio) {
			inhaleAudio.pause();
		}
		if (exhaleAudio) {
			exhaleAudio.pause();
		}

		// Auto-advance after completion
		setTimeout(() => {
			if (gotoNextStep) {
				gotoNextStep();
			}
		}, 2000);
	}

	function resetBreathing() {
		stopBreathing();
		isComplete = false;
		remainingTime = selectedDuration;
		shouldCompleteAfterExhale = false;
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	const durationOptions = [15, 30, 60, 120];
</script>

<div class="flex h-full flex-col items-center justify-between p-6">
	<!-- Breathing text -->
	<div class="text-center">
		<p class="mb-2 text-xl font-bold text-black">{breathingText}</p>
		{#if isBreathing && !isComplete}
			<p class="text-sm text-black/50">{formatTime(remainingTime)}</p>
		{:else if !isBreathing && !isComplete}
			<p class="text-sm text-black/50">{currentPattern.description}</p>
		{/if}
	</div>

	<!-- Breathing visualization -->

	<div class="relative flex items-center justify-center">
		<div class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-black rounded-full size-16 flex items-center justify-center">
			{#if isBreathing}
				<button
					aria-label="Stop breathing"
					onclick={stopBreathing}
					class="flex size-10 items-center justify-center rounded-full font-medium"
				>
					<div class="size-5 rounded-sm bg-white"></div>
				</button>
			{:else}
				<!-- Control buttons -->
				<div class="flex flex-col items-center space-y-4">
						<button
							type="button"
							onclick={startBreathing}
							class="size-10 rounded-full fill-white font-medium"
						>
							{@html IconPlay}
						</button>
				</div>
			{/if}
		</div>
		<div 
			style="animation: rotate 10s linear infinite"
		>
			<!-- Breathing rings -->
			<div class="bg-gradient-to-br from-white to-transparent relative size-32 rounded-full transition-all duration-1000" style="transform: scale({$dotScale}) rotate({$dotRotation}deg); opacity: {$dotOpacity};"></div>
		</div>
	</div>

	<div class="flex h-24 flex-col justify-end gap-4">
		<!-- Duration selector -->
		{#if !isBreathing && !isComplete}
			<div class="flex items-center gap-2">
				<Popover.Root>
					<Popover.Trigger>
						<button
							class="flex items-end gap-2 rounded-lg border border-white bg-white/80 px-3 py-1.5 text-sm font-medium shadow-sm transition-colors"
						>
							<span class="text-black/50"> Dauer </span>
							{formatTime(selectedDuration)}
						</button>
					</Popover.Trigger>
					<Popover.Content
						side="top"
						class="w-auto rounded-xl border border-white bg-neutral-50 p-1 shadow-lg"
					>
						<div class="flex gap-1">
							{#each durationOptions as duration}
								<button
									type="button"
									onclick={() => (selectedDuration = duration)}
									class="rounded-lg px-3 py-1.5 text-sm {selectedDuration === duration
										? 'bg-black text-white'
										: 'bg-white'}"
								>
									{formatTime(duration)}
								</button>
							{/each}
						</div>
					</Popover.Content>
				</Popover.Root>
				<Popover.Root>
					<Popover.Trigger>
						<button
							class="flex items-end gap-2 rounded-lg border border-white bg-white/80 px-3 py-1.5 text-sm font-medium shadow-sm transition-colors"
						>
							<span class="text-black/50"> Technik </span>
							{breathingPatterns[selectedPattern].name}
						</button>
					</Popover.Trigger>
					<Popover.Content
						side="top"
						class="w-auto max-w-xs rounded-xl border border-white bg-neutral-50 p-1 shadow-lg"
					>
						<div class="flex flex-col gap-1">
							{#each Object.entries(breathingPatterns) as [key, pattern]}
								<button
									type="button"
									onclick={() => (selectedPattern = key as BreathingPattern)}
									class="rounded-lg px-3 py-1.5 text-left text-sm {selectedPattern === key
										? 'bg-black text-white'
										: 'bg-white'}"
								>
									<div class="font-medium">{pattern.name}</div>
									<div class="text-xs opacity-75">{pattern.description}</div>
								</button>
							{/each}
						</div>
					</Popover.Content>
				</Popover.Root>
			</div>
		{/if}
		<div class="flex justify-center">
			<LearnGotoNextButton
				variant="secondary"
				onClick={() => {
					if (gotoNextStep) {
						gotoNextStep();
					}
				}}
			>
				Überspringen
			</LearnGotoNextButton>
		</div>
	</div>
</div>

<style lang="scss">
	@keyframes gentle-pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

</style>
