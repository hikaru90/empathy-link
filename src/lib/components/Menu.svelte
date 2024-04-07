<script>
  // Import any necessary dependencies
  import { onMount } from 'svelte';
  import Logo from './Logo.svelte'
  import { t } from '$lib/translations';

  // Define component properties
  $: menuItems = [
    { label: $t('default.page.home.nav') },
    { label: $t('default.page.contact.nav') },
  ];

  // Define any component functions or lifecycle hooks
  onMount(() => {
    // Any initialization logic can go here
  });

  // Define any other component-specific functions
  function handleMenuItemClick(item) {
    // Handle click event for menu items
    console.log('Clicked:', item);
  }
</script>

<!-- Component HTML structure -->
<nav class="flex items-center justify-between px-4 py-3 border-b dark:border-gray-200/10">
  <a href="/">
    <Logo />
  </a>
  <div class="flex items-center gap-4">
    {#each menuItems as item}
      <button on:click={() => handleMenuItemClick(item)}>{item.label}</button>
    {/each}
  </div>
</nav>