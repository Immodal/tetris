const Field = {
  Base: (p, x, y, w, h, ni, nj) => {
    const field = {}
  
    field.p = p
    field.x = x
    field.y = y
    field.w = w
    field.h = h
    field.ni = ni
    field.nj = nj
  
    field.toX = i => Math.floor(i * field.w / field.ni)
    field.toY = j => Math.floor(j * field.h / field.nj)
  
    field.toXAbs = i => field.toX(i) + field.x
    field.toYAbs = j => field.toX(j) + field.y
  
    field.fillBackground = () => {
      field.p.fill(0)
      field.p.noStroke()
      field.p.rect(field.x, field.y, field.w, field.h)
    }
  
    field.drawBorder = () => {
      field.p.noFill()
      field.p.stroke(0)
      field.p.strokeWeight(2)
      field.p.rect(field.x, field.y, field.w, field.h)
    }
  
    field.drawNodes = (nodes, isGhost=false) => {
      let ghostAlpha = "44"
      field.p.stroke(0)
      field.p.strokeWeight(2)
      nodes.forEach(node => {
        field.p.fill(isGhost ? node.color + ghostAlpha : node.color)
        field.p.rect(field.toXAbs(node.i), field.toYAbs(node.j), field.toX(1), field.toY(1))
      })
    }
  
    return field
  }, 

  Play: (p, x, y, w, h, ni, nj) => {
    const pf = Field.Base(p, x, y, w, h, ni, nj)
  
    pf.draw = state => {
      pf.fillBackground()
      if (state.current!=null) pf.drawNodes(state.current.get())
      if (state.ghost!=null) pf.drawNodes(state.ghost.get(), true)
      pf.drawStack(state.stack)
      pf.drawBorder()
    }
  
    pf.drawStack = stack => {
      pf.p.stroke(0)
      pf.p.strokeWeight(2)
      stack.forEach((row, j) => {
        row.forEach((color, i) => {
          if(color != null) {
            pf.p.fill(color)
            pf.p.rect(pf.toXAbs(i), pf.toYAbs(j), pf.toX(1), pf.toY(1))
          }
        })
      })
    }
  
    return pf
  },

  NextPieces: (p, x, y, w, h, ni, nj) => {
    const npf = Field.Base(p, x, y, w, h, ni, nj)
  
    npf.draw = state => {
      npf.fillBackground()
      let iOffset = 1 - Game.SPAWN_LOC[0]
      let jOffset = 1 - Game.SPAWN_LOC[1]
      state.nextPieces.forEach(piece => {
        let p = piece.cons(piece.i+iOffset, piece.j+jOffset)
        jOffset += piece.cons == Tetromino.I ? 2 : 3
        npf.drawNodes(p.get())
      })
      npf.drawBorder()
    }
  
    return npf
  },
}