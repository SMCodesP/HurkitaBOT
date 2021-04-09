import * as importDir from 'directory-import'

export default function registerEvents(path, call) {
  const events = importDir({
    directoryPath: path,
    includeSubdirectories: false,
  })

  console.log('Registrou os events: ', Object.values(events))
  Object.values(events).forEach((file: any) => {
    const event = new file.default()
    call.on(event.name, (...args) => event.run(call, ...args))
  })
}
