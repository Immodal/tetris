
const Tetromino = {
  /**
   * Abstract Piece factory method for a Tetromino piece.
   * Child classes are expected to define the following attributes:
   * 1. piece.cons - Reference to constructor for child class
   * 2. piece.color - Hex color string such as "#00FFFF"
   * 3. piece.rotations - Array of arrays, one array for each rotation state for the Tetromino piece.
   *      Each array contains unit coordinates of solid nodes for that state.
   *      These coordinates are based on the piece occupying a 2D matrix of set size.
   *      See: https://tetris.fandom.com/wiki/SRS
   */
  AbstractPiece: (i, j, rot=0) => {
    const piece = {}
    piece.i = i
    piece.j = j
    piece.rot = rot 

    /**
     * Returns this piece as an array of Nodes.
     */
    piece.get = () => {
      return piece
        .rotations[rot]
        .map(([i,j]) => Node(i+piece.i, j+piece.j, piece.color))
    }

    /**
     * Returns a new Piece with updated attributes.
     * @param {int} i Column index of the top left cell of the piece's rotation matrix
     * @param {int} j Row index of the top left cell of the piece's rotation matrix
     * @param {int} rot Rotation state of the piece
     */
    piece.next = (i=0, j=1, rot=piece.rot) => {
      const p = piece.cons(piece.i+i, piece.j+j, rot)
      return p
    }

    /**
     * Returns a new Piece shifted to the left by 1 cell.
     */
    piece.left = () => piece.next(-1, 0)

    /**
     * Returns a new Piece shifted to the right by 1 cell.
     */
    piece.right = () => piece.next(1, 0)

    /**
     * Returns a new Piece with its rotation state advanced by 1.
     */
    piece.rotate = () => piece.next(0, 0, piece.rot>=piece.rotations.length-1 ? 0 : piece.rot+1)

    return piece
  },

  /**
   * Factory Method for the I Tetromino.
   * @param {int} i Column index of the top left cell of the piece's rotation matrix
   * @param {int} j Row index of the top left cell of the piece's rotation matrix
   * @param {int} rot Rotation state of the piece
   */
  I: (i, j, rot=0) => {
    const piece = Tetromino.AbstractPiece(i, j, rot)
    piece.cons = Tetromino.I
    piece.color = "#00FFFF"
    piece.rotations = Tetromino.I_ROTATIONS

    return piece
  },

  /**
   * Rotation States for I Tetromino.
   */
  I_ROTATIONS: [
    [[0,1], [1,1], [2,1], [3,1]],
    [
      [2,0], 
      [2,1], 
      [2,2], 
      [2,3]
    ],
    [[0,2], [1,2], [2,2], [3,2]],
    [
      [1,0], 
      [1,1], 
      [1,2], 
      [1,3]
    ],
  ],

  /**
   * Factory Method for the J Tetromino.
   * @param {int} i Column index of the top left cell of the piece's rotation matrix
   * @param {int} j Row index of the top left cell of the piece's rotation matrix
   * @param {int} rot Rotation state of the piece
   */
  J: (i, j, rot=0) => {
    const piece = Tetromino.AbstractPiece(i, j, rot)
    piece.cons = Tetromino.J
    piece.color = "#0000FF"
    piece.rotations = Tetromino.J_ROTATIONS

    return piece
  },

  /**
   * Rotation States for J Tetromino.
   */
  J_ROTATIONS: [
    [
      [0,0], 
      [0,1], [1,1], [2,1]
    ],
    [
      [1,0],[2,0],
      [1,1], 
      [1,2]
    ],
    [
      [0,1], [1,1], [2,1], 
                    [2,2]
    ],
    [
            [1,0], 
            [1,1], 
      [0,2],[1,2],
    ],
  ],
}