import { w as writable } from "./index2.js";
import { CalendarDate } from "@internationalized/date";
const todayDate = /* @__PURE__ */ new Date();
console.log("todayDate", todayDate);
let startDate = writable(
  new CalendarDate(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate()).subtract({
    days: 14
  })
);
let endDate = writable(
  new CalendarDate(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate())
);
startDate.subscribe((value) => {
  console.log("startDate changed", value);
});
endDate.subscribe((value) => {
  console.log("endDate changed", value);
});
export {
  endDate as e,
  startDate as s
};
