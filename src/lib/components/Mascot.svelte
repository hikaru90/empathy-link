<script lang="ts">
	import backgroundImage from '$assets/images/holo3.jpg';
	import { t, locale } from '$lib/translations';
  import { onMount, onDestroy } from 'svelte';

	export let step: number;
	export let stepName: string;

  $: speechBubbleContent = $t(`default.page.fight.create.${stepName}`);
  let speechBubbleElement: HTMLElement;
  let typingTimeoutId: number;
  $: {
    if (speechBubbleElement) {
      typeText(speechBubbleElement, speechBubbleContent, 30); // Adjust speed as needed
    }
  }

  const typeText = (element: HTMLElement, text: string, speed: number) => {
    let index = 0;
    element.innerHTML = ''; // Clear the element content before starting

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
  };

  onDestroy(() => {
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
    }
  });
</script>

<div class="flex items-start gap-2 mt-4">
	<div class="relative left-0 right-0 flex h-12 flex-shrink-0 justify-center gap-1">
		<div
			style="background-image: url('{backgroundImage}'); background-size: 300% 100%"
			class="animate-bg relative z-10 flex h-full w-[60px] items-center justify-center rounded-b rounded-t-[50px] shadow-lg transition duration-700"
		>
			<div data-name="face" class="face-3 flex flex-col gap-1">
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
    <div class="triangle size-3 bg-white flex-shrink-0"></div>
    <div bind:this={speechBubbleElement} class="flex-grow bg-white text-sm leading-tight px-2 pt-1 pb-2 rounded-tl-0 rounded-b rounded-tr">
    </div>
  </div>
</div>

<style lang="scss">
  .triangle{
    clip-path: polygon(0 0,100% 0,100% 100%);
  }
	.mouth {
		animation: mouth 10s infinite;
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
