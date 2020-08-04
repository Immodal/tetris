const TetrominoTests = {
  "I piece": () => {
    let piece = Tetromino.I(0, 0)
    checkPiece(piece, Tetromino.I)
  }
}

const checkPiece = (piece, cons) => {
  eq(cons, piece.cons)
  eq(true, piece.color !== undefined)
  eq(true, Array.isArray(piece.rotations))
  eq(true, piece.get()
    .every(
      (node, i) => 
        node.i-piece.i==piece.rotations[piece.rot][i][0] && 
        node.j-piece.j==piece.rotations[piece.rot][i][1]))
}