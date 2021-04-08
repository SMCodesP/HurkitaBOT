import { bot } from '../index'
import * as si from 'systeminformation'

export default async () => {
  // const version = bot.version || '1.0.0'
  // const ram_used = process.memoryUsage().heapUsed / 1024 / 1024
  // const startUsage = process.cpuUsage();

  try {
    const cpu = await si.cpu()

    
  } catch (error) {
    console.error(error)
  }
}
