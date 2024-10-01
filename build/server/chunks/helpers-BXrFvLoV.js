import './translations-BF87NCsX.js';

const serializeNonPOJOs = (obj) => {
  return structuredClone(obj);
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const generateHslaColors = (hue, saturation, lightness, length) => {
  const colors = [];
  for (let i = 1; i < length + 1; i++) {
    let opacity = i / (length - 1);
    if (length === 1)
      opacity = 1;
    const hslaColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
    colors.push(hslaColor);
  }
  colors.reverse();
  console.log("colors", colors);
  return colors;
};
const sortByKey = (array, key) => {
  return array.sort((a, b) => {
    if (a[key] < b[key]) {
      return 1;
    }
    if (a[key] > b[key]) {
      return -1;
    }
    return 0;
  });
};
const setCookie = (name, value, days) => {
};
const debounce = (func, delay2) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay2);
  };
};

export { setCookie as a, sortByKey as b, delay as c, debounce as d, generateHslaColors as g, serializeNonPOJOs as s };
//# sourceMappingURL=helpers-BXrFvLoV.js.map
