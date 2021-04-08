import * as importDir from 'directory-import'
import * as path from 'path'
import registerEvents from '../../utils/registerEvents'
import Event from '../event'

export default class Connection extends Event {
  events: any[]

  constructor() {
    super('connection')

    this.events = Object.values(
      importDir({
        directoryPath: path.resolve(__dirname, 'user'),
        includeSubdirectories: false,
      })
    ).map((file: any) => new file.default())
  }

  run(_, socket) {
    console.log(`Socket ${socket.id} connected!`)
    this.events.forEach((event) => {
      socket.on(event.name, (...args) => event.run(socket, ...args))
    })
  }
}
