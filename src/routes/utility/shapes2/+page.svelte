<script lang="ts">
	import { onMount } from 'svelte';
	import P5 from 'p5';
	import { Width } from 'radix-icons-svelte';
	import { draw } from 'svelte/transition';

	let p: P5 | undefined;
	let canvasParent: HTMLDivElement | undefined;
	let canvas: Element | undefined;
	let w: number | undefined;
	let h: number | undefined;
	const noiseStrength = 100;
	const blurNoise = false;
	const drawColorGradient = true;

	$: if (w !== undefined) {
		console.log('Width changed:', w);
	}

	const colors = [
		'#F0BADA', // Red
		'#FF9C34', // Green
		'#080638', // Blue
		'#17545A', // Yellow
		'#D8BEFF' // Magenta
	];

	const drawCanvas = () => {
		p.draw = () => {
			p.noStroke();
			let gradient = p.drawingContext.createLinearGradient(0, 0, w, h);
			gradient.addColorStop(0, colors[0]);
			gradient.addColorStop(1, colors[3]);
			p.drawingContext.fillStyle = gradient;
			p.rect(0, 0, w, h);
		};
	};

	onMount(() => {
		p = new P5((p5Instance) => {
			p5Instance.setup = () => {
				canvas = p5Instance.createCanvas(w, h).parent(canvasParent);
			};

			
			w = canvasParent!.offsetWidth;
			h = canvasParent!.offsetHeight;
			
			return p5Instance
		});
		drawCanvas();
	});

	// onMount(async () => {
	// 	p =new P5((p) => {
	// 		let gfx; // Main graphics buffer
	// 		let noiseLayer; // Buffer for noise
	// 		let gradientLayer; // Buffer for gradient
	// 		let mask; // Buffer for mask
	// 		const w = canvasParent.offsetWidth; // Match div width (w-20 = 5rem = 80px)
	// 		const h = canvasParent.offsetHeight; // Match div height

	// 		p.setup = () => {
	// 			p.createCanvas(w, h).parent(canvasParent);
	// 		};

	// 		p.draw = () => {
	// 			p.background(255);
	// 		};

	// 		return;

	// 		p.setup = () => {
	// 			// Create canvas with div dimensions instead of window dimensions
	// 			const canvas = p.createCanvas(w, h).parent(canvasParent);

	// 			// Create all graphics buffers once
	// 			gfx = p.createGraphics(w, h);
	// 			noiseLayer = p.createGraphics(w, h);
	// 			gradientLayer = p.createGraphics(w, h);
	// 			mask = p.createGraphics(w, h);

	// 			const startColor = colors[Math.floor(Math.random() * colors.length)];
	// 			const endColor = colors[Math.floor(Math.random() * colors.length)];

	// 			// Initial draw
	// 			createNoiseLayer(endColor);
	// 			if (drawColorGradient) {
	// 				createGradientLayer(canvas, startColor, endColor);
	// 				drawGradient();
	// 			}
	// 		};

	// 		function createNoiseLayer(endColor) {
	// 			noiseLayer.loadPixels();

	// 			// Random gradient settings
	// 			const isCircular = Math.random() > 0.5;
	// 			const startValue = 100; // Always start from opaque
	// 			const endValue = 0; // Always go to transparent

	// 			// Random threshold between 0.4 and 0.6 for more variation
	// 			const threshold = p.random(0.4, 0.6);

	// 			// Add padding from edges (10% of width/height)
	// 			const padding = {
	// 				x: w * 0.1,
	// 				y: h * 0.1
	// 			};

	// 			// Fixed gradient size (e.g., 40% of the canvas width)
	// 			const gradientSize = w * 0.4; // Reduced from 4 to 0.4 for better size

	// 			// Random start point within padded canvas bounds
	// 			const startX = p.random(padding.x, w - padding.x);
	// 			const startY = p.random(padding.y, h - padding.y);

	// 			// For linear gradients, calculate end point at fixed distance
	// 			const angle = Math.random() * Math.PI * 2;
	// 			const endX = startX + Math.cos(angle) * gradientSize;
	// 			const endY = startY + Math.sin(angle) * gradientSize;

	// 			// Create array of all pixel positions
	// 			const pixels = Array.from(
	// 				{ length: noiseLayer.width * noiseLayer.height * 4 },
	// 				(_, i) => i
	// 			);

	// 			pixels.forEach((_, i) => {
	// 				if (i % 4 === 0) {
	// 					const x = (i / 4) % noiseLayer.width;
	// 					const y = Math.floor(i / 4 / noiseLayer.width);

	// 					let gradientValue;
	// 					if (isCircular) {
	// 						const distance = p.dist(x, y, startX, startY);
	// 						gradientValue = p.map(distance, 0, gradientSize, endValue, startValue);
	// 						gradientValue = p.constrain(gradientValue, 0, 255);
	// 					} else {
	// 						const distance = p.dist(x, y, startX, startY);
	// 						gradientValue = p.map(distance, 0, gradientSize, endValue, startValue);
	// 						gradientValue = p.constrain(gradientValue, 0, 255);
	// 					}

	// 					// Convert gradient value to binary based on threshold
	// 					const normalizedValue = gradientValue / 255; // Convert to 0-1 range
	// 					const isVisible = Math.random() < normalizedValue * threshold; // Use threshold for randomization
	// 					const noiseValue = isVisible ? 50 : 0; // Binary: either fully opaque or fully transparent

	// 					// Convert hex to RGB components
	// 					const col = p.color(endColor);
	// 					const r = p.red(col);
	// 					const g = p.green(col);
	// 					const b = p.blue(col);

	// 					// Set RGBA values
	// 					noiseLayer.pixels[i] = r; // R
	// 					noiseLayer.pixels[i + 1] = g; // G
	// 					noiseLayer.pixels[i + 2] = b; // B
	// 					noiseLayer.pixels[i + 3] = noiseValue; // A
	// 				}
	// 			});

	// 			noiseLayer.updatePixels();

	// 			if (blurNoise) {
	// 				noiseLayer.filter(p.BLUR, 0.01);
	// 			}
	// 		}

	// 		const linearGradient = (p, canvas, startX, startY, radius, endX, endY, startColor, endColor) => {
	// 			let gradient = canvas.drawingContext.createLinearGradient(startX, startY, endX, endY);
	// 			gradient.addColorStop(0, startColor);
	// 			gradient.addColorStop(1, endColor);
	// 			canvas.drawingContext.fillStyle = gradient;
	// 			canvas.rect(0, 0, w, h);
	// 			canvas.fill();
	// 		};

	// 		function createGradientLayer(canvas, startColor, endColor) {
	// 			gradientLayer.noStroke();

	// 			// Convert hex to color objects
	// 			const startCol = p.color(startColor);
	// 			const endCol = p.color(endColor);

	// 			// for (let y = 0; y < h; y++) {
	// 			// 	const progress = y / h;
	// 			// 	const r = p.lerp(p.red(startCol), p.red(endCol), progress);
	// 			// 	const g = p.lerp(p.green(startCol), p.green(endCol), progress);
	// 			// 	const b = p.lerp(p.blue(startCol), p.blue(endCol), progress);
	// 			// 	const alpha = p.map(y, 0, h, 25, 255);
	// 			// }
	// 			linearGradient(canvas, 0, 0, 0, w, h, startCol, endCol);
	// 		}

	// 		function drawGradient() {
	// 			// Clear main buffer
	// 			gfx.clear();

	// 			// Draw gradient first
	// 			gfx.drawingContext.globalCompositeOperation = 'source-over';
	// 			gfx.image(gradientLayer, 0, 0);

	// 			// Use 'soft-light' for a more subtle blend with the noise
	// 			gfx.drawingContext.globalCompositeOperation = 'color-burn';
	// 			gfx.image(noiseLayer, 0, 0, w, h);

	// 			// Add a second pass with 'overlay' for more contrast
	// 			// gfx.drawingContext.globalCompositeOperation = 'overlay';
	// 			// gfx.image(noiseLayer, 0, 0, w, h);

	// 			// Reset to default compositing
	// 			gfx.drawingContext.globalCompositeOperation = 'source-over';
	// 		}

	// 		p.draw = () => {
	// 			p.clear();

	// 			// Update mask with 'destination-in' to preserve alpha
	// 			mask.clear();
	// 			mask.fill(255);
	// 			mask.noStroke();
	// 			mask.ellipse(w / 2, h / 2, w, h);

	// 			let maskedGfx = gfx.get();
	// 			maskedGfx.drawingContext.globalCompositeOperation = 'destination-in';
	// 			maskedGfx.mask(mask);

	// 			p.image(maskedGfx, 0, 0);
	// 		};

	// 		p.windowResized = () => {
	// 			// No need to handle window resize since we're using fixed div size
	// 		};
	// 	});
	// });
</script>

<div class="flex h-[800px] w-full items-center justify-center">
	<div class="p-2">
		<div class="h-[500px] w-[500px]" bind:this={canvasParent}></div>
	</div>
</div>
