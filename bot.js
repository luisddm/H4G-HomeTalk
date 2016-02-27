const TelegramBot = require('node-telegram-bot-api');
const net = require('net');
const unirest = require('unirest');

// Telegram bot token
const token = '196497098:AAF0yqiUGGm1-xQNyjbYo5qb6cpy6aEMW9E';

// AT commands
const getData = 'at!wt\n';
const setPowerRelayOn = 'at!ac022on\n';
const setPowerRelayOff = 'at!ac022of\n';

const IP_01 = '10.0.11.220';
const IP_02 = '10.0.11.216';

const clientPort = 9765;
const serverPort = 9757;

// Setup Telegram bot polling way
const bot = new TelegramBot(token, { polling: true });

var id;

// When the bot receives any kind of message
bot.on('message', msg => {
  console.log('\nMESSAGE: ' + msg.text);
  console.log(`WHO: ${msg.from.first_name} ${msg.from.last_name} (${msg.from.username})`);

  id = msg.from.id;

  sendCommand(msg.text);
});

function sendCommand(command) {
  const socket = new net.Socket();

  socket.connect(clientPort, IP_01, () => {
    console.log('Connected');

    if (command === 'Encender') {
      socket.write(setPowerRelayOn);

    } else if (command === 'Apagar') {
      socket.write(setPowerRelayOff);

    } else if (command === 'Potencia' || command === 'Estado') {
      socket.write(getData);

    } else {
      const messageOpts = {
        reply_markup: {
          keyboard: [
            ['Encender', 'Apagar'],
            ['Potencia', 'Estado'],
          ],
        },
      };

      bot.sendMessage(id, 'Por favor, dime qué quieres hacer:', messageOpts);
    }
  });

  socket.on('data', data => {
    // Ignore the welcome message
    if (!data.toString().startsWith('---')) {

      var res;
      const adaptedData = String(data).trim();

      if (command === 'Encender' || command === 'Apagar') {
        if (adaptedData === 'power relay: off') {
          res = 'Ahora está apagado';

        } else if (adaptedData === 'power relay: on') {
          res = 'Ahora está encendido';

        } else if (adaptedData === 'it was already off') {
          res = 'Ya estaba apagado';

        } else if (adaptedData === 'it was already on') {
          res = 'Ya estaba encendido';
        }

      } else if (command === 'Potencia') {
        res = JSON.parse(data.toString().substring(60, data.length - 3))[1].text + ' w';

      } else if (command === 'Estado') {
        res = JSON.parse(data.toString().substring(60, data.length - 3))[0].text > 0 ? 'Encendido' : 'Apagado';
      }

      console.log('RESPONSE: ' + res);

      bot.sendMessage(id, res).then(() => {
        socket.destroy(); // kill client after server's response
      });

    } else {
      // Show this instead of the welcome message
      console.log('Hello!');
    }

  });

  socket.on('close', () => {
    console.log('Connection closed');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

  socket.on('error', (err) => {
    bot.sendMessage(id, '¡Se ha producido un error! :(');
    console.log('ERROR: ' + err);
  });
}

net.createServer(socket => {
  console.log('\nGot new data from the device!');

  socket.on('data', data => {
    console.log(JSON.parse(data).Plug3.Data.toString());
    const pot = JSON.parse(data).Plug3.Data.toString();
    const status = JSON.parse(data).Plug0.Data.toString();

    unirest.post('http://localhost:3000/data')
      .header('Accept', 'application/json')
      .send({ date: Date(), power: pot, status: status > 0 ? true : false })
      .end(() => {
        console.log('Added new data');
      });

    unirest.get('http://localhost:3000/data')
      .end(response => {
        if (response.body.length > 10) {
          unirest.delete('http://localhost:3000/data/' + response.body[0].id).end(() => {
            console.log('Removed old data');
          });
        }
      });

  });
}).listen(serverPort);
