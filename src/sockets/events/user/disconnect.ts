import Event from '../../event'
import progressController from '../../utils/progressController'

export default class Disconnect extends Event {
  constructor() {
    super('disconnect')
  }

  run(socket) {
    console.log(`Socket ${socket.id} disconnected`)
    progressController.remove(socket.id)
  }
}
