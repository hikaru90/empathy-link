// store.js
import { goto } from '$app/navigation';
import { writable, derived } from "svelte/store";

// Initialize the store with a default value
export let user = writable(undefined);
export let token = writable(undefined);

user.subscribe((value) => {
  console.log('user changed');
})
token.subscribe((value) => {
  console.log('token changed');
})