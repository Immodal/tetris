const Field = {
  Base: (p, x, y, w, h, ni, nj, title="") => {
    const field = {}
  
    field.p = p
    field.x = x
    field.y = y
    field.w = w
    field.h = h
    field.ni = ni
    field.nj = nj
    field.title = title
    field.titleYOffset = 15
    field.titleSize = 20
  
    field.toX = i => Math.floor(i * field.w / field.ni)
    field.toY = j => Math.floor(j * field.h / field.nj)
  
    field.toXAbs = i => field.toX(i) + field.x
    field.toYAbs = j => field.toX(j) + field.y

    field.drawTitle = () => {
      p.textSize(field.titleSize)
      p.textAlign(p.CENTER, p.CENTER)
      p.text(field.title, field.x + field.w/2, field.y - field.titleYOffset)
    }
  
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

  Play: (p, x, y, w, h, ni, nj, title="") => {
    const pf = Field.Base(p, x, y, w, h, ni, nj, title)
  
    pf.draw = state => {
      pf.fillBackground()
      pf.drawTitle()
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

  NextPieces: (p, x, y, w, h, ni, nj, title="") => {
    const npf = Field.Base(p, x, y, w, h, ni, nj, title)
  
    npf.draw = state => {
      npf.fillBackground()
      npf.drawTitle()
      let iOffset = 1 - Game.SPAWN_LOC[0]
      let jOffset = 1 - Game.SPAWN_LOC[1]
      for(let k=0; k<Game.PREVIEW_LIMIT; k++) {
        let piece = state.nextPieces[k]
        let p = piece.cons(piece.i+iOffset, piece.j+jOffset)
        jOffset += piece.cons == Tetromino.I ? 2 : 3
        npf.drawNodes(p.get())
      }
      npf.drawBorder()
    }
  
    return npf
  },

  HoldPiece: (p, x, y, w, h, ni, nj, title="") => {
    const hpf = Field.Base(p, x, y, w, h, ni, nj, title)
  
    hpf.draw = state => {
      hpf.fillBackground()
      hpf.drawTitle()
      if(state.hold!=null) {
        let iOffset = 1 - Game.SPAWN_LOC[0]
        let jOffset = 1 - Game.SPAWN_LOC[1]
  
        let p = state.hold.cons(state.hold.i+iOffset, state.hold.j+jOffset)
        hpf.drawNodes(p.get())
      }
      hpf.drawBorder()
    }
  
    return hpf
  },
}