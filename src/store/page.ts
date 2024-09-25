import { writable, derived } from "svelte/store";

export let scroll = writable(0);
export let windowHeight = writable(0);
export let windowWidth = writable(0);
export let backgroundColor = writable('bg-white');
export let currentSection = writable('topTarget');

backgroundColor.subscribe((value) => {
    console.log('backgroundColor',value);
})
scroll.subscribe((value) => {
    // console.log('scroll',value);
})

windowHeight.subscribe((value) => {
  console.log('windowHeight changed',value);
})
windowWidth.subscribe((value) => {
  console.log('windowWidth changed',value);
})