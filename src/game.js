const Game = {
  tetrominoFactories: [
    Tetromino.I,
    Tetromino.J,
  ],

  next: (ni, nj) => (state=null, update={}) => {
    if (state==null) {
      return {
        ni: ni,
        nj: nj,
        current: Tetromino.I(0,0),
        stack: NodeSet(),
      }
    } else {
      let newPiece = state.current.next()
      let isInvalid = !Game.isValid(state.ni, state.nj, newPiece.get(), state.stack)
      let newStack = state.stack.copy()
      if (isInvalid) newStack.addAll(state.current.get())
      return {
        ni: state.ni,
        nj: state.nj,
        current: isInvalid ? Game.getRandomTetromino(0,0) : newPiece,
        stack: newStack,
      }
    }
  },

  leftShift: (ni, nj, piece, stack) => {
    let p = piece.left()
    return Game.isValid(ni, nj, p.get(), stack) ? p : piece
  },

  rightShift: (ni, nj, piece, stack) => {
    let p = piece.right()
    return Game.isValid(ni, nj, p.get(), stack) ? p : piece
  },

  isValid: (ni, nj, nodes, stack) => Game.isInBounds(ni, nj, nodes) && !Game.isCollided(nodes, stack),

  isInBounds: (ni, nj, nodes) => nodes.every(node => node.inBounds(ni, nj)),

  isCollided: (nodes, stack) => nodes.some(node => stack.has(node)),

  getRandomTetromino: (i, j) => {
    let cons = Game.tetrominoFactories[utils.randInt(0, Game.tetrominoFactories.length-1)]
    return cons(i, j)
  }
}