<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';
	import LearnSplashScreen from '$lib/components/bullshift/Learn/LearnSplashScreen.svelte';

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
		session?: any;
		onResponse?: (response: any) => void;
		gotoNextStep?: () => void;
		gotoPrevStep?: () => void;
	}

	let { content, color, session, onResponse, gotoNextStep, gotoPrevStep }: Props = $props();

	// Audio player state
	let audioElement: HTMLAudioElement;
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let isLoading = $state(true);
	let hasError = $state(false);
	let volume = $state(1);
	let isCompleted = $state(false);
	let splashDone = $state(false);

	let splashContentClass = $derived(() => {
		if (splashDone) {
			return 'opacity-100 scale-100';
		}
		return 'opacity-0 scale-0';
	});
 

	$effect(() => {
		if (session && session.responses) {
			const existingResponse = session.responses.find(
				(r: any) =>
					r.blockType === 'audio' && JSON.stringify(r.blockContent) === JSON.stringify(content)
			);
			if (existingResponse) {
				isCompleted = existingResponse.response.completed || false;
			}
		}
	});
	const formatTime = (time: number): string => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};
	const markCompleted = (method: 'played' | 'skipped') => {
		if (isCompleted) return;

		isCompleted = true;

		if (onResponse) {
			onResponse({
				completed: true,
				method: method,
				timeListened: currentTime,
				totalDuration: duration,
				timestamp: new Date().toISOString()
			});
		}
	};
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
	const seek = (event: MouseEvent) => {
		if (!audioElement) return;

		const progressBar = event.currentTarget as HTMLElement;
		const rect = progressBar.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const percentage = clickX / rect.width;

		audioElement.currentTime = percentage * duration;
	};
	const restart = () => {
		if (!audioElement) return;
		audioElement.currentTime = 0;
	};
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
		} else {
			// Mark as completed when audio finishes naturally
			markCompleted('played');
			// Delay gotoNextStep by 1 second to prevent request conflicts
			setTimeout(() => {
				gotoNextStep?.();
			}, 1000);
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
	const progressPercentage = $derived(() => {
		return duration > 0 ? (currentTime / duration) * 100 : 0;
	});
</script>

	<LearnSplashScreen 
		color={color} 
		text="Zeit zu Meditieren"
		on:splashDone={() => {
			splashDone = true;
		}}
	/>



	<div class="relative flex h-full animate-splashContent flex-col justify-between rounded-lg transition-all transform duration-1000 {splashContentClass()}">
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

		<div></div>
		<!-- {#if content.title}
		<div class="relative z-10 mb-8 text-center text-xl font-bold leading-snug">
			{@html marked(content.title)}
		</div>
	{/if} -->

		<!-- Custom Audio Player -->
		{#if content.controls !== false}
			<div class="flex flex-col items-center justify-between gap-4">
				<!-- Play/Pause Button -->
				<div class="relative">
					{#if isPlaying && !hasError && !isLoading}
						<button
							onclick={restart}
							class="absolute -top-16 left-1/2 z-10 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-black"
							aria-label="Restart"
						>
							<svg class="size-3 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
								/>
							</svg>
						</button>
					{/if}
					<div class="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
						<div class="size-40 animate-expand rounded-full bg-white/30"></div>
					</div>
					<div class="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
						<div class="size-28 animate-expand rounded-full bg-white/40 delay-100"></div>
					</div>

					<button
						onclick={togglePlay}
						disabled={isLoading || hasError}
						class="relative flex size-16 items-center justify-center rounded-full bg-black shadow-lg transition-colors disabled:opacity-50"
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
							<svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
							</svg>
						{:else}
							<!-- Play Icon -->
							<svg class="ml-0.5 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
						{/if}
					</button>
				</div>
				<div class="relative z-10 m-4 rounded-full bg-white/90 px-3 py-1 text-sm">
					{formatTime(duration - currentTime)}
				</div>
			</div>
		{/if}
		<div class="flex flex-col">
			<div class="pb-4 text-center text-sm text-black/40">
				{#if content.content}
					{@html marked(content.content)}
				{/if}
			</div>

			<div class="flex justify-center">
				<LearnGotoNextButton
					onClick={() => {
						markCompleted('skipped');
						audioElement.pause();
						gotoNextStep?.();
					}}
					onPrev={() => {
						gotoPrevStep?.();
					}}
					displayBackButton={true}
				>
					{isCompleted ? 'Weiter' : 'Überspringen'}
				</LearnGotoNextButton>
			</div>
		</div>
	</div>
