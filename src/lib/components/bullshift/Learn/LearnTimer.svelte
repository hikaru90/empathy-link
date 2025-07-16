<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, X, Play, Pause } from 'lucide-svelte';
	import { learningSession } from '$lib/stores/learningSession';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';

	interface Props {
		duration: number;
		color: string;
		session: LearningSession | null;
		onResponse: (response: any) => void;
		onComplete?: () => void;
	}

	let { duration, color, session, onResponse, onComplete }: Props = $props();

	let time = $state(duration);
	let isRunning = $state(false);
	let isPaused = $state(false);
	let isCompleted = $state(false);
	let interval: ReturnType<typeof setInterval> | null = null;
	let audio: HTMLAudioElement;
	let startTime: number | null = null;

	$effect(() => {
		audio = new Audio('/sounds/ping-82822.mp3');
	});

	// Load existing response if available
	onMount(() => {
		if (!session) return;
		// Find timer response in session
		const existingResponse = session.responses.find(r => r.blockType === 'timer');
		if (existingResponse) {
			isCompleted = existingResponse.response.completed || false;
		}
	});

	const startTimer = () => {
		if (isPaused) {
			isPaused = false;
		} else {
			startTime = Date.now();
		}
		isRunning = true;
		interval = setInterval(() => {
			time--;
			if (time <= 0) {
				isRunning = false;
				isPaused = false;
				isCompleted = true;
				const actualDuration = startTime ? Math.floor((Date.now() - startTime) / 1000) : duration;
				time = duration;
				if (interval) clearInterval(interval);
				audio.play().catch(e => console.log('Audio play failed:', e));
				
				// Save response
				onResponse({
					completed: true,
					actualDuration
				});

			}
		}, 1000);
	};

	const pauseTimer = () => {
		isRunning = false;
		isPaused = true;
		if (interval) clearInterval(interval);
	};

	const clickTimer = () => {
		if (isRunning) {
			pauseTimer();
		} else {
			startTimer();
		}
	};

</script>

<div style="background-color: {color}" class="inline-flex items-center justify-between gap-2 rounded-full p-2 mb-6">
  <button onclick={() => clickTimer()} style="border: 2px solid {color}; box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.3), -4px -4px 8px 0 rgba(255, 255, 255, 0.3);" class="size-8 rounded-full flex items-center justify-center">
    {#if isRunning}
      <Pause class="size-3" />
    {:else}
      <Play class="size-3" />
    {/if}
  </button>
  <div class="{isRunning ? 'text-white animate-pulse' : ''} min-w-20 text-center bg-white/10 rounded-full p-2">
    {time}
  </div>
  {#if isCompleted}
    <div class="flex items-center gap-1 text-white text-xs">
      <svg class="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
      <span>Abgeschlossen</span>
    </div>
  {/if}
</div>
