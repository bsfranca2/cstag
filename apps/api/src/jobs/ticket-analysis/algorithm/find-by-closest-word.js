import stringSimilarity from 'string-similarity';

const normalize = (str) => str.normalize('NFD').replace(/[\u0300-\u036F]/g, '');

export default (fullRoadName, tollPlazaList) => {
  const target = normalize(fullRoadName).toLowerCase();
  const list = tollPlazaList.map((i) =>
    normalize(i.fullRoadName).toLowerCase()
  );

  const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(
    target,
    list
  );
  const hasLowProbabilityRate = bestMatch.rating >= 0.4;

  return { tollPlaza: tollPlazaList[bestMatchIndex], hasLowProbabilityRate };
};
