<script>
  // Import any necessary dependencies
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n'

  // Define component properties
  $: menuItems = [
    { label: $_('page.home.nav') },
    { label: $_('page.contact.nav') },
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
<nav class="flex items-center justify-between px-4 py-3 border-b dark:border-red-200">
  <div>
    Empathy Link
  </div>
  <div class="flex items-center gap-4">
    {#each menuItems as item}
      <button on:click={() => handleMenuItemClick(item)}>{item.label}</button>
    {/each}
  </div>
</nav>