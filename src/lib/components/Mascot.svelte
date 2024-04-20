<script lang="ts">
	export let step:number;
	export let stepName:string;
</script>

<div class="flex w-full justify-center md:justify-start items-end gap-2 mt-6 ">
  <div class="{step === 1 ? 'scale-100':'scale-0'} transform h-12 w-8 rounded-t-xl rounded-b-md bg-info-foreground transition duration-700 flex items-center justify-center relative">
    <div data-name="face" class="face-1 flex flex-col gap-0.5 w-1/3">
      <div data-name="eyes" class="eyes flex justify-center items-center gap-1">
        <div class="w-1.5 h-2 bg-white rounded-full"></div>
        <div class="w-1.5 h-2 bg-white rounded-full"></div>
      </div>
      <div>
        <div class="flex justify-center">
          <div class="w-4 h-1 bg-observation-background rounded-t-full mb-[1px]"></div>
        </div>
        <div data-name="mouth" class="mouth flex justify-center">
          <div class="w-2 h-0.5 bg-white rounded-t-full"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="{step === 2 ? 'scale-100':'scale-0'} h-20 w-20 rounded-full -mr-6 -ml-3 bg-observation-foreground transition duration-700 flex items-center justify-center relative">
    <div data-name="face" class="face-2 flex flex-col gap-1">
      <div>
        <div class="w-4 h-2 bg-black -mb-0.5 relative z-10"></div>
        <div data-name="eyes" class="eyes flex justify-center items-center gap-2">
          <div class="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
      <div data-name="mouth" class="mouth flex items-center justify-center">
        <div class="w-2 h-1 bg-white rounded-full"></div>
      </div>
    </div>
  </div>

	<div class="{step === 3 ? 'scale-100':'scale-0'} h-16 w-32 rounded-t-full bg-feelings-foreground transition duration-700 flex items-center justify-center relative z-10">
    <div data-name="face" class="face-3 flex flex-col gap-1">
      <div data-name="eyes" class="eyes flex justify-center items-center gap-2">
        <div class="w-2 h-2 bg-white rounded-full"></div>
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <div data-name="mouth" class="mouth flex items-center justify-center">
        <div class="w-2.5 h-1.5 bg-white rounded-b-full"></div>
      </div>
    </div>
  </div>

  <div class="{step === 4 ? 'scale-100':'scale-0'} h-24 w-32 rounded-full transform -translate-x-16 bg-needs-foreground transition duration-700 flex flex-col items-center justify-center relative">
    <div data-name="face" class="face-4 flex flex-col gap-1 h-1/3 -mb-2">
      <div data-name="eyes" class="eyes flex justify-center items-center gap-3 ">
        <div class="w-2 h-1.5 bg-white rounded-full"></div>
        <div class="w-2 h-1.5 bg-white rounded-full"></div>
      </div>
      <div data-name="mouth" class="mouth flex items-center justify-center">
        <div class="w-4 h-1.5 bg-white rounded-full"></div>
      </div>
    </div>
    <div class="h-2/3 w-full"></div>
  </div>
  <div class="{step === 5 ? 'scale-100':'scale-0'} h-12 w-12 rounded-full transform -translate-x-16 bg-request-foreground transition duration-700 flex flex-col items-center justify-center relative">
    <div data-name="face" class="face-5 flex flex-col gap-0.5">
      <div data-name="eyes" class="eyes flex justify-center items-center gap-1 ">
        <div class="w-1 h-1 bg-red-800/80 rounded-full "></div>
        <div class="w-1 h-1 bg-red-800/80 rounded-full "></div>
      </div>
      <div data-name="mouth" class="mouth flex items-center justify-center">
        <div class="w-1 h-1 bg-red-800/60 rounded-full"></div>
      </div>
    </div>
  </div>
</div>


<style lang="scss">
  .face-1{
    animation: lookaround 19s infinite;
  }
  .face-2{
    animation: lookaround 16s 4s infinite;
  }
  .face-3{
    animation: lookaround 10s 2s infinite;
  }
  .face-4{
    animation: lookaround 20s 5s infinite;
  }
  .face-5{
    animation: lookaround 5s 3s infinite;
  }
  .mouth{
    animation: mouth 10s infinite;
  }

  @keyframes mouth{
    0%{
      transform: scaleY(0.2);
    }
    5%{
      transform: scaleY(1);
    }
    25%{
      transform: scaleY(0.2);
    }
    100%{
      transform: scaleY(1);
    }
    
  }
  @keyframes lookaround{
    0%{
      transform: translate(0, 0);
    }
    5%{
      transform: translate(-40%, 0);
    }
    25%{
      transform: translate(80%, 0);
    }
    30%{
      transform: translate(60%, 72%);
    }
    50%{
      transform: translate(60%, 72%);
    }
    55%{
      transform: translate(-60%, 64%);
    }
    85%{
      transform: translate(-60%, 64%);
    }
    100%{
      transform: translate(0, 0);
    }
  }
</style>