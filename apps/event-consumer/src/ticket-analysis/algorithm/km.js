import getRoadCode from './word-followed-by-number.js';

const km = 'km';

/** @param {string} highway */
export const kmRetrieve = (highway) => {
  return getRoadCode(km, highway);
};
