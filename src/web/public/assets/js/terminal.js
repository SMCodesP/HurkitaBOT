const socket = io();
const term = new Terminal({
  cols: 135,
  rows: 30,
});

term.open(document.getElementById('terminal'));

socket.on('log', (log) => {
  term.write(log.join(' '))
  term.prompt()
})

socket.on('logs', (logs) => {
  logs.forEach(log => {
    term.writeln(`> ${log}`)
  });
  term.prompt()
})

function runFakeTerminal() {
  if (term._initialized) {
    return;
  }
  
  term._initialized = true;
  let digitalized = '';
  
  term.prompt = () => {
    digitalized = ''
    term.write('\r\n> ');
  };
  
  term.writeln('Olá, seja bem-vindo(a) ao terminal da HurkitaBOT!')
  term.writeln('Aqui você pode executar comandos de forma admnistrativa.')
  term.writeln('');
  
  term.on('key', function(key, ev) {
    const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;
    
    if (ev.keyCode === 13) {
      socket.emit('commandHandler', digitalized)
      term.prompt();
    } else if (ev.keyCode === 8) {
      if (term._core.buffer.x > 2) {
        term.write('\b \b');
      }
    } else if (printable) {
      digitalized += key
      term.write(key);
    }
  });
  
  term.on('paste', function(data) {
    term.write(data);
  });
}
runFakeTerminal();