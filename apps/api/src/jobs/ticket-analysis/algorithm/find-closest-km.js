import SplitKM from '../split-km.js';
import findClosestNumber from './find-closest-number.js';
import { kmRetrieve } from './km.js';

/**
 * @param {SplitKM} km
 * @param {SplitKM[]} listOfKm
 * @returns {SplitKM?}
 */
const tryFindExactSecondNumber = (km, listOfKm) => {
  const secondNumber = km.parts[1] || 0;
  for (const km of listOfKm) {
    const itemSecondNumber = km.parts[1] || 0;
    if (
      itemSecondNumber === secondNumber ||
      itemSecondNumber === Number(`${secondNumber}0`) ||
      itemSecondNumber === Number(`${secondNumber}00`)
    )
      return km;
  }
  return null;
};

/**
 * @param {string} kmTarget
 * @param {string[]} kmList
 */
const findIndex = (kmTarget, kmList) => {
  if (kmList.includes(kmTarget)) {
    return kmList.indexOf(kmTarget);
  }

  const kmTargetSplit = SplitKM.valueOf(kmTarget);
  const listOfKMSplit = kmList.map((i) =>
    i.toLowerCase().includes('km')
      ? SplitKM.valueOf(kmRetrieve(i))
      : SplitKM.valueOf(i)
  );

  const firstPartClosestNumber = findClosestNumber(
    listOfKMSplit.map((i) => i.parts[0]),
    kmTargetSplit.parts[0]
  );
  const listFilteredWithFirstPartClosestNumber = listOfKMSplit.filter(
    (i) => i.parts[0] === firstPartClosestNumber
  );
  if (listFilteredWithFirstPartClosestNumber.length === 1) {
    return kmList.indexOf(listFilteredWithFirstPartClosestNumber[0].source);
  }

  const secondPartOfKmNumber = kmTargetSplit.parts[1] || null;
  if (secondPartOfKmNumber == null) {
    const result = listFilteredWithFirstPartClosestNumber.find(
      (i) => i.parts.length === 1
    );
    if (!result) {
      const firstItemFromListFiltered =
        listFilteredWithFirstPartClosestNumber[0];
      return kmList.indexOf(firstItemFromListFiltered.source);
    }
    return kmList.indexOf(result.source);
  }

  const resultFromSecondNumber = tryFindExactSecondNumber(
    kmTargetSplit,
    listFilteredWithFirstPartClosestNumber
  );
  if (resultFromSecondNumber)
    return kmList.indexOf(resultFromSecondNumber.source);

  const secondPartOfKmNumberClosest = findClosestNumber(
    listFilteredWithFirstPartClosestNumber.map((i) => i.parts[1] || 0),
    secondPartOfKmNumber
  );
  const result = listFilteredWithFirstPartClosestNumber.find((i) => {
    return (
      (i.parts[0] === firstPartClosestNumber && i.parts[1]) ||
      secondPartOfKmNumberClosest === 0
    );
  });
  if (!result) {
    throw new Error('Result not found');
  }
  return kmList.indexOf(result.source);
};

export default findIndex;
