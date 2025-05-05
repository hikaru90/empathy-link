import "./client.js";
import { w as writable } from "./index2.js";
const user = writable(void 0);
let token = writable(void 0);
user.subscribe((value) => {
});
token.subscribe((value) => {
});
export {
  user as u
};
