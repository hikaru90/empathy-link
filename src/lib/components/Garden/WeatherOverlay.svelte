<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '$lib/utils';

	interface Props {
		weather: string;
		class?: string;
	}

	let { weather, class: className = undefined }: Props = $props();
	let canvasRef: HTMLCanvasElement;
	let animationId: number;

	const weatherEffects = {
		sunny: { 
			color: 'hsla(52, 100%, 80%, 0.8)',
			particles: []
		},
		partly_cloudy: {
			color: 'hsla(0, 0%, 78%, 0.1)',
			particles: []
		},
		overcast: {
			color: 'hsla(0, 0%, 59%, 0.2)',
			particles: []
		},
		rainy: {
			color: 'hsla(210, 38%, 59%, 0.2)',
			particles: []
		},
		stormy: {
			color: 'hsla(240, 33%, 29%, 0.3)',
			particles: []
		},
		foggy: {
			color: 'hsla(0, 0%, 78%, 0.4)',
			particles: []
		},
		snowy: {
			color: 'hsla(240, 100%, 93%, 0.3)',
			particles: []
		}
	};

	class Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		opacity: number;
		type: string;

		constructor(canvas: HTMLCanvasElement, type: string) {
			this.x = Math.random() * canvas.width;
			this.y = -10;
			this.type = type;
			
			if (type === 'rain') {
				this.vx = 0; // No sideways movement
				this.vy = Math.random() * 6 + 20; // Slightly faster vertical speed
				this.size = Math.random() * 1 + 0.2; // Smaller size range
				this.opacity = Math.random() * 0.6 + 0.3;
			} else if (type === 'snow') {
				this.vx = Math.random() * 2 - 1;
				this.vy = Math.random() * 2 + 1;
				this.size = Math.random() * 4 + 2;
				this.opacity = Math.random() * 0.8 + 0.2;
			} else {
				this.vx = Math.random() * 1 - 0.5;
				this.vy = Math.random() * 1 + 0.5;
				this.size = Math.random() * 3 + 1;
				this.opacity = Math.random() * 0.5 + 0.1;
			}
		}

		update(canvas: HTMLCanvasElement) {
			this.x += this.vx;
			this.y += this.vy;

			if (this.y > canvas.height + 10) {
				this.y = -10;
				this.x = Math.random() * canvas.width;
			}

			if (this.x < -10 || this.x > canvas.width + 10) {
				this.x = Math.random() * canvas.width;
			}
		}

		draw(ctx: CanvasRenderingContext2D) {
			ctx.save();
			ctx.globalAlpha = this.opacity;

			if (this.type === 'rain') {
				// Simplified straight rain drops
				ctx.strokeStyle = `hsla(210, 68%, 59%, ${this.opacity})`;
				ctx.lineWidth = this.size;
				ctx.lineCap = 'round';
				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(this.x, this.y + this.vy * 8); // Much longer straight vertical lines
				ctx.stroke();
			} else if (this.type === 'snow') {
				ctx.fillStyle = 'hsla(0, 0%, 100%, 1)';
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.restore();
		}
	}

	let particles: Particle[] = [];

	const initParticles = (canvas: HTMLCanvasElement, weather: string) => {
		particles = [];
		let particleCount = 0;
		let particleType = '';

		switch (weather) {
			case 'rainy':
				particleCount = 20; // Reduced from 100
				particleType = 'rain';
				break;
			case 'snowy':
				particleCount = 40; // Reduced from 50
				particleType = 'snow';
				break;
			case 'stormy':
				particleCount = 40; // Reduced from 150
				particleType = 'rain';
				break;
			default:
				particleCount = 0;
		}

		for (let i = 0; i < particleCount; i++) {
			particles.push(new Particle(canvas, particleType));
		}
	};

	const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw gradient background overlay for weather atmosphere
		if (weatherEffects[weather as keyof typeof weatherEffects]) {
			const color = weatherEffects[weather as keyof typeof weatherEffects].color;
			
			let gradient;
			if (weather === 'sunny') {
				// Create linear gradient matching sun ray direction (top-right to bottom-left)
				gradient = ctx.createLinearGradient(
					canvas.width * 1.2, -canvas.height * 0.2, // Start from same position as sun rays
					canvas.width * 0.6, canvas.height * 0.6   // End towards bottom-left
				);
			} else {
				// Use radial gradient for other weather types
				gradient = ctx.createRadialGradient(
					canvas.width / 2, canvas.height * 0.3, 0,
					canvas.width / 2, canvas.height * 0.3, Math.max(canvas.width, canvas.height) * 0.8
				);
			}
			
			gradient.addColorStop(0, color);
			gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fade to transparent
			
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		// Draw special weather effects
		if (weather === 'sunny') {
			drawSunRays(ctx, canvas);
		}

		// Draw particles
		particles.forEach(particle => {
			particle.update(canvas);
			particle.draw(ctx);
		});

		animationId = requestAnimationFrame(() => animate(canvas, ctx));
	};

	const drawSunRays = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
		const time = Date.now() * 0.001; // For animation
		const rayCount = 4;
		
		// Draw angled sun rays from top right (extending from outside canvas)
		for (let i = 0; i < rayCount; i++) {
			const xOffset = (i - rayCount / 2) * (canvas.width / rayCount); // Spread across width
			const startX = canvas.width * 1.2 + xOffset + Math.sin(time * 0.2 + i) * 15; // Start beyond right edge
			const startY = -canvas.height * 0.2; // Start above canvas
			
			// Variable ray length
			const baseLength = 0.4 + (i % 3) * 0.15; // Different lengths: 0.4, 0.55, 0.7
			const endX = startX - (canvas.width * 0.2); // Angle towards bottom left
			const endY = canvas.height * baseLength;
			
			// Create ray gradient along the angled line
			const rayGradient = ctx.createLinearGradient(startX, startY, endX, endY);
			rayGradient.addColorStop(0, 'hsla(52, 100%, 75%, 0.2)');
			rayGradient.addColorStop(0.2, 'hsla(52, 100%, 75%, 0.1)');
			rayGradient.addColorStop(1, 'hsla(52, 100%, 75%, 0)');
			
			ctx.strokeStyle = rayGradient;
			ctx.lineWidth = 120 + Math.sin(time + i) * 1; // Slightly varying width
			ctx.lineCap = 'round';
			
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(endX, endY);
			ctx.stroke();
		}
	};

	const resizeCanvas = () => {
		if (!canvasRef) return;
		
		const parent = canvasRef.parentElement;
		if (parent) {
			canvasRef.width = parent.clientWidth;
			canvasRef.height = parent.clientHeight;
		}
	};

	onMount(() => {
		if (!canvasRef) return;

		const ctx = canvasRef.getContext('2d');
		if (!ctx) return;

		resizeCanvas();
		initParticles(canvasRef, weather);
		animate(canvasRef, ctx);

		const handleResize = () => {
			resizeCanvas();
			initParticles(canvasRef, weather);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			window.removeEventListener('resize', handleResize);
		};
	});

	// Reinitialize when weather changes
	$effect(() => {
		if (canvasRef) {
			initParticles(canvasRef, weather);
		}
	});
</script>

<canvas 
	bind:this={canvasRef}
	class={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
	style="z-index: 10;"
></canvas>