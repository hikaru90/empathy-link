<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Props {
		step: number;
		steps: object[];
		stepBackground: string;
	}

	let { step, steps, stepBackground }: Props = $props();

	const dispatch = createEventDispatcher();
</script>

<div class="sticky top-0 z-10 -mx-5 md:flex md:justify-center {`bg-${stepBackground}-background`} dark:bg-background transition duration-500">
	<div class="md:my-4">
		<div
			class="lcd-screen relative flex items-center gap-[4px] border border-black/10 bg-black/5 p-[2px] dark:bg-black/20 md:rounded"
		>
			<!-- <div class="absolute top-1 left-1 bottom-1 right-1 bg-gradient-to-br from-white to-transparent -m-[3px] md:rounded-full opacity-60"></div> -->
			{#each steps as entry, index}
			{#if !entry.hidden}
				<button
					onclick={() => dispatch('changeStep', { step: index + 1 })}
					type="button"
					class="group {`bg-${stepBackground}-background`} dark:bg-background flex-grow rounded-[2px] shadow transition duration-500"
				>
					<div
						class="flex items-center justify-center overflow-hidden rounded-[2px] p-2 shadow-inner shadow-white/20 dark:shadow-white/10"
					>
						<div
							class="skeumorphic-button {`bg-${entry.slug}-background text-${entry.slug}-foreground`} dark:bg-muted/40 rounded-full border-2 {`border-${stepBackground}-background`} dark:border-muted transition duration-500"
						>
							<div
								class="flex items-center rounded-full border border-black/5 p-1 {step === index + 1
									? 'px-2'
									: ''} group-hover:bg-white/40 dark:group-hover:bg-white/10 transition duration-200"
							>
								<div
									class="flex h-4 w-4 scale-110 items-center justify-center {`fill-${entry.slug}-foreground`}"
								>
									{@html entry.icon}
								</div>
								<div
									class="max-h-0 max-w-0 scale-0 transform text-sm {step === index + 1
										? 'opacity-1 ml-1 mr-1 max-h-4 max-w-[300px] scale-100 transition-all delay-200'
										: 'max-w-0 scale-0 opacity-0'}"
								>
									<span class="-mt-[2px] block">
										{entry.name}
									</span>
								</div>
							</div>
						</div>
					</div>
				</button>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.lcd-screen {
		// box-shadow: inset 0 0 20px rgba(#000, 0.1);
	}
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow);
	}
</style>
