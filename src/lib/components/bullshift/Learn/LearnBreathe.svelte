<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import LearnGotoNextButton from './LearnGotoNextButton.svelte';

	interface Props {
		content: any;
		pageIndex: number;
		blockIndex: number;
		isPreview?: boolean;
		gotoNextStep?: () => void;
		learningContext?: any;
	}

	let { content, pageIndex, blockIndex, isPreview = false, gotoNextStep, learningContext }: Props = $props();

	// Animation state
	let isBreathing = $state(false);
	let breathingPhase = $state<'inhale' | 'exhale' | 'pause'>('pause');
	let breathingText = $state('Bereit zum Atmen?');
	let isComplete = $state(false);
	let remainingTime = $state(0);
	let totalDuration = $state(content.duration || 60); // Default 1 minute
	let selectedDuration = $state(content.duration || 60);

	// Audio elements
	let inhaleAudio: HTMLAudioElement;
	let exhaleAudio: HTMLAudioElement;

	// Animation tweens
	const dotScale = tweened(1, { duration: 1000, easing: cubicInOut });
	const dotOpacity = tweened(0.8, { duration: 1000, easing: cubicInOut });

	// 5-7 breathing pattern (in milliseconds)
	const INHALE_TIME = 5000;  // 5 seconds
	const EXHALE_TIME = 7000;  // 7 seconds
	const PAUSE_TIME = 1000;   // 1 second between cycles
	const CYCLE_TIME = INHALE_TIME + EXHALE_TIME + PAUSE_TIME; // 13 seconds per cycle

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
		breathingText = 'Einatmen... (5s)';
		
		// Start inhale animation
		dotScale.set(1.8);
		dotOpacity.set(1);
		
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

	function stopBreathing() {
		isBreathing = false;
		clearTimeout(phaseTimeout);
		clearInterval(breathingInterval);
		clearInterval(countdownInterval);
		
		// Reset to initial state
		dotScale.set(1);
		dotOpacity.set(0.8);
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
				completeBreathing();
			}
		}, 1000);
	}

	function runBreathingCycle() {
		if (!isBreathing) return;

		// Inhale phase
		phaseTimeout = setTimeout(() => {
			if (!isBreathing) return;
			
			breathingPhase = 'exhale';
			breathingText = 'Ausatmen... (7s)';
			
			// Start exhale animation
			dotScale.set(0.6);
			dotOpacity.set(0.6);
			
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
				
				// Short pause between cycles
				breathingPhase = 'pause';
				breathingText = `Pause...`;
				
				dotScale.set(1);
				dotOpacity.set(0.8);
				
				phaseTimeout = setTimeout(() => {
					if (!isBreathing) return;
					
					breathingPhase = 'inhale';
					breathingText = 'Einatmen... (5s)';
					
					dotScale.set(1.8);
					dotOpacity.set(1);
					
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
			}, EXHALE_TIME);
		}, INHALE_TIME);
	}

	function completeBreathing() {
		isBreathing = false;
		isComplete = true;
		breathingPhase = 'pause';
		breathingText = 'Atemübung abgeschlossen!';
		remainingTime = 0;
		
		// Clear all timers
		clearTimeout(phaseTimeout);
		clearInterval(countdownInterval);
		
		// Reset animation
		dotScale.set(1);
		dotOpacity.set(0.8);
		
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
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<div class="flex h-full flex-col items-center justify-center space-y-8 p-8">
	<!-- Breathing visualization -->
	<div class="relative flex items-center justify-center">
		<div 
			class="relative size-32 rounded-full border-4 border-primary/20 bg-primary/10 transition-all duration-1000"
			style="transform: scale({$dotScale}); opacity: {$dotOpacity};"
		>
			<!-- Breathing rings -->
			<div class="absolute inset-0 rounded-full bg-primary/20 opacity-75"></div>
		</div>
	</div>

	<!-- Breathing text -->
	<div class="text-center">
		<p class="text-2xl font-medium text-gray-700 mb-2">{breathingText}</p>
		{#if isBreathing && !isComplete}
			<p class="text-lg font-mono text-primary">{formatTime(remainingTime)}</p>
		{:else if !isBreathing && !isComplete}
			<p class="text-sm text-gray-500">5-7 Atemtechnik: 5 Sekunden einatmen, 7 Sekunden ausatmen</p>
		{/if}
	</div>

	<!-- Duration selector -->
	{#if !isBreathing && !isComplete}
		<div class="flex flex-col items-center space-y-4">
			<div class="text-center">
				<label class="block text-sm font-medium text-gray-700 mb-3">Dauer wählen:</label>
				<div class="flex gap-2 flex-wrap justify-center">
					<button
						type="button"
						onclick={() => selectedDuration = 15}
						class="px-4 py-2 rounded-lg border font-medium transition-colors {selectedDuration === 15 ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}"
					>
						15s
					</button>
					<button
						type="button"
						onclick={() => selectedDuration = 30}
						class="px-4 py-2 rounded-lg border font-medium transition-colors {selectedDuration === 30 ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}"
					>
						30s
					</button>
					<button
						type="button"
						onclick={() => selectedDuration = 60}
						class="px-4 py-2 rounded-lg border font-medium transition-colors {selectedDuration === 60 ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}"
					>
						1 Min
					</button>
					<button
						type="button"
						onclick={() => selectedDuration = 120}
						class="px-4 py-2 rounded-lg border font-medium transition-colors {selectedDuration === 120 ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'}"
					>
						2 Min
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Control buttons -->
	<div class="flex flex-col items-center space-y-4">
		{#if !isBreathing && !isComplete}
			<button
				type="button"
				onclick={startBreathing}
				class="rounded-full bg-primary px-8 py-3 text-white font-medium hover:bg-primary/90 transition-colors shadow-lg"
			>
				Atemübung starten ({formatTime(selectedDuration)})
			</button>
		{:else if isBreathing}
			<button
				type="button"
				onclick={stopBreathing}
				class="rounded-full bg-red-500 px-8 py-3 text-white font-medium hover:bg-red-600 transition-colors shadow-lg"
			>
				Stoppen
			</button>
		{:else if isComplete}
			<div class="flex space-x-4">
				<button
					type="button"
					onclick={resetBreathing}
					class="rounded-full bg-gray-500 px-6 py-2 text-white font-medium hover:bg-gray-600 transition-colors"
				>
					Wiederholen
				</button>
				<LearnGotoNextButton
					onClick={() => {
						if (gotoNextStep) {
							gotoNextStep();
						}
					}}
				>
					Weiter
				</LearnGotoNextButton>
			</div>
		{/if}
	</div>

	<!-- Instructions -->
	{#if !isBreathing && !isComplete}
		<div class="text-center text-sm text-gray-500 max-w-md">
			<p>Diese Atemübung hilft dir dabei, dich zu entspannen und zu zentrieren.</p>
			<p class="mt-2">Folge dem pulsierenden Punkt: 5 Sekunden einatmen, 7 Sekunden ausatmen.</p>
			<p class="mt-1">Wähle deine bevorzugte Dauer und folge den beruhigenden Tönen.</p>
		</div>
	{/if}
</div>

<style>
	@keyframes gentle-pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	.animate-gentle-pulse {
		animation: gentle-pulse 2s ease-in-out infinite;
	}
</style>