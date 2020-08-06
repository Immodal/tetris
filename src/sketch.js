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

  const next = Game.next(nI, nJ)
  let updateTimer = 0
  let state = next(null)
  const update = (force=false) => {
    if (p.millis() > updateTimer || force) {
      updateTimer = p.millis() + updateDelay
      if (!state.gameOver) state = next(state)
    }
  }

  /**
   * Setup
   */
  p.setup = () => {
    initCanvas()
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


let p5Instance = new p5(sketch);