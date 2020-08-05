const Game = {
  tetrominoFactories: [
    Tetromino.I,
    Tetromino.J,
    Tetromino.L,
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
      let isInvalid = !newPiece.isValid(state.ni, state.nj, state.stack)
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

  getRandomTetromino: (i, j) => {
    let cons = Game.tetrominoFactories[utils.randInt(0, Game.tetrominoFactories.length-1)]
    return cons(i, j)
  }
}