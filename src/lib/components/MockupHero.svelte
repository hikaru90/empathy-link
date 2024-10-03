<script lang="ts">
  import { cn } from "$lib/utils.js";
  import HeroAnimation from '$lib/components/HeroAnimation.svelte';

  export let className:string|undefined = undefined;
	export { className as class };
</script>

<div class="text-[7px] md:text-[12px] lg:text-[16px]">
  <div class={cn("relative screen-container float", className)}>
    <img src="iphone_mockup.png" alt="" class="relative z-10" />
    <div class="screen shadow-[inset_0_0_20px_0_rgba(255,255,255,0.1)] bg-muted absolute top-1/2 left-1/2 w-[59%] h-[100%] rounded-[2em] overflow-hidden">
      <HeroAnimation />
    </div>
  </div>
</div>

<style lang="scss">
  .screen-container{
    perspective: 283em;
    perspective-origin: 109% 131%;
  }
  .screen {
    transform: translate(-53%, -52%) rotateY(-31deg) rotateX(20deg) rotateZ(-1deg);
  }
</style>
