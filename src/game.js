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
      if (isInvalid) {
        newStack.addAll(state.current.get())
        Game.clearRows(state.ni, state.nj, newStack)
      }
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
  },

  clearRows: (ni, nj, stack) => {
    let linesCleared = 0
    for(let j=nj-1; j>=0; j--) {
      let nodes = NodeSet()
      for(let i=ni-1; i>=0; i--) {
        if(stack.hasPos(i, j)) {
          nodes.add(stack.get(i,j))
        }
      }
      if(nodes.size()==ni) {
        nodes.lookup.forEach(node => stack.delete(node))
        linesCleared += 1
      } else if(nodes.size()>0 && linesCleared>0) {
        nodes.lookup.forEach(node => stack.autoReplace(node.i, node.j, node.i, node.j+linesCleared))
      }
    }
  }
}