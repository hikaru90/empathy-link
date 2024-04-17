<script lang="ts">
	export let step: number;
	export let steps: object[];
	export let stepBackground: string;
</script>

<div class="relative -mx-5 md:flex md:justify-center">
	<div class="my-2">
		<div
			class="lcd-screen relative flex items-center gap-[4px] border border-black/10 bg-black/5 p-[2px] md:rounded"
		>
			<!-- <div class="absolute top-1 left-1 bottom-1 right-1 bg-gradient-to-br from-white to-transparent -m-[3px] md:rounded-full opacity-60"></div> -->
			{#each steps as entry, index}
				<div
					class="{`bg-${stepBackground}-background`} flex-grow rounded-[2px] shadow transition duration-700"
				>
					<div
						class="flex items-center justify-center overflow-hidden rounded-[2px] p-2 shadow-inner shadow-white/40"
					>
						<div
							class="skeumorphic-button {`bg-${entry.slug}-background text-${entry.slug}-foreground`} rounded-full border-2 {`border-${stepBackground}-background`} transition duration-700"
						>
							<div
								class="flex items-center rounded-full p-1 border border-black/5 {step === index + 1
									? 'px-2'
									: ''}"
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
				</div>
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
		box-shadow:
			-5px -5px 5px rgba(255, 255, 255, 0.4),
			5px 5px 10px rgba(0, 0, 0, 0.3);
	}
	.manual-transition{
		transition: --tw-gradient-from 700ms ease, --tw-gradient-to 700ms ease;
	}
</style>
