
/**
 * Game logic following as closely to the Tetris Guidelines as is convenient.
 * https://tetris.fandom.com/wiki/Tetris_Guideline
 */
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
   * Spawn Location of Tetrominoes in Playfield.
   */
  SPAWN_LOC: [3,0],

  /**
   * Number of Tetrominoes to show in preview.
   */
  PREVIEW_LIMIT: 3,

  /**
   * Update and Return the given state in place to the next time step.
   * @param {Object} state The state object
   */
  next: (state, auto=true) => {
    if (state.gravity) {
      // Process Gravity
      Game.processGravity(state.stack)
      state.gravity = false
      Game.updateCurrent(Game.getNextPiece(state), state)
    } else {
      // Advance to next time step
      let nextPiece = state.current.next()
      if (!nextPiece.isValid(state.stack)) {
        // Lock piece
        Game.addPiece(state.current, state.stack)
        state.justHeld = false
        let nLinesCleared = Game.clearLines(state.stack)
        if (nLinesCleared>0) {
          // If lines were cleared, use next update for gravity computation
          state.gravity = true
          state.score += nLinesCleared
          Game.updateCurrent(null, state)
        } else {
          // If not, get new piece
          let p = Game.getNextPiece(state)
          if (!p.isValid(state.stack)) {
            state.gameOver = true
            Game.updateCurrent(p, state)
          } else Game.updateCurrent(p, state)
        }
      } else if(auto) state.current = nextPiece
    }
    return state
  },

  /**
   * Returns a brand new state object.
   * The state object contains the following attributes:
   * 1. current - The Tetromino currently being interacted with by the player
   * 2. stack - a 2D array that keeps track of Tetromino segments that have been locked in place.
   * 3. ghost - "state.current" shifted down to the lowest point in the stack
   * 4. gravity - Boolean where true indicates that the next update will be for computing gravity.
   *                Typically set the true after lines have been cleared.
   * 5. nextPieces - An Array of the next 3 Tetrominos that will be played.
   * 6. hold - Piece that is being temporarily held.
   * 7. gameOver - Boolean where true if no new pieces can spawn.
   * 8. score - Number of lines cleared.
   * @param {int} ni Number of columns in the playfield
   * @param {int} nj Number of rows in the playfield
   */
  getNewState: (ni, nj) => {
    // Create a new state
    let newState = {
      hold: null,
      justHeld: false,
      gravity: false,
      stack: utils.mkFill(ni, nj, null),
      nextPieces: Game.getRandomPieces(),
      gameOver: false,
      score: 0
    }
    // Add current and ghost
    Game.updateCurrent(Game.getNextPiece(newState), newState)
    return newState
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
   * Returns a the next Tetromino in newPieces and replaces it in the "state.nextPieces" array.
   * @param {Object} state The state object
   */
  getNextPiece: state => {
    if (state.nextPieces.length <= Game.PREVIEW_LIMIT) {
      state.nextPieces.push(...Game.getRandomPieces())
    }
    return state.nextPieces.shift()
  },

  /**
   * If "state.hold" is empty, store "state.current" there and get next piece.
   * Otherwise swap with it.
   * @param {Object} state The state object
   */
  holdPiece: state => {
    if (state.current!=null && !state.justHeld) {
      if(state.hold == null) {
        state.hold = state.current
        Game.updateCurrent(Game.getNextPiece(state), state)
      } else {
        let temp = state.current
        Game.updateCurrent(state.hold, state)
        state.hold = temp
        state.justHeld = true
      }
      state.hold.i = state.hold.cons==Tetromino.I ? Game.SPAWN_LOC[0] :  Game.SPAWN_LOC[0]
      state.hold.j = state.hold.cons==Tetromino.I ? Game.SPAWN_LOC[1]-1 :  Game.SPAWN_LOC[1]
      state.hold.rot = 0
    }
  },

  /**
   * Adds a piece to the given stack.
   * @param {Tetromino} piece The piece to add to the stack
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  addPiece: (piece, stack) => piece.get().forEach(node => stack[node.j][node.i] = node.color),

  /**
   * Removes a piece from the given stack.
   * @param {Tetromino} piece The piece to add to the stack
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  removePiece: (piece, stack) => piece.get().forEach(node => stack[node.j][node.i] = null),

  /**
   * Clear all lines that have been filled in the given stack.
   * Returns true if any lines were cleared.
   * @param {Array} stack 2D array that keeps track of Tetromino segments that have been locked in place.
   */
  clearLines: stack => {
    let nLines = 0
    for(let j=stack.length-1; j>=0; j--) {
      let nFilled = Game.countFilled(stack[j])
      if (nFilled == 0) break
      else if (nFilled == stack[0].length) {
        stack[j].forEach((_, i) => stack[j][i] = null)
        nLines += 1
      }
    }
    return nLines
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
   * Returns a random 7 long sequence of Tetrominos initialized to Game.SPAWN_LOC
   */
  getRandomPieces: () => {
    let seq = Game.tetrominoFactories
      .map(cons => cons==Tetromino.I ? 
          cons(Game.SPAWN_LOC[0], Game.SPAWN_LOC[1]-1) : 
          cons(Game.SPAWN_LOC[0], Game.SPAWN_LOC[1]))
    utils.shuffle(seq)
    return seq
  },
}