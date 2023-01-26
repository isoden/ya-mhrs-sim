import { SignPipe } from './sign.pipe'

describe('SignPipe', () => {
  it.each([
    [2, '+2'],
    [1, '+1'],
    [0, '0'],
    [-1, '-1'],
    [-2, '-2'],
  ])('%j | sign => %j', (input, output) => {
    const pipe = new SignPipe()

    expect(pipe.transform(input)).toBe(output)
  })

  it('default value', () => {
    const pipe = new SignPipe()

    expect(pipe.transform(0, '-')).toBe('-')
  })
})
