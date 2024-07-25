import { writable, derived } from "svelte/store";

export let scroll = writable(0);
export let windowHeight = writable(0);
export let windowWidth = writable(0);

scroll.subscribe((value) => {
  console.log('scroll changed',value);
})

windowHeight.subscribe((value) => {
  console.log('windowHeight changed',value);
})
windowWidth.subscribe((value) => {
  console.log('windowWidth changed',value);
})