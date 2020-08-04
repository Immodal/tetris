const Game = {
  next: (ni, nj) => (state=null, update=null) => {
    if (state==null) {
      return {
        ni: ni,
        nj: nj,
        current: Tetromino.I(0,0),
      }
    } else {
      let newPiece = state.current.next()
      console.log(newPiece)
      return {
        ni: state.ni,
        nj: state.nj,
        current: Game.willLock(state.ni, state.nj, newPiece) ? Tetromino.I(0,0) : newPiece
      }
    }
  },

  willLock: (ni, nj, piece) => piece.get().some(node => !node.inBounds(ni, nj))
}