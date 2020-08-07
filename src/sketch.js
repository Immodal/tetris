const sketch = ( p ) => {

  const UPDATE_DELAY_INITIAL = 50
  const UPDATE_DELAY_MIN = 50
  const UPDATE_DELAY_MAX = 1000

  const blockSize = 20
  const topMargin = 50
  const nI = 10
  const nJ = 20
  const npfI = 6
  const npfJ = 10
  const hpfI = 6
  const hpfJ = 4

  /**
   * Canvas and visual elements inside it
   */
  let canvas = null
  let pf = null
  let npf = null
  let hpf = null
  const initCanvas = () => {
    canvas = p.createCanvas(500, 475)
    canvas.parent("#cv")
    pf = Field.Play(p, 
      canvas.width/2-blockSize*nI/2, topMargin,
      blockSize*nI, blockSize*nJ,
      nI, nJ, "Play Field")
    npf = Field.NextPieces(p, 
      pf.x + pf.w + blockSize, topMargin,
      blockSize*npfI, blockSize*npfJ,
      npfI, npfJ, "Next Piece")
    hpf = Field.HoldPiece(p,
      pf.x - blockSize -  blockSize*hpfI, topMargin,
      blockSize*hpfI, blockSize*hpfJ,
      hpfI, hpfJ, "Holding")
  }

  /**
   * Player Selection Elements
   */
  const HUMAN = 0
  const RBA = 1
  let agent = Agent()
  let playerSelect = null
  const initPlayerSelect = () => {
    playerSelect = p.createSelect()
    playerSelect.style('font-size', '13px')
    playerSelect.parent("#playerSelect")
    playerSelect.option("Rule Based Agent", RBA)
    playerSelect.option("Human", HUMAN)
    playerSelect.value(RBA)
  }

  let score = 0
  let scoreCounter = null
  const initScoreCounter = () => {
    scoreCounter = p.createSpan(`${score}`)
    scoreCounter.parent("#scoreCount")
  }
  const updateScore = s => {
    score = s
    scoreCounter.html(score)
  }

  /**
   * Game Speed Elements
   */
  let gameSpeedLabel = null
  let gameSpeedSlider = null
  const initGameSpeedSlider = () => {
    gameSpeedSlider = p.createSlider(UPDATE_DELAY_MIN, UPDATE_DELAY_MAX, UPDATE_DELAY_INITIAL)
    gameSpeedLabel = p.createSpan(`${gameSpeedSlider.value()}`)
    gameSpeedLabel.parent("#gameSpeedLbl")
    gameSpeedSlider.parent('#gameSpeed')
    gameSpeedSlider.changed(() => gameSpeedLabel.html(gameSpeedSlider.value()))
  }

  /**
   * Game Update
   */
  let updateTimer = 0
  let state = Game.getNewState(nI, nJ)
  const update = (force=false) => {
    if (p.millis() > updateTimer || force) {
      updateTimer = p.millis() + gameSpeedSlider.value()

      if (!state.gameOver) {
        if (playerSelect.value()==RBA && state.current != null) {
          agent.move(state)
          state = Game.next(state, false)
        } else Game.next(state)
      } else {
        state = Game.getNewState(nI, nJ)
      }

      updateScore(state.score)
    }
  }

  /**
   * Setup
   */
  p.setup = () => {
    initCanvas()
    initGameSpeedSlider()
    initPlayerSelect()
    initScoreCounter()
  }

  /**
   * Draw
   */
  p.draw = () => {
    p.background(240)
    update()
    pf.draw(state)
    npf.draw(state)
    hpf.draw(state)
  }

  /**
   * Key Pressed
   */
  p.keyPressed = () => {
    if (playerSelect.value()==HUMAN) P5KbInputs.human(p, state, update)
    // else if (playerSelect.value()==RBA) P5KbInputs.rba(p, update)
  }
}

const P5KbInputs = {
  human: (p, state, update) => {
    if (state.current != null) {
      let piece = state.current
      if (p.key == "w") Game.updateCurrent(piece.cw(state.stack), state)
      else if (p.key == "s") update(true)
      else if (p.key == "a") Game.updateCurrent(piece.left(state.stack), state)
      else if (p.key == "d") Game.updateCurrent(piece.right(state.stack), state)
      else if (p.key == "c") Game.holdPiece(state)
    } 
    if (state.ghost != null) {
      if (p.key == " ") {
        if (state.current!=null) Game.updateCurrent(state.ghost, state)
        update(true)
      }
    }
  },
  /*
  rba: (p, update) => {
    if (p.key == " ") update(true)
  }
  */
}

let p5Instance = new p5(sketch);