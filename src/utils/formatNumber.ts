/* eslint-disable no-restricted-properties */

import numbersLetter from './numbersLetter'

/* eslint-disable no-bitwise */
export default (n: number): string => {
  const number =
    ((Math.log10(n) / 3) | 0) === 0
      ? n
      : Number((n / Math.pow(10, ((Math.log10(n) / 3) | 0) * 3)).toFixed(3))

  if (!numbersLetter[(Math.log10(n) / 3) | 0] && n > 1000) {
    const number_string = n.toLocaleString('fullwide', { useGrouping: false })
    return (
      number_string.substring(
        0,
        number_string.length - (numbersLetter.length * 3 - 3)
      ) + numbersLetter[numbersLetter.length - 1]
    )
  }

  return number + numbersLetter[(Math.log10(n) / 3) | 0]
}
