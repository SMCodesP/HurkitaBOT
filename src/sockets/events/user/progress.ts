import Event from '../../event'
import progressController from '../../utils/progressController'

export default class Progress extends Event {
  constructor() {
    super('progress')
  }

  run(socket, data) {
    progressController.add(socket.id, data)
  }
}
