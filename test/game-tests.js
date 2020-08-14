
const GameTests = {
  "countFilled": () => {
    const row = Array(5).fill(null)

    eq(0, Game.countFilled(row))
    row[0] = 1
    row[row.length-1] = 1
    eq(2, Game.countFilled(row))
  },

  "clearLines": () => {
    const stackSize = 6
    const stack = utils.mkFill(stackSize, stackSize, null)

    stack[stackSize-1].fill(1)
    eq(stackSize, Game.countFilled(stack[stackSize-1]))
    stack[stackSize-2].fill(1)
    stack[stackSize-2][0] = null
    eq(stackSize-1, Game.countFilled(stack[stackSize-2]))
    stack[stackSize-3].fill(1)
    eq(stackSize, Game.countFilled(stack[stackSize-3]))

    Game.clearLines(stack)

    eq(0, Game.countFilled(stack[stackSize-1]))
    eq(stackSize-1, Game.countFilled(stack[stackSize-2]))
    eq(0, Game.countFilled(stack[stackSize-3]))
  },

  "processGravity": () => {
    const stackSize = 6
    const stack = utils.mkFill(stackSize, stackSize, null)

    stack[stackSize-2].fill(1)
    stack[stackSize-4].fill(1)
    eq(0, Game.countFilled(stack[stackSize-1]))
    eq(stackSize, Game.countFilled(stack[stackSize-2]))
    eq(0, Game.countFilled(stack[stackSize-3]))
    eq(stackSize, Game.countFilled(stack[stackSize-4]))

    Game.processGravity(stack)

    eq(stackSize, Game.countFilled(stack[stackSize-1]))
    eq(stackSize, Game.countFilled(stack[stackSize-2]))
    eq(0, Game.countFilled(stack[stackSize-3]))
    eq(0, Game.countFilled(stack[stackSize-4]))
  },

  "addPiece and removePiece": () => {
    const checkAddRemovePiece = cons => {
      cons(0, 0).rotations.forEach((orientation, rot) => {
        const stack = utils.mkFill(6, 6, null)
        const p = cons(0, 0, rot)
        eq(true, orientation.every(pos => stack[pos[1]][pos[0]] == null))
        Game.addPiece(p, stack)
        eq(true, orientation.every(pos => stack[pos[1]][pos[0]] == p.color))
        Game.removePiece(p, stack)
        eq(true, orientation.every(pos => stack[pos[1]][pos[0]] == null))
      })
    }

    Game.tetrominoFactories.forEach(cons => checkAddRemovePiece(cons))
  },

  "getGhost": () => {
    const checkGhost = cons => {
      const rowNum = 9
      const p = cons(0, 0)
      const stack = utils.mkFill(6, 20, null)
      const pBefore = Game.getGhost(p, stack)
      eq(true, pBefore.i == p.i)
      eq(true, pBefore.j != p.j)
      eq(true, pBefore.j > rowNum)
      eq(true, pBefore.isValid(stack))
      stack[rowNum].fill(p.color)
      const pAfter = Game.getGhost(p, stack)
      eq(true, pAfter.i == p.i)
      eq(true, pAfter.j != p.j)
      eq(true, pAfter.j < rowNum)
      eq(true, pAfter.isValid(stack))
    }

    Game.tetrominoFactories.forEach(cons => checkGhost(cons))
  },

  "updateCurrent": () => {
    const state = {}
    state.stack = utils.mkFill(6, 20, null)
    Game.updateCurrent(Tetromino.I(0,0), state)
    eq(true, state.current.cons==Tetromino.I)
    eq(true, state.ghost.cons==Tetromino.I)
  },

  "getNextPiece": () => {
    const state = Game.getNewState(10, 20)
    eq(Game.tetrominoFactories.length-1, state.nextPieces.length)

    for (let i=0; i<state.nextPieces.length+1; i++) {
      const startingLength = state.nextPieces.length
      const expP = state.nextPieces[0]
      const p = Game.getNextPiece(state)
      eq(true, Game.tetrominoFactories.some(f => f==p.cons))
      eq(p, expP)
      if (startingLength<=Game.PREVIEW_LIMIT) {
        eq(startingLength-1 + Game.tetrominoFactories.length, state.nextPieces.length)
      } else eq(startingLength-1, state.nextPieces.length)
    }
  },

  "holdPiece": () => {
    const state = Game.getNewState(10, 20)

    let expCurrent = state.nextPieces[0]
    let expHold = state.current
    eq(null, state.hold)
    eq(false, state.justHeld)
    Game.holdPiece(state)
    eq(expHold, state.hold)
    eq(expCurrent, state.current)
    eq(true, state.justHeld)
    // Check that it doesnt change since state.justHeld is true
    Game.holdPiece(state)
    eq(expHold, state.hold)
    eq(expCurrent, state.current)
    eq(true, state.justHeld)

    expCurrent = state.hold
    expHold = state.current
    state.justHeld = false
    Game.holdPiece(state)
    eq(expHold, state.hold)
    eq(expCurrent, state.current)
  }
}