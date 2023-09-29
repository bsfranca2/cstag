import { isNum, isLetter } from '../../util/extension.js';

const isAbcd = (char) => {
  return isLetter(char) || char === '-' || char === ',';
};

/** @param {string} str */
const getFirstWordIndex = (str) => {
  let firstAbcdIndex = null;
  for (let i = 0; i < str.length; i++) {
    const currChar = str[i];
    const nextChar = str[i + 1] || null;
    if (isAbcd(currChar) && (nextChar == null || isAbcd(nextChar))) {
      firstAbcdIndex = i;
      break;
    }
  }
  return firstAbcdIndex;
};

const isCommaInNumber = (prevChar, currChar, nextChar) => {
  return isNum(prevChar) && currChar === ',' && isNum(nextChar);
};

/** @param {string} value */
const removeUnnecessaryChars = (value) => {
  const str = value.trim();
  let startChar = 0;
  let endChar = str.length;
  for (const [i, element] of str.entries()) {
    if (isNum(element)) {
      startChar = i;
      break;
    }
  }
  for (let i = str.length - 1; i >= 0; i--) {
    const prevChar = str[i + 1] || null;
    const currChar = str[i];
    const nextChar = str[i - 1] || null;
    if (
      (isAbcd(currChar) || currChar === ' ') &&
      isNum(nextChar) &&
      !isCommaInNumber(prevChar, currChar, nextChar)
    ) {
      endChar = i;
      break;
    }
  }
  // eslint-disable-next-line unicorn/prefer-string-slice
  return str.substring(startChar, endChar);
};

/**
 * Retornar uma palavra seguida de um numero
 * @example
 * // returns 116
 * retrieve('BR', 'BR 116 - km 134+400 - Fazenda Rio Grande')
 * @param {string} word
 * @param {string} sentence
 */
const retrieve = (word, sentence) => {
  const sentenceWithoutWordIndex =
    sentence.toUpperCase().indexOf(word.toUpperCase()) + word.length;
  const sentenceWithoutWord = sentence
    .slice(Math.max(0, sentenceWithoutWordIndex))
    .trim();
  const firstWordInSentenceStartingInWordIndex =
    getFirstWordIndex(sentenceWithoutWord);
  if (!firstWordInSentenceStartingInWordIndex)
    return removeUnnecessaryChars(sentenceWithoutWord);
  // eslint-disable-next-line unicorn/prefer-string-slice
  const number = sentence.substring(
    sentenceWithoutWordIndex,
    sentenceWithoutWordIndex + firstWordInSentenceStartingInWordIndex
  );
  return removeUnnecessaryChars(number);
};

export default retrieve;
