const sketch = ( p ) => {

  const blockSize = 20
  const nI = () => 10
  const nJ = () => 20
  const toX = i => Math.floor(i * p.width / nI())
  const toY = i => Math.floor(i * p.height / nJ())

  let canvas = null
  const initCanvas = () => {
    canvas = p.createCanvas(nI()*blockSize, nJ()*blockSize)
    canvas.parent("#cv")
  }

  const next = Game.next(nI(), nJ())
  let stateUpdate = {
    current: null
  }
  let updateTimer = 0
  let state = next(null)
  const updateDelay = 500
  const update = (force=false) => {
    if (p.millis() > updateTimer || force) {
      updateTimer = p.millis() + updateDelay
      state = next(state, stateUpdate)
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
    p5Game.drawState(p, toX, toY, state)
  }

  /**
   * Key Pressed
   */
  p.keyPressed = () => {
    let piece = state.current
    if (p.key == "w") state.current = piece.cw(state.ni, state.nj, state.stack)
    else if (p.key == "s") update(true)
    else if (p.key == "a") state.current = piece.left(state.ni, state.nj, state.stack)
    else if (p.key == "d") state.current = piece.right(state.ni, state.nj, state.stack)
  }
}

const p5Game = {
  drawState: (p, toX, toY, state) => {
    p5Game.drawNodes(p, toX, toY, state.current.get())
    p5Game.drawNodes(p, toX, toY, state.stack.lookup)
  },
  
  drawNodes: (p, toX, toY, tets) => {
    tets.forEach(node => {
      p.fill(node.color)
      p.rect(toX(node.i), toY(node.j), toX(1), toY(1))
    })
  },

}

let p5Instance = new p5(sketch);