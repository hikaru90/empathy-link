<script lang="ts">
  import { t } from '$lib/translations';
  import IconFolder from "$assets/icons/icon-folder.svg?raw";
  import IconSelf from "$assets/icons/icon-self.svg?raw";
  import IconFight from "$assets/icons/icon-fight.svg?raw";
  import IconFeedback from "$assets/icons/icon-feedback.svg?raw";
  import IconLearn from "$assets/icons/icon-learn.svg?raw";
	import { get } from 'svelte/store';
  import { page } from '$app/stores';

  let menuItems = [
    { slug: 'home', name: get(t)('default.menu.bar.home'), path: '/dashboard', icon: IconFolder, available: true },
    { slug: 'selfempathy', name: get(t)('default.menu.bar.selfempathy'), path: '/selfempathy', icon: IconSelf, available: false },
    { slug: 'fights', name: get(t)('default.menu.bar.fights'), path: '/fights', icon: IconFight, available: true },
    { slug: 'feedback', name: get(t)('default.menu.bar.feedback'), path: '/feedback', icon: IconFeedback, available: false },
    { slug: 'learn', name: get(t)('default.menu.bar.learn'), path: '/learn', icon: IconLearn, available: false },
  ]

  t.subscribe(value => {
    const newMenuItems = menuItems.map(entry => {
      const translation = value(`default.menu.bar.${entry.slug}`)
      entry.name = translation
      return entry
    })
    menuItems = [...newMenuItems]
  })

</script>

<!-- <div class="inverted-border fixed bottom-0 left-0 w-full bg-black text-gray-200 px-4 pb-4 pt-2 z-[1002]"> -->
  <div class="fixed bottom-0 left-0 w-full bg-black text-gray-200 px-4 pb-4 pt-2 z-[1002]">
  <img src="/inverted-border.svg" alt="" class="w-5 absolute top-0 left-0 transform -translate-y-full">
  <img src="/inverted-border.svg" alt="" class="w-5 absolute top-0 right-0 transform -translate-y-full -rotate-90">
  <div class="bg-black absolute top-0 left-0 w-full h-[0.5px] transform -translate-y-full">
  </div>
  <div class="flex items-center justify-around">
    {#each menuItems as item}
    <div class="relative flex flex-col items-center justify-center { item.available ? '':'opacity-40'} last:mr-2">
      <a href={item.path} class="flex flex-col items-center justify-center { item.available ? '' :'pointer-events-none' }">
        <div class="w-6 h-6 fill-white">
          {@html item.icon}
        </div>
        <span class="text-2xs lg:text-xs lg:mt-2">
          {item.name}
        </span>
      </a>
      {#if $page.data.route === item.path}
      <div class="absolute -bottom-2 flex justify-center">
        <div class="w-1 h-1 rounded-full bg-neon">
        </div>
      </div>
      {/if}
      {#if !item.available}
      <div class="absolute bottom-2.5 left-1/3 bg-red-600 rounded-full text-[6px] px-1 transform translate-x-1/2">
        {$t('default.menu.soon')}
      </div>
      {/if}
    </div>
    {/each}
  </div>
</div>

<style lang="scss">
  // .inverted-border:before{
  //   @apply w-4 h-40 rounded-bl-full md:w-8 absolute -z-10 top-0 left-0 transform -translate-y-full pointer-events-none;
  //   content: '';
  //   box-shadow: 0 50px 0 0 black;
  // }
  // .inverted-border:after{
  //   @apply w-4 h-40 rounded-br-full md:w-8 absolute -z-10 top-0 right-0 transform -translate-y-full pointer-events-none;
  //   content: '';
  //   box-shadow: 0 50px 0 0 black;
  // }
</style>