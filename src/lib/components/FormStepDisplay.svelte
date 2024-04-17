<script lang="ts">
	export let step: number;
	export let steps: object[];
	export let stepBackground: string;
</script>

<div class="-mx-6 md:flex md:justify-center">
	<div class="my-2 md:rounded-full">
		<div
			class="lcd-screen {stepBackground} relative flex items-center justify-between gap-2 border border-white/20 px-5 py-2 md:rounded-full md:px-3"
		>
			<!-- <div class="absolute top-1 left-1 bottom-1 right-1 bg-gradient-to-br from-white to-transparent -m-[3px] md:rounded-full opacity-60"></div> -->
			{#each steps as entry, index}
				<div
					class="{`bg-${entry.slug}-background text-${entry.slug}-foreground`} {step === index + 1
						? 'p-1'
						: 'h-6 w-6'} flex items-center justify-center rounded-full border border-black/5 shadow"
				>
					<div
						class="relative flex h-4 w-4 scale-110 items-center justify-center rounded-full {`fill-${entry.slug}-foreground`} {step ===
						index + 1
							? 'mx-1'
							: ''}"
					>
						{@html entry.icon}
					</div>
					<div
						class="max-w-0 scale-0 transform text-sm {step === index + 1
							? 'opacity-1 mr-2 max-w-[300px] scale-100 transition-all delay-200'
							: 'max-w-0 scale-0 opacity-0'}"
					>
						{entry.name}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.lcd-screen {
		box-shadow: inset 0 0 20px rgba(#000, 0.1);
	}
</style>
