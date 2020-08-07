const Agent = () => {
  const agent = {}

  agent.target = null
  agent.holdCurrent = false

  agent.updateTarget = state => {
    let endPoints = Scoring.getEndPoints(state.current, state.stack)
    let altEndpoints = null
    if (state.hold==null) altEndpoints = Scoring.getEndPoints(state.nextPieces[0], state.stack)
    else altEndpoints = Scoring.getEndPoints(state.hold, state.stack)

    let mainRes = Scoring.getBestEndpoint(endPoints, state.stack)
    let altRes = Scoring.getBestEndpoint(altEndpoints, state.stack)

    if (altRes[0]<mainRes[0]) {
      agent.holdCurrent = true
      agent.target = altRes[1]
    } else {
      agent.holdCurrent = false
      agent.target = mainRes[1]
    }
  }

  agent.move = state => {
    if (state.current==null) return null
    
    agent.updateTarget(state)

    if (agent.target==null) {
      Game.updateCurrent(state.current.next(0,1), state)
    } else if (agent.holdCurrent) {
      Game.holdPiece(state)
    } else if (state.current.i != agent.target.i || state.current.rot != agent.target.rot) {
      let p = state.current.next(agent.target.i - state.current.i, state.current.cons==Tetromino.I ? 1 : 0, agent.target.rot)
      Game.updateCurrent(p, state)
    } else Game.updateCurrent(state.ghost, state)
  }

  agent.currentIsUnexpected = current => current.cons != agent.target.cons || current.j > agent.target.j

  return agent
}