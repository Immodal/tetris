const Scoring = {
  Weights: (nHolesConst=0, nHolesMult=0, 
            nBlockedConst=0, nBlockMult=0, 
            nTallEmptyColsConst=0, nTallEmptyColsMult=0,
            halfHeightRowMult=0, threeQuarterHeightRowMult=0) => {
    const weights = {}

    weights.values = []

    weights.values.push(nHolesConst)
    weights.nHolesConst = () => weights.values[0]
    weights.values.push(nHolesMult)
    weights.nHolesMult = () => weights.values[1]

    weights.values.push(nBlockedConst)
    weights.nBlockedConst = () => weights.values[2]
    weights.values.push(nBlockMult)
    weights.nBlockMult = () => weights.values[3]

    weights.values.push(nTallEmptyColsConst)
    weights.nTallEmptyColsConst = () => weights.values[4]
    weights.values.push(nTallEmptyColsMult)
    weights.nTallEmptyColsMult = () => weights.values[5]

    weights.values.push(halfHeightRowMult)
    weights.halfHeightRowMult = () => weights.values[6]

    weights.values.push(threeQuarterHeightRowMult)
    weights.threeQuarterHeightRowMult = () => weights.values[7]

    return weights
  },

  getRandomWeights: (rng=new Math.seedrandom()) => {
    return Scoring.Weights(
      utils.randFloat(0, 10), rng()>0.5 ? rng() : utils.randFloat(0, 10, rng),
      utils.randFloat(0, 10), rng()>0.5 ? rng() : utils.randFloat(0, 10, rng),
      utils.randFloat(0, 10), rng()>0.5 ? rng() : utils.randFloat(0, 10, rng),
      rng()>0.5 ? rng() : utils.randFloat(0, 10, rng),
      rng()>0.5 ? rng() : utils.randFloat(0, 10, rng),
    )
  },

  score: (piece, stack, weights) => {
    Game.addPiece(piece, stack)
    let emptySet = Scoring.getEmptyPostions(Game.SPAWN_LOC[0], Game.SPAWN_LOC[1], stack)
    let stackHeight = 0
    let nHoles = 0
    let nBlocked = 0
    let nTallEmptyColumns = 0
    let nFilledRows = 0

    for(let j=stack.length-1; j>=0; j--) {
      let nFilled = 0
      for(let i=stack[j].length-1; i>=0; i--) {
        // nFilled
        if (stack[j][i]!=null) nFilled += 1
        // Holes
        else if (stack[j][i]==null && !emptySet.has(i, j)) nHoles += 1
        // Blocked & tallEmptyColumns
        else if (stack[j][i]==null) {
          let res = Scoring.checkColumn(i, j, stack)
          if (res[0]) nBlocked += 1
          if (res[1]) nTallEmptyColumns += 1
        }
      }
      // Early Exit
      if (nFilled == 0) break
      // Track rows that will be removed
      else if (nFilled == stack[j].length) nFilledRows += 1
      // Track height
      stackHeight += 1
    }
    Game.removePiece(piece, stack)

    let score = 0
    score += Math.max(0, (nHoles + weights.nHolesConst())*weights.nHolesMult())
    score += Math.max(0, (nBlocked + weights.nBlockedConst())*weights.nBlockMult())
    score += Math.max(0, (nTallEmptyColumns + weights.nTallEmptyColsConst())*weights.nTallEmptyColsMult())

    let halfHeightPenalty = Math.max(0, stackHeight - Math.floor(stack.length/2) - nFilledRows)*weights.halfHeightRowMult()
    let threeQuarterHeightPenalty = Math.max(0, stackHeight - Math.floor(3*stack.length/4) - nFilledRows)*weights.threeQuarterHeightRowMult()
    score += stackHeight - nFilledRows + halfHeightPenalty + threeQuarterHeightPenalty

    return score
  },

  /**
   * Checks if the cell [i,j] in the stack has blocked line of sight to the top of the play field and
   * Also checks if it is part of what is considered a tall empty column.
   * @param {int} i Column index to start counting from
   * @param {int} j Row index to start counting from, non inclusive
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  checkColumn: (i, j, stack) => {
    let isBlocked = false
    let tallEmptyColumnSize = 0
    for(let j2=j-1; j2>=0; j2--) {
      if(stack[j2][i]!=null) {
        isBlocked = true
        break
      }
      if((i==0 || stack[j2][i-1]!=null) && (i==stack[j2].length-1 || stack[j2][i+1]!=null)) {
        tallEmptyColumnSize += 1
      }
    }
    return [isBlocked, tallEmptyColumnSize>=3]
  },

  /**
   * A Set that encodes coordinates to String for quick comparisons.
   */
  PosSet: () => {
    const cs = {}

    cs.set = new Set()
    cs.encIJ = (i, j) => `${i},${j}`
    cs.add = (i, j) => cs.set.add(cs.encIJ(i,j))
    cs.has = (i, j) => cs.set.has(cs.encIJ(i,j))

    return cs
  },

  /**
   * Returns a PosSet of all cells in stack accessible from [i,j] via BFS.
   * @param {int} i Column index to start searching from
   * @param {int} j Row index to start searching from
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  getEmptyPostions: (i, j, stack) => {
    const origin = Tetromino.Node(i, j)
    const open = [[null, origin]]
    const closed = Scoring.PosSet()
    const directions = [Tetromino.Node(0,-1), Tetromino.Node(0,1), Tetromino.Node(1,0), Tetromino.Node(-1,0)]

    let current = null
    while (open.length>0) {
      current = open.shift()
      directions.map(d => current[1].sum(d))
        .filter(n => n.inBounds(stack[0].length, stack.length) && 
          !closed.has(n.i, n.j) && 
          stack[n.j][n.i]==null
        )
        .forEach(n => {
          open.push([current, n])
          closed.add(n.i, n.j)
        })
    }

    return closed
  },

  /**
   * Returns an array of candidate endpoints based on the given piece and stack
   * @param {Tetromino} piece The piece to add to the stack
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  getEndPoints: (piece, stack) => {
    let endPoints = []
    for(let r=0; r<piece.rotations.length; r++) {
      // -2 to account for inconsistent column spacing in base Tetrominoes
      for(let i=-2; i<stack[0].length; i++) { 
        let p = piece.cons(i, 0, r)
        let ghost = Game.getGhost(p, stack)
        if (ghost != null) endPoints.push(ghost)
      }
    }
    return endPoints
  },

  /**
   * Returns an array where index 0 is the top score and index 1 is the top scoring endpoint.
   * @param {Array} endPoints Array of candidate endpoints to be added to stack and scored
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  getBestEndpoint: (endPoints, stack, weights) => {
    let minScore = 99999
    let minPiece = null 
    for (let i=0; i<endPoints.length; i++) {
      let currentScore = Scoring.score(endPoints[i], stack, weights)
      if (minPiece==null || currentScore<minScore) {
        minScore = currentScore
        minPiece = endPoints[i]
      }
    }
    return [minScore, minPiece]
  },
}