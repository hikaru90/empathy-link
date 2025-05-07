<script lang="ts">
	import { run } from 'svelte/legacy';

	import ChevronUp from 'lucide-svelte/icons/chevron-up'
	import ChevronDown from 'lucide-svelte/icons/chevron-down'
	import backgroundImage from '$assets/images/holo3.jpg';
	import { t, locale } from '$lib/translations';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		step: number;
		formSuccess: boolean;
		speechBubbleContentArray: object[];
	}

	let { step, formSuccess, speechBubbleContentArray }: Props = $props();
	let speechBubbleIndex = $state(0);
	let thinking = $state(false)

	// $: speechBubbleContent = step === 6 && !formSuccess ? speechBubbleContentArray.find(el => el.step === 6)!.errorContent : speechBubbleContentArray.find(el => el.step === step)!.content

	const getSpeechBubbleContent = (formSuccess:boolean, step:number) => {
		try{	
			return step === 13 && !formSuccess ? speechBubbleContentArray.find(el => el.step === 13)!.errorContent : speechBubbleContentArray.find(el => el.step === step)!.content
		}catch(err){
			console.error('error in getSpeechBubbleContent', err);
			return []
		}
	}

	
	
	let speechBubbleElement: HTMLElement = $state();
	let typingTimeoutId: number;

	const typeText = (element: HTMLElement, text: string, speed: number) => {
		try{
		console.log('typeText');
		let index = 0;
		element.innerHTML = ''; // Clear the element content before starting

		// Pre-set the height to avoid layout shift
		const tempElement = document.createElement('div');

		tempElement.style.visibility = 'hidden';
		tempElement.style.position = 'absolute';
		tempElement.style.width = `${element.clientWidth}px`;
		tempElement.style.color = 'red';
		tempElement.style.whiteSpace = 'pre-wrap'; // Ensure white-space wrapping matches the element
		tempElement.innerText = text;
		element.appendChild(tempElement);
		const targetHeight = tempElement.clientHeight;
		element.style.height = `${targetHeight}px`; // Set the target height

		element.removeChild(tempElement);

		// Clear any existing timeout before starting a new one
		if (typingTimeoutId) {
			clearTimeout(typingTimeoutId);
		}

		function type() {
			if (index < text.length) {
				element.innerHTML += text.charAt(index);
				index++;
				typingTimeoutId = setTimeout(type, speed);
			}
		}
		type();
	}catch(err){
		console.error('error typing text', err);
	}
	};

	const addSpeechBubbleText = (text: string = 'Hi') => {
		speechBubbleContent = [speechBubbleContent[0], text];
		speechBubbleIndex = 1;
	};

	export const checkJudgement = async (judgement:string) => {
		thinking = true
		try {
			const judgementRes = await fetch('/api/ai/checkForJudgement', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: judgement,
					lang: $locale
				})
			});
			const res = await judgementRes.json();
			thinking = false
			const answer = res.result;
			addSpeechBubbleText(answer);
		} catch (err) {
			console.error('error in getting judgement', err);
		}
	};

	const decreaseIndex = () => {
		console.log('decreaseIndex');
		if (speechBubbleIndex > 0) speechBubbleIndex--;
	};
	const increaseIndex = () => {
		console.log('increaseIndex');
		if (speechBubbleContent.length > 1 && speechBubbleIndex === 0) speechBubbleIndex++;
	};

	onDestroy(() => {
		if (typingTimeoutId) {
			clearTimeout(typingTimeoutId);
		}
	});
	let speechBubbleContent;
	run(() => {
		speechBubbleContent = getSpeechBubbleContent(formSuccess, step)
	});
	run(() => {
		step, speechBubbleIndex = 0;
	});
	run(() => {
		if (speechBubbleElement) {
			console.log('inside if speechBubbleElement');
			typeText(speechBubbleElement, speechBubbleContent[speechBubbleIndex], 30); // Adjust speed as needed
		}
	});
</script>

<div class="mt-4 flex items-start gap-2">
	<div class="relative left-0 right-0 flex h-12 flex-shrink-0 justify-center gap-1">
		<div
			style="background-image: url('{backgroundImage}'); background-size: 300% 100%"
			class="animate-bg relative z-10 flex h-full w-[60px] items-center justify-center rounded-b rounded-t-[50px] shadow-lg transition duration-700"
		>
			<div data-name="face" class="lookaround face-3 flex flex-col gap-1">
				<div data-name="eyes" class="eyes flex items-center justify-center gap-2">
					<div class="h-2 w-2 rounded-full border-2 border-white bg-black shadow-md"></div>
					<div class="h-2 w-2 rounded-full border-2 border-white bg-black shadow-md"></div>
				</div>
				<div data-name="mouth" class="mouth flex items-center justify-center">
					<div class="h-1.5 w-2.5 rounded-b-full bg-black"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-grow">
		<div class="triangle size-3 flex-shrink-0 bg-muted"></div>
		<div
			class="rounded-tl-0 relative flex flex-grow rounded-b rounded-tr bg-muted px-2 pb-2 pt-1 text-sm leading-tight gap-2"
		>
		{#if thinking}
		<div id="speechBubble" class="w-full">
			...
		</div>
		{:else}
			<div id="speechBubble" bind:this={speechBubbleElement} class="w-full"></div>
			{/if}
			{#if speechBubbleContent.length > 1}
			<div class="flex justify-end text-2xs">
				<div class="-mr-1 flex flex-col items-center gap-0.5">
					<button onclick={() => decreaseIndex()} class="chevron">
						<ChevronUp class="size-2.5" />
					</button>
					<!-- <div class="flex size-4 flex-shrink-0 items-center justify-center py-1">
						{speechBubbleIndex + 1}/{speechBubbleContent.length}
					</div> -->
					<button onclick={() => increaseIndex()} class="chevron">
						<ChevronDown class="size-2.5" />
					</button>
				</div>
			</div>
			{/if}
		</div>
	</div>
</div>

<!-- <button onclick={() => checkJudgement()}>Check Judgement</button> -->

<!-- <button onclick={() => addSpeechBubbleText()}>Add Text</button> -->

<style lang="scss">
	.triangle {
		clip-path: polygon(0 0, 100% 0, 100% 100%);
	}
	.mouth {
		animation: mouth 10s infinite;
	}
	.lookaround{
		animation: lookaround 10s infinite;
	}
	.chevron{
		@apply size-4 rounded shadow flex items-center justify-center;
	}

	@keyframes mouth {
		0% {
			transform: scaleY(0.4);
		}
		5% {
			transform: scaleY(1);
		}
		25% {
			transform: scaleY(0.4);
		}
		100% {
			transform: scaleY(1);
		}
	}
	@keyframes lookaround {
		0% {
			transform: translate(0, 20%);
		}
		5% {
			transform: translate(-20%, 20%);
		}
		25% {
			transform: translate(40%, 20%);
		}
		30% {
			transform: translate(30%, 52%);
		}
		50% {
			transform: translate(30%, 52%);
		}
		55% {
			transform: translate(-30%, 44%);
		}
		85% {
			transform: translate(-30%, 44%);
		}
		100% {
			transform: translate(0, 20%);
		}
	}
</style>
