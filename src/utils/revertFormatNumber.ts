import numbersLetter from './numbersLetter'

export default (n: string): number => {
  const number = n.match(/[+-]?\d+(\.\d+)?/g).map((v) => parseFloat(v))
  const scale = n.match(/[a-zA-Z]+/g)

  if (!numbersLetter.find((scaleItem) => scaleItem === scale[0].toUpperCase()))
    throw new Error('escala inválida.')

  const scaleItemId = numbersLetter.findIndex(
    (scaleItem) => scaleItem === scale[0].toUpperCase()
  )

  return number[0] * Number('1'.padEnd(1 + scaleItemId * 3, '0'))
}
