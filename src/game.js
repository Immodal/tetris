/**
 * This is the base object used for each Tetris piece
 */
const Node = (x, y, color) => {
  const node = {}

  node.x = x
  node.y = y
  node.color = color

  /**
   * Returns true if node is in game boundary given by nx, ny
   */
  node.inBounds = (nx, ny) => node.x>=0 && node.x<nx && node.y>=0 && node.y<ny

  /**
   * Returns true if node's components equal n's components
   */
  node.eq = n => node.x == n.x && node.y == n.y

  return node
}

/**
 * Object that maps a Node to a location
 */
const NodeSet = () => {
  const ns = {}
  ns.lookup = new Map()

  ns.encXY = (x, y) => `${x},${y}`

  ns.add = (x, y) => ns.lookup.set(ns.encXY(x,y), Node(x, y))

  ns.addNode = node => ns.lookup.set(ns.encXY(node.x,node.y), node)

  ns.delete = (x, y) => ns.lookup.delete(ns.encXY(x,y))

  ns.deleteNode = node => ns.lookup.delete(ns.encXY(node.x,node.y))

  ns.has = (x, y) => ns.lookup.has(ns.encXY(x,y))

  ns.hasNode = node => ns.lookup.has(ns.encXY(node.x,node.y))

  ns.get = (x, y) => ns.lookup.get(ns.encXY(x,y))

  ns.size = () => ns.lookup.size

  ns.copy = () => {
    const nsCopy = NodeSet()
    nsCopy.lookup = new Map(ns.lookup)
    return nsCopy
  }

  return ns
}

const Game = {
  
}