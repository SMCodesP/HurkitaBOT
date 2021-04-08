import Event from '../../event'
import progressController from '../../utils/progressController'

export default class Progress extends Event {
  constructor() {
    super('progress')
  }

  run(socket, data) {
    console.log("")
    console.log(`${socket.id} Progress`)
    console.log(data)
    console.log("")
    progressController.add(socket.id, data)
  }
}
