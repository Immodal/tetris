const Scoring = {
  score: (piece, stack) => {
    Game.addPiece(piece, stack)
    let emptySet = Scoring.getEmptyPostions(Game.SPAWN_LOC[0], Game.SPAWN_LOC[1], stack)
    let stackHeight = 0
    let nHoles = 0
    let nBlocked = 0
    let tallColumns = new Map()
    let nFilledRows = 0

    for(let j=stack.length-1; j>=0; j--) {
      let nFilled = 0
      for(let i=stack[j].length-1; i>=0; i--) {
        // Holes
        if (stack[j][i]==null && !emptySet.has(i, j)) nHoles += 1
        // Blocked
        else if (stack[j][i]==null) {
          let blocked = Scoring.countBlocked(i, j, stack)
          nBlocked += blocked
          if (blocked>0) tallColumns.set(j, tallColumns.has(j) ? tallColumns.get(j)+1 : 1)
        }
        // Filled
        else if (stack[j][i]!=null) nFilled += 1
      }
      if (nFilled == 0) break
      else if (nFilled == stack[j].length) nFilledRows += 1
      stackHeight += 1
    }

    let nTallColumns = 0
    tallColumns.forEach(v => {
      if (v>=3) nTallColumns += 1
    })
    nTallColumns = nTallColumns>1

    tallStackPenalty2 = Math.max(0, stackHeight - Math.floor(stack.length/2) - nFilledRows)
    tallStackPenalty2 = Math.max(0, stackHeight - Math.floor(stack.length/2) - nFilledRows)

    Game.removePiece(piece, stack)
    return 2*nHoles + 2*nBlocked + Math.max(0, (nTallColumns-1)*10) + stackHeight + tallStackPenalty2*10 - nFilledRows
  },

  countBlocked: (i, j, stack) => {
    let nBlocked = 0
    for(let j2=j-1; j2>=0; j2--) {
      if(stack[j2][i]!=null) {
        nBlocked += 1
      }
    }
    return nBlocked
  },

  PosSet: () => {
    const cs = {}

    cs.set = new Set()
    cs.encIJ = (i, j) => `${i},${j}`
    cs.add = (i, j) => cs.set.add(cs.encIJ(i,j))
    cs.has = (i, j) => cs.set.has(cs.encIJ(i,j))

    return cs
  },

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

  getEndPoints: (piece, stack) => {
    let endPoints = []
    for(let r=0; r<piece.rotations.length; r++) {
      for(let i=-2; i<stack[0].length; i++) {
        let p = piece.cons(i, 0, r)
        let ghost = Game.getGhost(p, stack)
        if (ghost != null) endPoints.push(ghost)
      }
    }
    return endPoints
  },

  getBestEndpoint: (endPoints, stack) => {
    let minScore = 99999
    let minPiece = null 
    for (let i=0; i<endPoints.length; i++) {
      let currentScore = Scoring.score(endPoints[i], stack)
      if (minPiece==null || currentScore<minScore) {
        minScore = currentScore
        minPiece = endPoints[i]
      }
    }
    return [minScore, minPiece]
  },
}