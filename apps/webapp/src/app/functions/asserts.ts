import { environment } from '../../environments/environment'

export function invariant(condition: unknown, message = 'Assertion error'): asserts condition {
  if (environment.production) {
    return
  }

  if (!condition) {
    throw new InvariantViolation(message)
  }
}

class InvariantViolation extends Error {
  override readonly name = 'Invariant Violation'
}
