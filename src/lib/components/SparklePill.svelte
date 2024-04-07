<script lang="ts">
	import backgroundImage from '$assets/images/holo3.jpg';
  import { cn } from "$lib/utils.js";

	export let fast = false;

  let className:string|undefined = undefined;
	export { className as class };
</script>

<div
	style="background-image: url('{backgroundImage}'); background-size: 300% 100%"
	class={cn(fast ? 'animate-bg-fast' : 'animate-bg', "h-3 w-6 rounded-full bg-center bg-repeat-x", className)}
></div>
