import { tv } from "tailwind-variants";
import "dequal";
import "./create.js";
import "clsx";
import { w as writable } from "./index2.js";
const buttonVariants = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
let scroll = writable(0);
let windowHeight = writable(0);
let windowWidth = writable(0);
let backgroundColor = writable("bg-white");
let currentSection = writable("topTarget");
backgroundColor.subscribe((value) => {
  console.log("backgroundColor", value);
});
scroll.subscribe((value) => {
});
windowHeight.subscribe((value) => {
  console.log("windowHeight changed", value);
});
windowWidth.subscribe((value) => {
  console.log("windowWidth changed", value);
});
export {
  windowHeight as a,
  backgroundColor as b,
  currentSection as c,
  buttonVariants as d,
  scroll as s,
  windowWidth as w
};
