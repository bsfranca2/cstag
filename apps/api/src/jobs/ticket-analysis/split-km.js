import { KMNotFoundException } from './exceptions.js';

export default class SplitKM {
  /**
   * @param {number[]} parts
   * @param {string?} operator
   * @param {string} source
   */
  constructor(parts, operator, source) {
    this.parts = parts;
    this.operator = operator;
    this.source = source;
  }

  /** @param {string} km */
  static valueOf(km) {
    let splitOperator = null;
    if (km.includes('+')) {
      splitOperator = '+';
    } else if (km.includes('.')) {
      splitOperator = '.';
    } else if (km.includes(',')) {
      splitOperator = ',';
    }
    const kmParts =
      splitOperator === null
        ? [Number(km.trim())]
        : km.split(splitOperator).map((i) => Number(i.trim()));

    if (Number.isNaN(kmParts[0])) {
      throw new KMNotFoundException(`Error ao criar KMSplit ${km}`);
    }

    return new SplitKM(kmParts, splitOperator, km);
  }

  toNumber() {
    return Number(this.parts.join('.'));
  }
}
