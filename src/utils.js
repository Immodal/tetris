const utils = {
  /**
   * Returns a random integer between min and max (inclusive)
   */
  randInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  /**
   * Returns a 2D array with nj rows and ni cols filled with v
   */
  mkFill: (ni, nj, v) => Array.from(Array(nj), _ => Array.from(Array(ni), _ => v)),

  /**
   * Shuffles array in place
   */
  shuffle: arr => {
    let j, x;
    for (let i = arr.length - 1; i > 0; i--) {
      j = utils.randInt(0, i)
      x = arr[i]
      arr[i] = arr[j]
      arr[j] = x
    }
  }
}