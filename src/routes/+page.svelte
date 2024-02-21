<script>
  import { ChevronRight } from "radix-icons-svelte";
  import { Button } from '$lib/components/ui/button'
  import { Sun, Moon } from "radix-icons-svelte";
  import { toggleMode } from "mode-watcher";

  import Menu from '$lib/components/Menu.svelte';
</script>

<Menu />

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Button variant="outline" size="icon">
  <ChevronRight class="h-4 w-4" />
</Button>

<Button on:click={toggleMode} variant="outline" size="icon">
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  <Moon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>

<style lang="scss">
	:global(.max-container){
    color: blue;
  }
</style>