/**
 * This is the base object used for each Tetromino
 */
const Node = (i, j, color) => {
  const node = {}

  node.i = i
  node.j = j
  node.color = color

  /**
   * Returns true if node is in game boundary given by ni, nj
   */
  node.inBounds = (ni, nj) => node.i>=0 && node.i<ni && node.j>=0 && node.j<nj

  /**
   * Returns true if node's components equal n's components
   */
  node.eq = n => node.i == n.i && node.j == n.j

  return node
}

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
   * 4. piece.cwKicks - Array of arrays, one array for each clockwise rotation state transition for the Tetromino piece.
   *      See (Wall Kicks): https://tetris.fandom.com/wiki/SRS
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
    piece.left = (ni, nj, stack) => {
      let p = piece.next(-1, 0)
      return p.isValid(ni, nj, stack) ? p : piece.next(0, 0)
    }

    /**
     * Returns a new Piece shifted to the right by 1 cell.
     */
    piece.right = (ni, nj, stack) => {
      let p = piece.next(1, 0)
      return p.isValid(ni, nj, stack) ? p : piece.next(0, 0)
    }

    /**
     * Returns a new Piece with its rotation state advanced by 1.
     */
    piece.cw = (ni, nj, stack) => {
      let rot = piece.rot>=piece.rotations.length-1 ? 0 : piece.rot+1
      let kicks = piece.cwKicks[piece.rot]
      for(let i=0; i<kicks.length; i++) {
        let p = piece.next(kicks[i][0], kicks[i][1], rot)
        if(p.isValid(ni, nj, stack)) return p
      }
      return piece.next(0, 0)
    }

    /**
     * Returns true if the piece position is valid.
     * @param {int} ni Number of columns in the playfield
     * @param {int} nj Number of rows in the playfield
     * @param {NodeSet} stack The stack containing all locked pieces
     */
    piece.isValid = (ni, nj, stack) => piece.isInBounds(ni, nj) && !piece.isCollided(stack)

    /**
     * Returns true if the piece is within the bounds of the playfield
     * @param {int} ni Number of columns in the playfield
     * @param {int} nj Number of rows in the playfield
     */
    piece.isInBounds = (ni, nj) => piece.get().every(node => node.inBounds(ni, nj))
  
    /**
     * Returns true if the piece in its current position has collided with a node in the stack.
     * @param {*} stack The stack containing all locked pieces
     */
    piece.isCollided = stack => piece.get().some(node => stack[node.j][node.i]!=null)

    return piece
  },

  CW_KICKS: [
    [[0,0], [-1,0], [-1, 1], [0,-2], [-1,-2]],
    [[0,0], [1,0], [1,-1], [0,2], [1,2]],
    [[0,0], [1,0], [1,1], [0,-2], [1,-2]],
    [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]
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
    piece.cwKicks = Tetromino.CW_KICKS

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

  /**
   * Factory Method for the L Tetromino.
   * @param {int} i Column index of the top left cell of the piece's rotation matrix
   * @param {int} j Row index of the top left cell of the piece's rotation matrix
   * @param {int} rot Rotation state of the piece
   */
  L: (i, j, rot=0) => {
    const piece = Tetromino.AbstractPiece(i, j, rot)
    piece.cons = Tetromino.L
    piece.color = "#FFA500"
    piece.rotations = Tetromino.L_ROTATIONS
    piece.cwKicks = Tetromino.CW_KICKS

    return piece
  },

  /**
   * Rotation States for L Tetromino.
   */
  L_ROTATIONS: [
    [
                    [2,0], 
      [0,1], [1,1], [2,1]
    ],
    [
      [1,0],
      [1,1], 
      [1,2], [2,2]
    ],
    [
      [0,1], [1,1], [2,1], 
      [0,2]
    ],
    [
      [0,0],[1,0], 
            [1,1], 
            [1,2],
    ],
  ],

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
    piece.cwKicks = Tetromino.I_CW_KICKS

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
   * 
   */
  I_CW_KICKS: [
    [[0,0], [-2,0], [1,0], [-2,-1], [1,2]],
    [[0,0], [-1,0], [2,0], [-1,2], [2,-1]],
    [[0,0], [2,0], [-1,0], [2,1], [-1,-2]],
    [[0,0], [1,0], [-2,0], [1,-2], [-2,1]],
  ],

}