const sketch = ( p ) => {
  iPiece = Tetromino.I(0,0,"cyan")

  const blockSize = 20
  const nI = () => 10
  const nJ = () => 20
  const toX = i => Math.floor(i * p.width / nI())
  const toY = i => Math.floor(i * p.height / nJ())
  const fromX = x => Math.floor(x * nI() / p.width)
  const fromY = y => Math.floor(y * nJ() / p.height)

  let canvas = null
  const initCanvas = () => {
    canvas = p.createCanvas(nI()*blockSize, nJ()*blockSize,)
    canvas.parent("#cv")
  }

  p.setup = () => {
    initCanvas()
  }

  p.draw = () => {
    p.background(240)
    
    p5Tetrion.drawTetromino(p, toX, toY, iPiece)
  }
}

const p5Tetrion = {
  drawTetromino: (p, toX, toY, t) => {
    t.get().forEach(node => p.rect(toX(node.i), toY(node.j), toX(1), toY(1)))
  }
}

let p5Instance = new p5(sketch);