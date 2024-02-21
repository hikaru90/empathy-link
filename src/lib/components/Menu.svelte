<script>
  // Import any necessary dependencies
  import { onMount } from 'svelte';

  // Define component properties
  export let menuItems = [
    { label: 'Home' },
    { label: 'Kontakt' },
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
<nav class="flex items-center justify-between max-container">
  <div>
    Empathy Link
  </div>
  <div class="flex items-center">
    {#each menuItems as item}
      <div on:click={() => handleMenuItemClick(item)}>{item.label}</div>
    {/each}
  </div>
</nav>