const socket = io();
const term = new Terminal({
  cols: 135,
  rows: 30,
});
let jwt = ''

term.open(document.getElementById('terminal'));

function initializedTerminal() {
  let digitalized = '';

  term.prompt = () => {
    digitalized = ''
    term.write('\r\n> ');
  };

  socket.on('log', (log) => {
    term.write(log.join(' '))
    term.prompt()
  })

  term.on('key', function(key, ev) {
    const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;
    
    if (ev.keyCode === 13) {
      socket.emit('commandHandler', {
        commandString: digitalized,
        token: jwt
      })
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

  term.prompt()
  
  term.on('paste', function(data) {
    term.write(data);
  });
}

function runFakeTerminal() {
  if (term._initialized) {
    return;
  }
  
  term._initialized = true;
  let digitalized = '';
  
  term.writeln('Olá, seja bem-vindo(a) ao terminal da HurkitaBOT!')
  term.writeln('Aqui você pode executar comandos de forma admnistrativa.')
  term.writeln('');
  term.writeln('Digite a senha de acesso para entrar:');
  
  term.on('key', async (key, ev) => {
    if (jwt.length === 0){
      const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;
      
      if (ev.keyCode === 13) {
        
        try {
          const {data} = await axios.post('/login', {
            password: digitalized,
            socket: socket.id
          })
          
          digitalized = ''
          term.writeln('Você entrou no terminal com sucesso!');
          term.writeln('');

          jwt = data

          initializedTerminal()
        } catch (error) {
          digitalized = ''
          term.writeln('');
          term.writeln('Você errou a senha, tente novamente:');
        }

      } else if (ev.keyCode === 8) {
        if (term._core.buffer.x > 2) {
          term.write('\b \b');
        }
      } else if (printable) {
        digitalized += key
      }
    }
  });
}

runFakeTerminal();
// initializedTerminal()
