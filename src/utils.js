const utils = {
  /**
   * Returns a random integer between min and max (inclusive)
   */
  randInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  /**
   * Returns a 2D array with nj rows and ni cols filled with v
   */
  mkFill: (ni, nj, v) => Array.from(Array(nj), _ => Array.from(Array(ni), _ => v)),
}