<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import StoryNavigation from './StoryNavigation.svelte';

	interface Props {
		content: {
			src: string;
			content?: string;
			title?: string;
			transcript?: string;
			autoplay?: boolean;
			loop?: boolean;
			controls?: boolean;
		};
		color?: string;
	}

	let { content, color }: Props = $props();

	// Audio player state
	let audioElement: HTMLAudioElement;
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let isLoading = $state(true);
	let hasError = $state(false);
	let volume = $state(1);

	// Format time helper
	const formatTime = (time: number): string => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	// Play/pause toggle
	const togglePlay = async () => {
		if (!audioElement || isLoading) return;

		try {
			if (isPlaying) {
				audioElement.pause();
			} else {
				isLoading = true;
				await audioElement.play();
			}
		} catch (error) {
			console.error('Audio play error:', error);
			isLoading = false;
		}
	};

	// Seek to position
	const seek = (event: MouseEvent) => {
		if (!audioElement) return;

		const progressBar = event.currentTarget as HTMLElement;
		const rect = progressBar.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const percentage = clickX / rect.width;

		audioElement.currentTime = percentage * duration;
	};

	// Restart track
	const restart = () => {
		if (!audioElement) return;
		audioElement.currentTime = 0;
	};

	// Audio event handlers
	const handleLoadedMetadata = () => {
		duration = audioElement.duration || 0;
		isLoading = false;
	};

	const handleCanPlay = () => {
		isLoading = false;
	};

	const handleLoadStart = () => {
		isLoading = true;
	};

	const handleTimeUpdate = () => {
		currentTime = audioElement.currentTime || 0;
	};

	const handlePlay = () => {
		isPlaying = true;
		isLoading = false;
	};

	const handlePause = () => {
		isPlaying = false;
	};

	const handleEnded = () => {
		isPlaying = false;
		if (content.loop) {
			audioElement.currentTime = 0;
			audioElement.play();
		}
	};

	const handleError = (event: Event) => {
		console.error('Audio loading error:', event);
		isLoading = false;
		isPlaying = false;
		hasError = true;
	};

	onMount(() => {
		// Check if audio source is valid
		if (!content.src || content.src.trim() === '') {
			isLoading = false;
			hasError = true;
			return;
		}

		// Reset loading state if audio is already ready
		if (audioElement && audioElement.readyState >= 3) {
			isLoading = false;
		}

		// Set a timeout to prevent infinite loading state
		const loadingTimeout = setTimeout(() => {
			if (isLoading) {
				console.warn('Audio loading timeout - setting loading to false');
				isLoading = false;
			}
		}, 10000); // 10 second timeout

		// Clear timeout when audio loads
		const clearTimeoutOnLoad = () => clearTimeout(loadingTimeout);
		audioElement?.addEventListener('loadeddata', clearTimeoutOnLoad);
		audioElement?.addEventListener('canplay', clearTimeoutOnLoad);
		audioElement?.addEventListener('error', clearTimeoutOnLoad);

		if (content.autoplay && audioElement) {
			audioElement.play();
		}

		// Cleanup timeout on component destroy
		return () => {
			clearTimeout(loadingTimeout);
			audioElement?.removeEventListener('loadeddata', clearTimeoutOnLoad);
			audioElement?.removeEventListener('canplay', clearTimeoutOnLoad);
			audioElement?.removeEventListener('error', clearTimeoutOnLoad);
		};
	});

	// Progress percentage
	const progressPercentage = $derived(() => {
		return duration > 0 ? (currentTime / duration) * 100 : 0;
	});
</script>

<div class="via-forest to-lilac relative mb-4 rounded-lg bg-gradient-to-br from-black px-4 py-4">
	{#if content.title}
		<div class="mb-8 text-xl font-bold leading-snug text-white/90">
			{@html marked(content.title)}
		</div>
	{/if}

	<div class="absolute right-0 top-0 m-4 rounded-full bg-white/90 px-3 py-1 text-sm shadow-lg">
		{formatTime(duration)}
	</div>

	<!-- Hidden audio element -->
	<audio
		bind:this={audioElement}
		src={content.src}
		preload="metadata"
		onloadstart={handleLoadStart}
		onloadedmetadata={handleLoadedMetadata}
		oncanplay={handleCanPlay}
		ontimeupdate={handleTimeUpdate}
		onplay={handlePlay}
		onpause={handlePause}
		onended={handleEnded}
		onerror={handleError}
	>
		Your browser does not support the audio element.
	</audio>

	<!-- Custom Audio Player -->
	{#if content.controls !== false}
		<div class="flex items-end justify-between gap-4">
			<div
				class="prose prose-sm prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-white prose-a:text-white/80 prose-a:underline max-w-[16em] text-white/70"
			>
				{#if content.content}
					{@html marked(content.content)}
				{/if}
			</div>
			<!-- Restart Button (only show when playing) -->
			{#if isPlaying && !hasError && !isLoading}
				<button
					onclick={restart}
					class="flex size-12 items-center justify-center rounded-full bg-white/70 transition-colors hover:bg-white/90"
					aria-label="Restart"
				>
					<svg class="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
						/>
					</svg>
				</button>
			{/if}

			<!-- Play/Pause Button -->
			<button
				onclick={togglePlay}
				disabled={isLoading || hasError}
				class="flex size-16 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-white disabled:opacity-50"
				aria-label={hasError ? 'Audio error' : isPlaying ? 'Pause' : 'Play'}
			>
				{#if hasError}
					<!-- Error Icon -->
					<svg class="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
						/>
					</svg>
				{:else if isLoading}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
					></div>
				{:else if isPlaying}
					<!-- Pause Icon -->
					<svg class="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 24 24">
						<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
					</svg>
				{:else}
					<!-- Play Icon -->
					<svg class="ml-0.5 h-6 w-6 text-black" fill="currentColor" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z" />
					</svg>
				{/if}
			</button>

			<!-- Time Display 
				<div class="flex-1 space-y-2">
					{#if hasError}
						<div class="text-sm text-red-300">Audio file could not be loaded</div>
					{:else}
						<div class="flex justify-between text-sm text-white/80">
							<span>{formatTime(currentTime)}</span>
							<span>{formatTime(duration)}</span>
						</div>
					{/if}

					
					{#if !hasError}
						<div class="h-2 w-full cursor-pointer rounded-full bg-white/20" onclick={seek}>
							<div
								class="h-full rounded-full bg-white/80 transition-all duration-100"
								style="width: {progressPercentage}%"
							></div>
						</div>
					{/if}
				</div> 
				-->
		</div>
	{/if}

	{#if content.transcript}
		<details class="mt-3 text-sm">
			<summary class="cursor-pointer font-medium text-white/80 hover:text-white">
				📝 Show transcript
			</summary>
			<div
				class="mt-2 whitespace-pre-wrap rounded bg-white/10 p-3 text-sm leading-relaxed text-white/90"
			>
				{content.transcript}
			</div>
		</details>
	{/if}
	
	<div class="mt-4">
		<StoryNavigation 
			variant="default"
			nextText="Continue"
			prevText="Back"
			nextDisabled={isPlaying && !hasError}
		/>
	</div>
</div>
