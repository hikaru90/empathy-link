<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		weather: string;
	}

	let { weather }: Props = $props();
	let canvasRef: HTMLCanvasElement;
	let animationId: number;

	const weatherEffects = {
		sunny: { 
			color: 'rgba(255, 223, 0, 0.1)',
			particles: []
		},
		partly_cloudy: {
			color: 'rgba(200, 200, 200, 0.1)',
			particles: []
		},
		overcast: {
			color: 'rgba(150, 150, 150, 0.2)',
			particles: []
		},
		rainy: {
			color: 'rgba(100, 150, 200, 0.2)',
			particles: []
		},
		stormy: {
			color: 'rgba(50, 50, 100, 0.3)',
			particles: []
		},
		foggy: {
			color: 'rgba(200, 200, 200, 0.4)',
			particles: []
		},
		snowy: {
			color: 'rgba(220, 220, 255, 0.3)',
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
				this.vx = Math.random() * 2 - 1;
				this.vy = Math.random() * 5 + 5;
				this.size = Math.random() * 2 + 1;
				this.opacity = Math.random() * 0.8 + 0.2;
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
				ctx.strokeStyle = '#4A90E2';
				ctx.lineWidth = this.size;
				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(this.x + this.vx * 3, this.y + this.vy * 3);
				ctx.stroke();
			} else if (this.type === 'snow') {
				ctx.fillStyle = '#FFFFFF';
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
				particleCount = 100;
				particleType = 'rain';
				break;
			case 'snowy':
				particleCount = 50;
				particleType = 'snow';
				break;
			case 'stormy':
				particleCount = 150;
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

		// Only draw particles, no background overlay
		particles.forEach(particle => {
			particle.update(canvas);
			particle.draw(ctx);
		});

		animationId = requestAnimationFrame(() => animate(canvas, ctx));
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
	class="absolute inset-0 w-full h-full pointer-events-none rounded-2xl bg-transparent"
	style="z-index: 5; background-color: transparent;"
></canvas>