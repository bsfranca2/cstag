export default class RoadCode {
  /**
   * @param {string} acronym
   * @param {string} number
   * @param {string} source
   */
  constructor(acronym, number, source) {
    this.acronym = acronym;
    this.number = number;
    this.source = source;
  }

  /**
   * @param {RoadCode} roadCode
   * @returns {boolean}
   */
  isSame(roadCode) {
    return roadCode.acronym === this.acronym && roadCode.number === this.number;
  }
}
