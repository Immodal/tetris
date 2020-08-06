const sketch = ( p ) => {

  const blockSize = 20
  const nI = 10
  const nJ = 20
  const toX = i => Math.floor(i * p.width / nI)
  const toY = i => Math.floor(i * p.height / nJ)

  let canvas = null
  const initCanvas = () => {
    canvas = p.createCanvas(nI*blockSize, nJ*blockSize)
    canvas.parent("#cv")
  }

  const next = Game.next(nI, nJ)
  let updateTimer = 0
  let state = next(null)
  const updateDelay = 500
  const update = (force=false) => {
    if (p.millis() > updateTimer || force) {
      updateTimer = p.millis() + updateDelay
      state = next(state)
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
    if (state.current != null) {
      let piece = state.current
      if (p.key == "w") Game.updateCurrent(piece.cw(state.stack), state)
      else if (p.key == "s") update(true)
      else if (p.key == "a") Game.updateCurrent(piece.left(state.stack), state)
      else if (p.key == "d") Game.updateCurrent(piece.right(state.stack), state)
    } 
    if (state.ghost != null) {
      if (p.key == " ") {
        Game.updateCurrent(state.ghost, state)
        update(true)
      }
    }
  }
}

const p5Game = {
  drawState: (p, toX, toY, state) => {
    if (state.current!=null) p5Game.drawNodes(p, toX, toY, state.current.get())
    if (state.ghost!=null) p5Game.drawNodes(p, toX, toY, state.ghost.get(), true)
    p5Game.drawStack(p, toX, toY, state.stack)
  },

  drawStack: (p, toX, toY, stack) => {
    p.stroke(0)
    stack.forEach((row, j) => {
      row.forEach((color, i) => {
        if(color != null) {
          p.fill(color)
          p.rect(toX(i), toY(j), toX(1), toY(1))
        }
      })
    })
  },

  drawNodes: (p, toX, toY, nodes, isGhost=false) => {
    let ghostAlpha = "55"
    let strokeColor = "#000000"
    nodes.forEach(node => {
      p.fill(isGhost ? node.color + ghostAlpha : node.color)
      p.stroke(isGhost ?strokeColor + ghostAlpha : strokeColor)
      p.rect(toX(node.i), toY(node.j), toX(1), toY(1))
    })
  },

}

let p5Instance = new p5(sketch);