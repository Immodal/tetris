const TetrominoTests = {
  "I piece": () => {
    let piece = Tetromino.I(3, 4)
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
  comparePieces(piece, piece.next(), 0, 1, 0)
  comparePieces(piece, piece.left(), -1, 0, 0)
  comparePieces(piece, piece.right(), 1, 0, 0)
  comparePieces(piece, piece.rotate(), 0, 0, piece.rot==piece.rotations.length-1 ? -piece.rot : 1)
}

const comparePieces = (p1, p2, iDiff, jDiff, rotDiff) => {
  eq(iDiff, p2.i - p1.i)
  eq(jDiff, p2.j - p1.j)
  eq(rotDiff, p2.rot - p1.rot)
}