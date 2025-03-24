<script lang="ts">
	import { onMount } from 'svelte';
	import P5 from 'p5';

	let canvasParent;
	const noiseStrength = 100;

	onMount(async () => {
		new P5((p) => {
			let gfx; // Main graphics buffer
			let noiseLayer; // Buffer for noise
			let gradientLayer; // Buffer for gradient
			let mask; // Buffer for mask
			const w = canvasParent.offsetWidth; // Match div width (w-20 = 5rem = 80px)
			const h = canvasParent.offsetHeight; // Match div height

			p.setup = () => {
				// Create canvas with div dimensions instead of window dimensions
				p.createCanvas(w, h).parent(canvasParent);

				// Create all graphics buffers once
				gfx = p.createGraphics(w, h);
				noiseLayer = p.createGraphics(w, h);
				gradientLayer = p.createGraphics(w, h);
				mask = p.createGraphics(w, h);

				// Initial draw
				createNoiseLayer();
				createGradientLayer();
				drawGradient();
			};

			function createNoiseLayer() {
				noiseLayer.loadPixels();
				// Calculate total number of pixels in noiseLayer
				const totalPixels = noiseLayer.width * noiseLayer.height;
				console.log('Total pixels in noiseLayer:', totalPixels);
        
				const scale = 2; // Increase this number for finer grain
				for (let i = 0; i < noiseLayer.width * noiseLayer.height * 4 * scale; i += 4) {
					const v = Math.random() > 0.5 ? noiseStrength : 0;
					noiseLayer.pixels[i] = 0;     // r
					noiseLayer.pixels[i + 1] = 0; // g
					noiseLayer.pixels[i + 2] = 0; // b
					noiseLayer.pixels[i + 3] = v; // a
				}
				noiseLayer.updatePixels();
			}

			function createGradientLayer() {
				gradientLayer.noStroke();
				for (let y = 0; y < h; y++) {
					let alpha = p.map(y, 0, h, 25, 255);
					gradientLayer.fill(0, 0, 0, alpha);
					gradientLayer.rect(0, y, w, 1);
				}
			}

			function drawGradient() {
				// Clear main buffer
				gfx.clear();
				// Draw noise (no need to center since we're using full size)
				gfx.image(noiseLayer, 0, 0, w, h);
				gfx.blendMode(p.OVERLAY);
				gfx.image(gradientLayer, 0, 0);

				// Reset blend mode
				gfx.blendMode(p.BLEND);
			}

			p.draw = () => {
				p.clear();

				// Update mask
				mask.clear();
				mask.fill(255);
				mask.noStroke();
				mask.ellipse(w / 2, h / 2, w, h); // Draw ellipse to fill the space

				// Apply the mask
				let maskedGfx = gfx.get();
				maskedGfx.mask(mask);

				// Draw the masked result
				p.image(maskedGfx, 0, 0);
			};

			p.windowResized = () => {
				// No need to handle window resize since we're using fixed div size
			};
		});
	});
</script>

<div class="flex h-[800px] w-full items-center justify-center">
	<div class="bg-blue-500 p-2">
		<div class="h-[500px] w-[500px]" bind:this={canvasParent}></div>
	</div>
</div>
