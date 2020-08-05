/**
 * This is the base object used for each Tetris piece
 */
const Node = (i, j, color) => {
  const node = {}

  node.i = i
  node.j = j
  node.color = color

  /**
   * Returns true if node is in game boundary given by ni, nj
   */
  node.inBounds = (ni, nj) => node.i>=0 && node.i<ni && node.j>=0 && node.j<nj

  /**
   * Returns true if node's components equal n's components
   */
  node.eq = n => node.i == n.i && node.j == n.j

  return node
}

/**
 * Object that maps a Node to a location
 */
const NodeSet = () => {
  const ns = {}
  ns.lookup = new Map()

  ns.encIJ = (i, j) => `${i},${j}`

  ns.add = node => ns.lookup.set(ns.encIJ(node.i,node.j), node)

  ns.addAll = nodes => nodes.forEach(node => ns.add(node))

  ns.delete = node => ns.lookup.delete(ns.encIJ(node.i,node.j))

  ns.has = node => ns.lookup.has(ns.encIJ(node.i,node.j))

  ns.get = (i, j) => ns.lookup.get(ns.encIJ(i,j))

  ns.size = () => ns.lookup.size

  ns.copy = () => {
    const nsCopy = NodeSet()
    nsCopy.lookup = new Map(ns.lookup)
    return nsCopy
  }

  return ns
}