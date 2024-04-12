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
    { name: get(t)('default.menu.bar.home'), slug: '/home', icon: IconFolder, available: true },
    { name: get(t)('default.menu.bar.selfempathy'), slug: '/selfempathy', icon: IconSelf, available: true },
    { name: get(t)('default.menu.bar.fights'), slug: '/fights', icon: IconFight, available: false },
    { name: get(t)('default.menu.bar.feedback'), slug: '/feedback', icon: IconFeedback, available: false },
    { name: get(t)('default.menu.bar.learn'), slug: '/learn', icon: IconLearn, available: false },
  ]

  t.subscribe(value => {
    menuItems = [
    { name: value('default.menu.bar.home'), url: '/dashboard', icon: IconFolder, available: true },
    { name: value('default.menu.bar.selfempathy'), url: '/selfempathy', icon: IconSelf, available: true },
    { name: value('default.menu.bar.fights'), url: '/fights', icon: IconFight, available: false },
    { name: value('default.menu.bar.feedback'), url: '/feedback', icon: IconFeedback, available: false },
    { name: value('default.menu.bar.learn'), url: '/learn', icon: IconLearn, available: false },
  ]
  })

</script>

<div class="inverted-border fixed bottom-0 left-0 w-full bg-black text-gray-200 p-4">
  <div class="flex items-center justify-around">
    {#each menuItems as item}
    <div class="relative flex flex-col items-center justify-center { item.available ? '':'opacity-40'}">
      <a href={item.url} class="flex flex-col items-center justify-center { item.available ? '' :'pointer-events-none' }">
        <div class="w-6 h-6 fill-white">
          {@html item.icon}
        </div>
        <span class="text-2xs lg:text-xs lg:mt-2">
          {item.name}
        </span>
      </a>
      {#if $page.data.route === item.url}
      <div class="absolute -bottom-2 flex justify-center">
        <div class="w-1 h-1 rounded-full bg-neon">
        </div>
      </div>
      {/if}
      {#if !item.available}
      <div class="absolute bottom-2.5 right-1 bg-red-600 rounded-full text-2xs px-1 transform translate-x-full">
        {$t('default.menu.soon')}
      </div>
      {/if}
    </div>
    {/each}
  </div>
</div>

<style>
  .inverted-border:before{
    @apply w-4 h-40 rounded-bl-full md:w-8 lg:w-12 absolute -z-10 top-0 left-0 transform -translate-y-full pointer-events-none;
    content: '';
    box-shadow: 0 50px 0 0 black;
  }
  .inverted-border:after{
    @apply w-4 h-40 rounded-br-full md:w-8 lg:w-12 absolute -z-10 top-0 right-0 transform -translate-y-full pointer-events-none;
    content: '';
    box-shadow: 0 50px 0 0 black;
  }
</style>