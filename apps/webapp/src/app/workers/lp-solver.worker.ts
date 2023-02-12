import { expose } from 'comlink'
import { solve, Model } from 'yalps'

export const api = {
  solve(model: Model) {
    return solve(model)
  },
}

expose(api)
