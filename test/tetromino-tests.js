const TetrominoTests = {
  "I piece": () => {
    TetrominoTestsUtils.checkPiece(Tetromino.I)
  },

  "J piece": () => {
    TetrominoTestsUtils.checkPiece(Tetromino.J)
  },

  "L piece": () => {
    TetrominoTestsUtils.checkPiece(Tetromino.L)
  },

  "O piece": () => {
    TetrominoTestsUtils.checkPiece(Tetromino.O)
  },

  "S piece": () => {
    TetrominoTestsUtils.checkPiece(Tetromino.O)
  },
}

const TetrominoTestsUtils = {
  checkPiece: cons => {
    let ni = 10
    let nj = 20
    let stack = utils.mkFill(ni, nj, null)
    let piece = cons(5, 5)
    eq(cons, piece.cons)
    eq(true, piece.color !== undefined)
    eq(true, Array.isArray(piece.rotations))
    eq(true, piece.get()
      .every(
        (node, i) => 
          node.i-piece.i==piece.rotations[piece.rot][i][0] && 
          node.j-piece.j==piece.rotations[piece.rot][i][1]))

    // All should be valid
    TetrominoTestsUtils.comparePieces(piece, piece.next(), 0, 1, 0)
    eq(true, piece.next().isValid(ni, nj, stack))
    TetrominoTestsUtils.comparePieces(piece, piece.left(ni, nj, stack), -1, 0, 0)
    TetrominoTestsUtils.comparePieces(piece, piece.right(ni, nj, stack), 1, 0, 0)
    TetrominoTestsUtils.comparePieces(piece, piece.cw(ni, nj, stack), 0, 0, 1)

    // next() will not be valid
    piece = cons(5, nj-2)
    TetrominoTestsUtils.comparePieces(piece, piece.next(), 0, 1, 0)
    eq(false, piece.next().isValid(ni, nj, stack))
    TetrominoTestsUtils.comparePieces(piece, piece.left(ni, nj, stack), -1, 0, 0)
    TetrominoTestsUtils.comparePieces(piece, piece.right(ni, nj, stack), 1, 0, 0)
    TetrominoTestsUtils.comparePieces(piece, piece.cw(ni, nj, stack), null, null, 
                                      cons==Tetromino.I ? 0 : 1)

    // left() will have no effect
    piece = cons(cons==Tetromino.O ? -1 : 0, 0)
    TetrominoTestsUtils.comparePieces(piece, piece.next(), 0, 1, 0)
    eq(true, piece.next().isValid(ni, nj, stack))
    TetrominoTestsUtils.comparePieces(piece, piece.left(ni, nj, stack), 0, 0, 0)
    TetrominoTestsUtils.comparePieces(piece, piece.right(ni, nj, stack), 1, 0, 0)
    TetrominoTestsUtils.comparePieces(piece, piece.cw(ni, nj, stack), 0, 0, 1)

    // right() will have no effect
    piece = cons(ni-(cons==Tetromino.I? 4 : 3), 0)
    TetrominoTestsUtils.comparePieces(piece, piece.next(), 0, 1, 0)
    eq(true, piece.next().isValid(ni, nj, stack))
    TetrominoTestsUtils.comparePieces(piece, piece.left(ni, nj, stack), -1, 0, 0)
    TetrominoTestsUtils.comparePieces(piece, piece.right(ni, nj, stack), 0, 0, 0)
    TetrominoTestsUtils.comparePieces(piece, piece.cw(ni, nj, stack), 0, 0, 1)
  },
  
  comparePieces: (p1, p2, iDiff, jDiff, rotDiff) => {
    if (iDiff!=null) eq(iDiff, p2.i - p1.i)
    if (jDiff!=null) eq(jDiff, p2.j - p1.j)
    if (rotDiff!=null) eq(rotDiff, p2.rot - p1.rot)
  },
}
