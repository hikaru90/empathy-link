<script lang="ts">
	interface Props {
		text: string;
		speed?: number; // milliseconds per character
		delay?: number; // delay before starting
		repeat?: boolean; // whether to repeat the animation
		repeatDelay?: number; // delay before repeating
		class?: string;
		onComplete?: () => void;
	}

	let { 
		text,
		speed = 30, 
		delay = 0, 
		repeat = false, 
		repeatDelay = 2000,
		class: className = '',
		onComplete
	}: Props = $props();

	let displayedText = $state('');
	let isTyping = $state(false);
	let currentIndex = $state(0);
	let lastText = $state('');

	const typeText = async () => {
		if (isTyping) return;
		
		isTyping = true;
		displayedText = '';
		currentIndex = 0;

		// Initial delay
		if (delay > 0) {
			await new Promise(resolve => setTimeout(resolve, delay));
		}

		// Type each character
		while (currentIndex < text.length) {
			displayedText += text[currentIndex];
			currentIndex++;
			await new Promise(resolve => setTimeout(resolve, speed));
		}

		isTyping = false;

		// Call onComplete callback
		if (onComplete) {
			onComplete();
		}

		// Repeat if enabled
		if (repeat) {
			await new Promise(resolve => setTimeout(resolve, repeatDelay));
			typeText();
		}
	};

	// Only start typing when text actually changes
	$effect(() => {
		if (text && text !== lastText) {
			lastText = text;
			typeText();
		}
	});
</script>

<span class={className}>
	{displayedText}
	{#if isTyping}
		<span class="animate-pulse">|</span>
	{/if}
</span> 