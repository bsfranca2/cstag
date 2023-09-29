import RoadCode from '../road-code.js';
import statesAcronym from './states-acronym.js';
import getRoadCode from './word-followed-by-number.js';

const federalAcronym = 'BR';
/**
 * @param {string} road
 * @returns {RoadCode|null}
 */
const retrieve = (road) => {
  const roadUpperCase = road.trim().toUpperCase();
  if (roadUpperCase.startsWith(federalAcronym)) {
    return new RoadCode(
      federalAcronym,
      getRoadCode(federalAcronym, roadUpperCase),
      road
    );
  }
  for (const acronym of statesAcronym) {
    if (roadUpperCase.startsWith(acronym)) {
      return new RoadCode(acronym, getRoadCode(acronym, roadUpperCase), road);
    }
  }
  // console.log(`Número da rodovia não encontrado em ${road}`)
  return null;
};

export default retrieve;
