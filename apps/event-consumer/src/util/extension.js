export const isNum = (val) => {
  return !Number.isNaN(Number.parseInt(val));
};

export const isLetter = (char) => {
  return char.match(/[a-z]/i);
};
