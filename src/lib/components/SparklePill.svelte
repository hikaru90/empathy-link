<script lang="ts">
	import backgroundImage from '$assets/images/holo3.jpg';
  import { cn } from "$lib/utils.js";


	interface Props {
		fast?: boolean;
		class?: string|undefined;
	}

	let { fast = false, class: className = undefined }: Props = $props();
	
</script>

<div
	style="background-image: url('{backgroundImage}'); background-size: 300% 100%"
	class={cn(fast ? 'animate-bg-fast' : 'animate-bg', "h-3 w-6 rounded-full bg-center bg-repeat-x", className)}
></div>
