/**
 * @param {number[]} arr
 * @param {number} target
 */
function findClosestNumber(arr, target) {
  return arr.reduce((prev, curr) => {
    return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
  });
}

export default findClosestNumber;
