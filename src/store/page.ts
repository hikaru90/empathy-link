import { writable, derived } from "svelte/store";

export let scroll = writable(0);

scroll.subscribe((value) => {
  console.log('scroll changed',value);
})