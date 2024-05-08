<script lang="ts">
  import backgroundImage from '$assets/images/holo3.jpg';

	export let step:number;
	export let stepName:string;
</script>

<div class="flex left-0 right-0 justify-center gap-1 h-12 relative -mx-4 mt-2">
	<div style="background-image: url('{backgroundImage}'); background-size: 300% 100%" class="animate-bg h-full w-[60px] rounded-t-[50px] rounded-b transition duration-700 flex items-center justify-center relative z-10 shadow-lg">
    <div data-name="face" class="face-3 flex flex-col gap-1">
      <div data-name="eyes" class="eyes flex justify-center items-center gap-2">
        <div class="w-2 h-2 bg-black border-2 border-white rounded-full shadow-md"></div>
        <div class="w-2 h-2 bg-black border-2 border-white rounded-full shadow-md"></div>
      </div>
      <div data-name="mouth" class="mouth flex items-center justify-center">
        <div class="w-2.5 h-1.5 bg-black rounded-b-full"></div>
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
      transform: scaleY(0.4);
    }
    5%{
      transform: scaleY(1);
    }
    25%{
      transform: scaleY(0.4);
    }
    100%{
      transform: scaleY(1);
    }
    
  }
  @keyframes lookaround{
    0%{
      transform: translate(0, 20%);
    }
    5%{
      transform: translate(-20%, 20%);
    }
    25%{
      transform: translate(40%, 20%);
    }
    30%{
      transform: translate(30%, 52%);
    }
    50%{
      transform: translate(30%, 52%);
    }
    55%{
      transform: translate(-30%, 44%);
    }
    85%{
      transform: translate(-30%, 44%);
    }
    100%{
      transform: translate(0, 20%);
    }
  }
</style>