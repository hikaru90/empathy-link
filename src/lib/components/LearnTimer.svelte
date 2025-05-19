<script lang="ts">
  import Play from 'lucide-svelte/icons/play';
  import Pause from 'lucide-svelte/icons/pause';

  interface Props {
    duration: number;
    color?: string;
  }

	let { duration, color }: Props = $props();

	let time = $state(duration);
	let isRunning = $state(false);
	let isPaused = $state(false);
	let interval: ReturnType<typeof setInterval> | null = null;
	let audio: HTMLAudioElement;

	$effect(() => {
		audio = new Audio('/sounds/ping-82822.mp3');
	});

	const startTimer = () => {
		if (isPaused) {
			isPaused = false;
		}
		isRunning = true;
		interval = setInterval(() => {
			time--;
			if (time <= 0) {
				isRunning = false;
				isPaused = false;
				time = duration;
				clearInterval(interval);
				audio.play().catch(e => console.log('Audio play failed:', e));
			}
		}, 1000);
	};

	const pauseTimer = () => {
		isRunning = false;
		isPaused = true;
		clearInterval(interval);
	};

	const clickTimer = () => {
		if (isRunning) {
			pauseTimer();
		} else {
			startTimer();
		}
	};

</script>

<div style="background-color: {color}" class="inline-flex items-center justify-between gap-2 rounded-full p-2">
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
</div>
