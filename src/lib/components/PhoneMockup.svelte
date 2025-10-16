<script lang="ts">
  import { cn } from "$lib/utils.js";
  
	
  interface Props {
    class?: string | undefined;
    mockup: any;
    color: any;
    inverted?: boolean;
  }

  let {
    class: className = undefined,
    mockup,
    color,
    inverted = false
  }: Props = $props();
 
</script>

<div class={cn('flex items-center justify-center relative', className)}>
  <img src="phone_frontal.png" alt="Phone Mockup" class="">
  <div class="bg-black bg-contain bg-bottom bg-no-repeat absolute w-[calc(100%-20px)] h-[calc(100%-20px)] rounded-[35px] transform translate-y-1px z-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]"></div>
  <div style="background-image: url('{mockup}')" class="bg-contain bg-bottom bg-no-repeat absolute w-[calc(100%-1.8em)] h-[calc(100%-1.8em)] {color} rounded-[26px] sm:rounded-[16px] md:rounded-[24px] transform translate-y-1px">
    <div class="absolute top-10 left-0 border-t border-black/10 w-full">
      </div>
    <div class="relative">
      <div class="absolute top-0 left-0 z-10 w-full flex items-center justify-between px-6 py-3">
        <span class="text-[9px] font-bold {inverted? 'text-white' : 'text-black'}">
          09:46
        </span>
        <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[3.6em] h-[1.2em] bg-black rounded-full flex items-center justify-end px-[4px] pt-[2px]">
          <img src="/phone-lens.jpg" alt="Phone Lens" class="w-4 h-4 rounded-full">
        </div>
        <img src="{ inverted ? '/phone-icons-inverted.svg' : '/phone-icons.svg' }" alt="Phone Icons" class="h-1.5 sm:h-2">
      </div>
    </div>
  </div>
</div>