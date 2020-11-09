import getNowTime from "./getNowTime";

const originalConsoleLog = console.log

console.log = (...thisArguments: string[]) => {
  const args = [];
  args.push(getNowTime())

  for (var countArgumentsOfRegisterArgs = 0; countArgumentsOfRegisterArgs < thisArguments.length; countArgumentsOfRegisterArgs++) {
    args.push(thisArguments[countArgumentsOfRegisterArgs])
  }

  originalConsoleLog.apply(console, args)
}