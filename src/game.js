const Game = {
  tetrominoFactories: [
    Tetromino.I,
    Tetromino.J,
  ],

  next: (ni, nj) => (state=null, update=null) => {
    if (state==null) {
      return {
        ni: ni,
        nj: nj,
        current: Tetromino.I(0,0),
        pile: NodeSet(),
      }
    } else {
      let newPiece = state.current.next()
      let willLock = Game.willLock(state.ni, state.nj, newPiece, state.pile)
      let newPile = state.pile.copy()
      if (willLock) newPile.addAll(state.current.get())
      return {
        ni: state.ni,
        nj: state.nj,
        current: willLock ? Game.getRandomTetromino(0,0) : newPiece,
        pile: newPile,
      }
    }
  },

  willLock: (ni, nj, piece, pile) => {
    let nodes = piece.get()
    return nodes.some(node => !node.inBounds(ni, nj)) || nodes.some(node => pile.has(node))
  },

  getRandomTetromino: (i, j) => {
    let cons = Game.tetrominoFactories[utils.randInt(0, Game.tetrominoFactories.length-1)]
    return cons(i, j)
  }
}