import { gray } from 'colors/safe'

export default () => {
  const nowDate = new Date()
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    minute: '2-digit',
    hour: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  }

  return gray(`[${new Intl.DateTimeFormat('pt-BR', options).format(nowDate)}]`)
}
