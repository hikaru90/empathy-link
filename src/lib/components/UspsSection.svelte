<script>
  import { m } from '$lib/translations';
  import Check from 'lucide-svelte/icons/check';
  import { checkVisibility } from '$lib/actions';

  const usps = [
    {
      heading: m.page_home_usp1(),
      description: m.page_home_usp1_description()
    },
    {
      heading: m.page_home_usp2(),
      description: m.page_home_usp2_description()
    },
    {
      heading: m.page_home_usp3(),
      description: m.page_home_usp3_description()
    }
  ]
</script>

<div class="mb-40 flex flex-col md:flex-row items-start md:justify-center gap-4 md:gap-8">
    {#each usps as usp, index}
      <div use:checkVisibility class="transform opacity-0 translate-y-10 is-visible:translate-y-0 is-visible:opacity-100 transition-all duration-700 bg-white/90 p-4 rounded-lg border border-white w-full md:w-[18em] flex gap-2" style="transition-delay: {(index +1) * 200}ms;">
        <div class="size-5 bg-green-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <Check class="size-3" />
        </div>
        <div class="flex flex-col items-start justify-center gap-1">
          <h3 class="font-bold">{usp.heading}</h3>
          <p class="max-w-md">{usp.description}</p>
        </div>
        </div>
    {/each} 
</div>