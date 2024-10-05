import "./client.js";
import { w as writable } from "./index2.js";
let user = writable(void 0);
let token = writable(void 0);
user.subscribe((value) => {
  console.log("user changed", value);
});
token.subscribe((value) => {
  console.log("token changed", value);
});
export {
  user as u
};
