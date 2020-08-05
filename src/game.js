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
        stack: utils.mkFill(ni, nj, null),
      }
    } else {
      let newPiece = state.current.next()
      let willLock = !newPiece.isValid(state.ni, state.nj, state.stack)
      if (willLock) {
        Game.addPiece(state.current, state.stack)
        Game.clearLines(state.stack)
        Game.processGravity(state.stack)
      }
      return {
        ni: state.ni,
        nj: state.nj,
        current: willLock ? Game.getRandomPiece(0,0) : newPiece,
        stack: state.stack,
      }
    }
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

  getRandomPiece: (i, j) => {
    let cons = Game.tetrominoFactories[utils.randInt(0, Game.tetrominoFactories.length-1)]
    return cons(i, j)
  },
}