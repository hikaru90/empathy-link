<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import CheckCircle from 'lucide-svelte/icons/check-circle';
	import Trophy from 'lucide-svelte/icons/trophy';
	import Home from 'lucide-svelte/icons/home';

	interface Props {
		topic: any;
		color: string;
		onReturnToOverview?: () => void;
	}

	let { topic, color, onReturnToOverview }: Props = $props();

	const handleReturnToOverview = () => {
		if (onReturnToOverview) {
			onReturnToOverview();
		} else {
			window.location.href = '/bullshift/learn';
		}
	};
</script>

<div class="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
	<!-- Success Icon -->
	<div class="relative">
		<div 
			class="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
			style="background-color: {color};"
		>
			<Trophy class="w-12 h-12 text-white" />
		</div>
		<div class="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg">
			<CheckCircle class="w-6 h-6 text-white" />
		</div>
	</div>

	<!-- Congratulations Message -->
	<div class="space-y-4">
		<h1 class="text-4xl font-bold text-gray-900">
			Glückwunsch! 🎉
		</h1>
		<h2 class="text-xl text-gray-600 max-w-md">
			Du hast das Modul <span class="font-semibold" style="color: {color};">{topic.titleDE.split('||')[0]}</span> erfolgreich abgeschlossen!
		</h2>
	</div>

	<!-- Achievement Summary -->
	<div class="bg-white rounded-2xl p-6 shadow-lg border max-w-md w-full">
		<div class="space-y-4">
			<div class="flex items-center justify-between">
				<span class="text-gray-600">Status:</span>
				<div class="flex items-center gap-2">
					<CheckCircle class="w-5 h-5 text-green-500" />
					<span class="font-semibold text-green-600">Abgeschlossen</span>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-gray-600">Modul:</span>
				<span class="font-semibold">{topic.titleDE.split('||')[0]}</span>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-gray-600">Kategorie:</span>
				<span class="font-medium text-gray-800">{topic.expand?.category?.nameDE || 'Allgemein'}</span>
			</div>
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
		<Button
			onclick={handleReturnToOverview}
			class="flex-1 flex items-center justify-center gap-2 py-3"
			style="background-color: {color};"
		>
			<Home class="w-5 h-5" />
			Zur Übersicht
		</Button>
	</div>

	<!-- Motivational Message -->
	<div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-md">
		<p class="text-gray-700 text-sm">
			Großartige Arbeit! Jeder abgeschlossene Schritt bringt dich näher zu einer stärkeren Empathiefähigkeit. Mach weiter so! 💪
		</p>
	</div>
</div> 