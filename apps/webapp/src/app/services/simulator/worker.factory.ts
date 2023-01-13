export function workerFactory() {
  return new Worker(new URL('../../workers/lp-solver.worker', import.meta.url))
}
