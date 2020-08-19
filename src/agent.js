const Agent = (nHolesConst, nHolesMult, nBlockedConst, nBlockMult, nTallEmptyColsConst, nTallEmptyColsMult,
                halfHeightRowMult, threeQuarterHeightRowMult)  => {
  const agent = {}

  agent.score = Scoring.score(nHolesConst, nHolesMult, nBlockedConst, nBlockMult, 
    nTallEmptyColsConst, nTallEmptyColsMult,halfHeightRowMult, threeQuarterHeightRowMult) 
  agent.target = null
  agent.holdCurrent = false

  /**
   * Set a target piece for the agent to work toward.
   * @param {Object} state The state object
   */
  agent.updateTarget = state => {
    // Get all valid endpoints using the current piece and the held piece
    let endPoints = Scoring.getEndPoints(state.current, state.stack)
    let altEndpoints = null
    if (state.hold==null) altEndpoints = Scoring.getEndPoints(state.nextPieces[0], state.stack)
    else altEndpoints = Scoring.getEndPoints(state.hold, state.stack)

    // Score all endpoints
    let mainRes = Scoring.getBestEndpoint(endPoints, state.stack, agent.score)
    let altRes = Scoring.getBestEndpoint(altEndpoints, state.stack, agent.score)

    // Choose piece + location with the lowest score (least penalties)
    if (altRes[0]<mainRes[0]) {
      agent.holdCurrent = true
      agent.target = altRes[1]
    } else {
      agent.holdCurrent = false
      agent.target = mainRes[1]
    }
  }

  /**
   * Takes the state and mutates it to work toward the agents target
   * @param {Object} state The state object
   */
  agent.move = state => {
    if (state.current==null) return null
    
    agent.updateTarget(state)

    // Dont do everything at once, just space out enough to see what is going on
    if (agent.target==null) {
      Game.updateCurrent(state.current.next(0,1), state)
    } else if (agent.holdCurrent) {
      Game.holdPiece(state)
    } else if (state.current.i != agent.target.i || state.current.rot != agent.target.rot) {
      // Fix column location and rotation
      let p = state.current.next(agent.target.i - state.current.i, state.current.cons==Tetromino.I ? 1 : 0, agent.target.rot)
      Game.updateCurrent(p, state)
    } else {
      // Lock in at ghost
      Game.updateCurrent(state.ghost, state)
    }
  }

  agent.currentIsUnexpected = current => current.cons != agent.target.cons || current.j > agent.target.j

  return agent
}