const Game = {
  tetrominoFactories: [
    Tetromino.I,
    Tetromino.J,
    Tetromino.L,
    Tetromino.O,
    Tetromino.S,
  ],

  next: (ni, nj) => (state=null, update={}) => {
    if (state==null) {
      let newPiece = Game.getRandomPiece(0,0)
      let newStack = utils.mkFill(ni, nj, null)
      return {
        gravity: false,
        current: newPiece,
        ghost: Game.getGhost(newPiece, newStack),
        stack: newStack,
      }
    } else if (state.gravity) {
      Game.processGravity(state.stack)
      state.gravity = false
      state.current = Game.getRandomPiece(0,0)
      state.ghost = Game.getGhost(state.current, state.stack)
      return state
    } else {
      let nextPiece = state.current.next()
      if (!nextPiece.isValid(state.stack)) {
        Game.addPiece(state.current, state.stack)
        Game.clearLines(state.stack)
        state.gravity = true
        state.current = null
        state.ghost = null
      } else state.current = nextPiece
      
      return state
    }
  },

  updateCurrent: (piece, state) => {
    state.current = piece
    state.ghost = piece != null ? Game.getGhost(state.current, state.stack) : null
  },

  addPiece: (piece, stack) => piece.get().forEach(node => stack[node.j][node.i] = node.color),

  clearLines: stack => {
    for(let j=stack.length-1; j>=0; j--) {
      let nFilled = Game.countFilled(stack[j])
      if (nFilled == 0) break
      else if (nFilled == stack[0].length) stack[j].forEach((_, i) => stack[j][i] = null)
    }
  },

  processGravity: stack => {
    let nEmpty = 0
    for(let j=stack.length-1; j>=0; j--) {
      let nFilled = Game.countFilled(stack[j])
      if (nFilled==0) nEmpty += 1
      else if (nFilled>0 && nEmpty>0) {
        stack[j].forEach((v,i) => {
          stack[j+nEmpty][i] = v
          stack[j][i] = null
        })
      }
    }
  },

  countFilled: row => row.reduce((acc, v) => v!=null ? acc+1 : acc, 0),

  getGhost: (piece, stack) => {
    for(let j = stack.length-1; j>=0; j--) {
      if (stack[j][piece.i] == null) {
        let p = piece.cons(piece.i, j, piece.rot)
        if (p.isValid(stack)) return p
      }
    }
  },

  getRandomPiece: (i, j) => {
    let cons = Game.tetrominoFactories[utils.randInt(0, Game.tetrominoFactories.length-1)]
    return cons(i, j)
  },
}