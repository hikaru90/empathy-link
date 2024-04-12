<script>
  import { t } from '$lib/translations';
  import { Button as SparkleButton } from "$lib/components/ui/button-sparkle";
  import { Button } from "$lib/components/ui/button";
  
</script>

<div class="py-10 lg:py-32">
  <h1 class="font-display font-semibold text-3xl lg:text-7xl leading-[106%] mb-10">
    {$t('default.page.home.hero')}
  </h1>
  <a href="/auth/login">
    <SparkleButton class="shadow-lg dark:shadow-gray-300/30 text-black font-bold lg:text-lg px-3 py-5 lg:px-6 lg:py-7">
      {$t('default.page.home.cta')}
    </SparkleButton>
  </a>
</div>