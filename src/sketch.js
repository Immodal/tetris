const sketch = ( p ) => {

  const updateDelay = 500
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
    canvas = p.createCanvas(600, 500)
    canvas.parent("#cv")
    pf = Field.Play(p, 
      canvas.width/2-blockSize*nI/2, topMargin,
      blockSize*nI, blockSize*nJ,
      nI, nJ)
    npf = Field.NextPieces(p, 
      pf.x + pf.w + blockSize, topMargin,
      blockSize*npfI, blockSize*npfJ,
      npfI, npfJ)
    hpf = Field.HoldPiece(p,
      pf.x - blockSize -  blockSize*hpfI, topMargin,
      blockSize*hpfI, blockSize*hpfJ,
      hpfI, hpfJ)
  }

  /**
   * Player Selection Elements
   */
  const HUMAN = 0
  const AI = 1
  let playerSelect = null
  const initPlayerSelect = () => {
    playerSelect = p.createSelect()
    playerSelect.style('font-size', '13px')
    playerSelect.parent("#playerSelect")
    playerSelect.option("Human", HUMAN)
    playerSelect.option("AI", AI)
    playerSelect.value(HUMAN)
    //playerSelect.changed(resetGame)
  }

  /**
   * Game Update
   */
  let updateTimer = 0
  let state = Game.getNewState(nI, nJ)
  const update = (force=false) => {
    if ((playerSelect.value()==HUMAN && p.millis() > updateTimer) || force) {
      updateTimer = p.millis() + updateDelay
      if (!state.gameOver) state = Game.next(state)
    }
  }

  /**
   * Setup
   */
  p.setup = () => {
    initCanvas()
    initPlayerSelect()
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
    if (playerSelect.value()==HUMAN) {
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
          Game.updateCurrent(state.ghost, state)
          update(true)
        }
      }
    }
  }
}


let p5Instance = new p5(sketch);