const Game = {
  /**
   * Array of factory methods for pieces.
   */
  tetrominoFactories: [
    Tetromino.I,
    Tetromino.J,
    Tetromino.L,
    Tetromino.O,
    Tetromino.S,
    Tetromino.T,
    Tetromino.Z,
  ],
  
  /**
   * Spawn Location of Tetrominoes in Playfield
   */
  SPAWN_LOC: [3,0],

  /**
   * Update and Return the given state in place to the next time step.
   * The state object contains the following attributes:
   * 1. current - The Tetromino currently being interacted with by the player
   * 2. stack - a 2D array that keeps track of Tetromino segments that have been locked in place.
   * 3. ghost - "state.current" shifted down to the lowest point in the stack
   * 4. gravity - Boolean where true indicates that the next update will be for computing gravity.
   *                Typically set the true after lines have been cleared.
   * 5. nextPieces - An Array of the next 3 Tetrominos that will be played.
   * @param {int} ni Number of columns in the playfield
   * @param {int} nj Number of rows in the playfield
   * @param {Object} state The state object
   */
  next: (ni, nj) => (state=null) => {
    if (state==null) {
      // Create a new state
      let newState = {
        gravity: false,
        stack: utils.mkFill(ni, nj, null),
        nextPieces: Array.from(Array(3), () => Game.getRandomPiece(Game.SPAWN_LOC[0], Game.SPAWN_LOC[1]))
      }
      // Add current and ghost
      Game.updateCurrent(Game.getRandomPiece(Game.SPAWN_LOC[0], Game.SPAWN_LOC[1]), newState)
      return newState
    } else if (state.gravity) {
      // Process Gravity
      Game.processGravity(state.stack)
      state.gravity = false
      Game.updateCurrent(Game.getNextPiece(state), state)
      return state
    } else {
      // Advance to next time step
      let nextPiece = state.current.next()
      if (!nextPiece.isValid(state.stack)) {
        // Lock piece
        Game.addPiece(state.current, state.stack)
        if (Game.clearLines(state.stack)) {
          state.gravity = true
          Game.updateCurrent(null, state)
        } else Game.updateCurrent(Game.getNextPiece(state), state)
      } else state.current = nextPiece
      
      return state
    }
  },

  /**
   * Updates the "state.current" and "state.ghost" attributes of the given state in place.
   * @param {Tetromino} piece The piece to replace "state.current" and compute "state.ghost"
   * @param {Object} state The state object
   */
  updateCurrent: (piece, state) => {
    state.current = piece
    state.ghost = piece != null ? Game.getGhost(state.current, state.stack) : null
  },

  /**
   * Returns a the next Tetromino in newPieces
   */
  getNextPiece: state => {
    state.nextPieces.push(Game.getRandomPiece(Game.SPAWN_LOC[0], Game.SPAWN_LOC[1]))
    return state.nextPieces.shift()
  },

  /**
   * Adds a piece to the given stack.
   * @param {Tetromino} piece The piece to add to the stack
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  addPiece: (piece, stack) => piece.get().forEach(node => stack[node.j][node.i] = node.color),

  /**
   * Clear all lines that have been filled in the given stack.
   * Returns true if any lines were cleared.
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  clearLines: stack => {
    let linesCleared = false
    for(let j=stack.length-1; j>=0; j--) {
      let nFilled = Game.countFilled(stack[j])
      if (nFilled == 0) break
      else if (nFilled == stack[0].length) {
        stack[j].forEach((_, i) => stack[j][i] = null)
        linesCleared = true
      }
    }
    return linesCleared
  },

  /**
   * Move rows down to fill completely empty rows.
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
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

  /**
   * Returns the count of the number of non-null cells in a given row
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  countFilled: row => row.reduce((acc, v) => v!=null ? acc+1 : acc, 0),

  /**
   * Returns piece shifted down to the lowest valid point in the given stack
   * @param {Tetromino} piece The piece to add to the stack
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  getGhost: (piece, stack) => {
    let newPiece = null
    for(let j = stack.length-1; j>=0; j--) {
      if (j<=piece.j) break
      p = piece.cons(piece.i, j, piece.rot)
      if (p.isValid(stack) && newPiece==null) newPiece = p
      else if (!p.isValid(stack)) newPiece = null
    }
    return newPiece
  },

  /**
   * Returns a random Tetromino initialized to coordinates i,j
   * @param {int} i Column index
   * @param {int} j Row index
   */
  getRandomPiece: (i, j) => {
    let cons = Game.tetrominoFactories[utils.randInt(0, Game.tetrominoFactories.length-1)]
    return cons==Tetromino.I ? cons(i, j-1) : cons(i, j)
  },
}