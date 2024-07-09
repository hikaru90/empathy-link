const serializeNonPOJOs = (obj) => {
  return structuredClone(obj);
};
const generateHslaColors = (hue, saturation, lightness, length) => {
  const colors = [];
  for (let i = 1; i < length + 1; i++) {
    const opacity = i / (length - 1);
    const hslaColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
    colors.push(hslaColor);
  }
  colors.reverse();
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

export { sortByKey as a, setCookie as b, generateHslaColors as g, serializeNonPOJOs as s };
//# sourceMappingURL=helpers-CZwe_-RP.js.map
