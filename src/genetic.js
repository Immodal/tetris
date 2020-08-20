const Genetic = {
  Instance: (ni, nj, stateRngSeed, weights=null) => {
    const inst = {}

    inst.agent = Agent(weights==null ? Scoring.getRandomWeights() : weights)
    inst.state = Game.getNewState(ni, nj, new Math.seedrandom(stateRngSeed))    

    return inst
  },

  /**
   * 
   */
  createPopulation: (size, ni, nj, seed=Math.random()) => {
    const population = []
    for (let i=0; i<size; i++) {
      population.push(Genetic.Instance(ni, nj, seed))
    }

    return population
  },

  /**
   * 
   */
  sortPopulation: population => population.sort((a, b) => -(a.score - b.score)),

  /**
   * 
   * @param {Array} population 2D array that keeps track of Tetromino segments that have been locked in place.
   * @param {int} stepLimit Number of iterations to run
   */
  computeFitness: (population, stepLimit=10) => {
    for (; stepLimit>0; stepLimit--) {
      console.log(stepLimit)
      let nGameOvers = 0
      for (let i=0; i<population.length; i++) {
        const inst = population[i]
        if (!inst.state.gameOver) {
          inst.agent.move(inst.state)
          const oldScore = inst.state.score
          inst.state = inst.state.current!=null ? Game.next(inst.state, false) : Game.next(inst.state)
          if (oldScore>inst.state.score) console.log(`WTF`)
        } else nGameOvers += 1
      }
      console.log(`Game Overs: ${nGameOvers}`)
      if (nGameOvers == population.length) return true

    }

    return false
  },
}