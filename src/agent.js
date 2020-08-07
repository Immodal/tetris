const Agent = {
  getMove: state => {
    let endPoints = Agent.getEndPoints(state.current, state.stack)
    let altEndpoints = null
    if (state.hold==null) altEndpoints = Agent.getEndPoints(state.nextPieces[0], state.stack)
    else altEndpoints = Agent.getEndPoints(state.hold, state.stack)

    let minScore = 1
    let minPiece = null 
    for (let i=0; i<endPoints.length; i++) {
      let currentScore = Agent.scoreStack(endPoints[i], state.stack)
      if (minPiece==null || currentScore<minScore) {
        minScore = currentScore
        minPiece = endPoints[i]
      }
    }

    let isAlt = false
    for (let i=0; i<altEndpoints.length; i++) {
      let currentScore = Agent.scoreStack(altEndpoints[i], state.stack)
      if (minPiece==null || currentScore<minScore) {
        minScore = currentScore
        minPiece = altEndpoints[i]
        isAlt = true
      }
    }

    if (isAlt) {
      Game.holdPiece(state)
    }

    return minPiece
  },

  getEndPoints: (piece, stack) => {
    let endPoints = []
    for(let r=0; r<piece.rotations.length; r++) {
      for(let i=-2; i<stack[0].length; i++) {
        let p = piece.cons(i, 0, r)
        let ghost = Game.getGhost(p, stack)
        //if (p.isValid(stack)) 
        if (ghost != null) endPoints.push(ghost)
      }
    }
    return endPoints
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
    const closed = Agent.PosSet()
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
  
  scoreStack: (piece, stack) => {
    Game.addPiece(piece, stack)
    let emptySet = Agent.getEmptyPostions(Game.SPAWN_LOC[0], Game.SPAWN_LOC[1], stack)
    let stackHeight = 0
    let nHoles = 0
    let nBlocked = 0
    let nFilledRows = 0
    for(let j=stack.length-1; j>=0; j--) {
      let nFilled = 0
      for(let i=stack[j].length-1; i>=0; i--) {
        // Holes
        if (stack[j][i]==null && !emptySet.has(i, j)) nHoles += 1
        // Blocked
        else if (stack[j][i]==null) {
          for(let j2=j-1; j2>=0; j2--) {
            if(stack[j2][i]!=null) {
              nBlocked += 1
            }
          }
        }
        // Filled
        else if (stack[j][i]!=null) nFilled += 1
      }
      if (nFilled == 0) break
      else if (nFilled == stack[j].length) nFilledRows += 1
      stackHeight += 1
    }
    Game.removePiece(piece, stack)
    return 2*nHoles + stackHeight + 2*nBlocked - nFilledRows
  },


}