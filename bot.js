const TelegramBot = require('node-telegram-bot-api');
const net = require('net');
const unirest = require('unirest');

// Telegram bot token
const token = '196497098:AAF0yqiUGGm1-xQNyjbYo5qb6cpy6aEMW9E';

// AT commands
const setManualMode = 'at!comm\n';
const getData = 'at!wt\n';
const setPowerRelayOn = 'at!ac022on\n';
const setPowerRelayOff = 'at!ac022of\n';
const exit = 'at!ex\n';

const IP_01 = '10.0.11.220';
const IP_02 = '10.0.11.216';
const portAsk = 9765;
const portReceive = 9757;

// Setup Telegram bot polling way
const bot = new TelegramBot(token, { polling: true });

var id;

// If we receive any kind of message
bot.on('message', msg => {
  console.log('\nMESSAGE: ' + msg.text);
  console.log(`WHO: ${msg.from.first_name} ${msg.from.last_name} (${msg.from.username})`);

  id = msg.from.id;

  sendCommand(msg.text);

});

function sendCommand(command) {
  const socket = new net.Socket();

  socket.connect(portAsk, IP_01, () => {
    console.log('Connected');
    if (command === 'Encender') {
      socket.write(setPowerRelayOn);
    } else if (command === 'Apagar') {
      socket.write(setPowerRelayOff);
    } else if (command === 'Potencia' || command === 'Estado') {
      socket.write(getData);
    } else {
      const data = 'Por favor, dime qué quieres hacer:';
      const opts = {
        reply_markup: {
          keyboard: [
            ['Encender'], ['Apagar'],
            ['Potencia'], ['Estado'],
          ],
        },
      };

      bot.sendMessage(id, data, opts);
    }
  });

  socket.on('data', data => {
    if (!data.toString().startsWith('---')) {

      var res;

      if (command === 'Encender' || command === 'Apagar') {
        if (String(data).trim() === 'power relay: off') {
          res = 'Ahora está apagado';
        } else if (String(data).trim() === 'power relay: on') {
          res = 'Ahora está encendido';
        } else if (String(data).trim() === 'it was already on') {
          res = 'Ya estaba encendido';
        } else if (String(data).trim() === 'it was already off') {
          res = 'Ya estaba apagado';
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
    bot.sendMessage(id, 'ERROR');
    console.log('ERROR: ' + err);
  });
}

net.createServer(function (socket) {
  console.log('\nNew data!');

  socket.on('data', function (data) {
    console.log(JSON.parse(data).Plug3.Data.toString());
    const pot = JSON.parse(data).Plug3.Data.toString();

    unirest.post('http://localhost:3000/posts')
      .header('Accept', 'application/json')
      .send({ date: Date(), power: pot })
      .end(() => {
        console.log('Added new data!');
      });

    unirest.get('http://localhost:3000/posts')
      .end(response => {
        if (response.body.length > 10) {
          unirest.delete('http://localhost:3000/posts/' + response.body[0].id).end(() => {
            console.log('Data deleted!');
          });
        }
      });

  });
}).listen(portReceive);
