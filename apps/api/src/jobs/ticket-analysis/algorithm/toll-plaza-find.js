import SplitKM from '../split-km.js';
import findByClosestWord from './find-by-closest-word.js';
import findClosestKMIndex from './find-closest-km.js';
import { kmRetrieve } from './km.js';
import roadCodeRetrieve from './road-code-retriever.js';

/**
 * @typedef {Object} TollPlaza
 * @property {string} fullRoadName
 * @property {string} km
 * @property {number} value
 * @property {string} highway
 */

const DifferenceWithLowProbabilityRate = 2;

/**
 * @param {string} ticketHighway
 * @param {TollPlaza[]} tollPlazaList
 */
const findByClosestKM = (ticketHighway, tollPlazaList) => {
  const km = kmRetrieve(ticketHighway);
  const tollPlazaItemIndex = findClosestKMIndex(
    km,
    tollPlazaList.map((i) => i.km)
  );
  const tollPlazaItem = tollPlazaList[tollPlazaItemIndex];
  if (!tollPlazaItem) {
    throw new Error(
      `Praça não encontrada para o indice ${tollPlazaItemIndex} [${ticketHighway}]`
    );
  }

  let hasLowProbabilityRate = false;
  const differenceBetweenKmTargetAndKmResult =
    SplitKM.valueOf(km).toNumber() -
    SplitKM.valueOf(tollPlazaItem.km).toNumber();
  if (
    differenceBetweenKmTargetAndKmResult >= DifferenceWithLowProbabilityRate
  ) {
    hasLowProbabilityRate = true;
  }

  return { tollPlaza: tollPlazaItem, hasLowProbabilityRate };
};

/**
 *
 * @param {string} fullRoadName
 * @param {TollPlaza[]} tollPlazaList
 */
const find = (fullRoadName, tollPlazaList) => {
  try {
    const roadCodeTarget = roadCodeRetrieve(fullRoadName);
    const tollPlazaListFilteredByHighway = tollPlazaList.filter(
      (tollPlaza) =>
        roadCodeRetrieve(tollPlaza.highway)?.isSame(roadCodeTarget) || false
    );
    return findByClosestKM(fullRoadName, tollPlazaListFilteredByHighway);
  } catch {
    try {
      return findByClosestKM(fullRoadName, tollPlazaList);
    } catch {
      return findByClosestWord(fullRoadName, tollPlazaList);
    }
  }
};

export default find;
