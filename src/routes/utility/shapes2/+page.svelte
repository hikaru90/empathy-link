<script lang="ts">
	import { run } from 'svelte/legacy';

	import { onMount } from 'svelte';
	import P5 from 'p5';

	let p: P5 | undefined;
	let canvasParent: HTMLDivElement | undefined = $state();
	let canvas: Element | undefined;
	let w: number | undefined = $state();
	let h: number | undefined;
	let currentImageId = $state(1);
	const noiseStrength = 100;
	const blurNoise = false;
	const drawColorGradient = true;

	run(() => {
		if (w !== undefined) {
			console.log('Width changed:', w);
		}
	});

	const colors = [
		'#fff', // Red
		'#222', // Green
		'#c8c8c8', // Blue
		'#222', // Yellow
		'#222' // Magenta
	];

	const downloadImage = () => {
		if (!p) return;
		
		// Create a temporary canvas
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = w;
		tempCanvas.height = h;
		const ctx = tempCanvas.getContext('2d');
		
		// Draw the P5 canvas content
		ctx.drawImage(p.canvas, 0, 0);
		
		// Create an image with the mask
		const img = new Image();
		img.onload = () => {
			// Apply the mask using globalCompositeOperation
			ctx.globalCompositeOperation = 'destination-in';
			ctx.drawImage(img, 0, 0, w, h);
			
			// Create download link
			const link = document.createElement('a');
			link.download = `abstract-art-${currentImageId}.png`;
			link.href = tempCanvas.toDataURL('image/png');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		};
		img.src = `/shapes/shape${currentImageId}.svg`;
	};

	const drawCanvas = () => {
		if (!p || !w || !h) return;
		currentImageId = Math.floor(Math.random() * 9)+1;

		p.clear();  // Clear the canvas
		p.noStroke();
		
		// Draw your layers
		drawLinearGradient(0, 0, w, h, colors[0], colors[2]);
		for (let i = 0; i < 3; i++) {
			drawRadialGradient(
				Math.random() * w,
				Math.random() * h,
				w,
				colors[Math.floor(Math.random() * 5)]
			);
		}
		createNoiseLayer(colors[Math.floor(Math.random() * 5)]);
	};

	const drawRadialGradient = (x0: number, y0: number, radius: number, color: string) => {
		let gradient = p.drawingContext.createRadialGradient(
			x0,
			y0,
			0, // inner circle (x, y, radius)
			x0,
			y0,
			radius // outer circle (x, y, radius)
		);

		const col = p.color(color);
		const transparentCol = p.color(p.red(col), p.green(col), p.blue(col), 0);

		// Add color stops
		gradient.addColorStop(0, color);
		gradient.addColorStop(1, transparentCol);

		// Apply gradient
		p.drawingContext.fillStyle = gradient;

		// Draw the shape (centered)
		p.rect(0, 0, w, h);
	};

	const drawLinearGradient = (
		x0: number,
		y0: number,
		width: number,
		height: number,
		color1: string,
		color2: string
	) => {
		let gradient = p.drawingContext.createLinearGradient(x0, y0, width, height);
		gradient.addColorStop(0, color1);
		gradient.addColorStop(1, color2);
		p.drawingContext.fillStyle = gradient;
		p.rect(0, 0, w, h);
	};

	const createNoiseLayer = (endColor: string) => {
		if (!w || !h) return;

		// p.clear();
		const noiseLayer = p.createGraphics(w, h);
		noiseLayer.noStroke();

		// Random gradient settings
		const isCircular = Math.random() > 0.5;
		const startValue = 100;
		const endValue = 0;
		const threshold = p.random(0.4, 0.6);
		const gradientSize = w * 0.4;

		// Random start point
		const startX = p.random(w * 0.1, w * 0.9);
		const startY = p.random(h * 0.1, h * 0.9);

		// Draw noise points
		for (let x = 0; x < w; x++) {
			for (let y = 0; y < h; y++) {
				const distance = p.dist(x, y, startX, startY);
				const gradientValue = p.map(distance, 0, gradientSize, endValue, startValue);
				const normalizedValue = p.constrain(gradientValue, 0, 255) / 255;

				if (Math.random() < normalizedValue * threshold) {
					noiseLayer.fill(endColor);
					noiseLayer.rect(x, y, 1, 1);
				}
			}
		}

		if (blurNoise) {
			noiseLayer.filter(p.BLUR, 0.01);
		}

		// Draw to main canvas
		p.drawingContext.globalAlpha = 0.5;
		p.drawingContext.globalCompositeOperation = 'overlay';
		p.image(noiseLayer, 0, 0);
	};

	onMount(() => {
		p = new P5((p5Instance) => {
			p5Instance.setup = () => {
				canvas = p5Instance.createCanvas(w, h).parent(canvasParent);
			};

			w = canvasParent!.offsetWidth;
			h = canvasParent!.offsetHeight;

			return p5Instance;
		});
		drawCanvas();
	});
</script>

<div class="flex h-[100px] w-full items-center justify-center gap-2">
	<button onclick={drawCanvas} class="bg-blue-500 text-white p-2 rounded-md">
		Redraw
	</button>
	<button onclick={downloadImage} class="bg-green-500 text-white p-2 rounded-md">
		Download
	</button>
</div>
<div class="flex h-[800px] w-full items-center justify-center">
	<div class="p-2">
		<div style="mask-image: url('/shapes/shape{currentImageId}.svg')" class="mask h-[500px] w-[500px]" bind:this={canvasParent}></div>
	</div>
</div>

<style>
</style>
