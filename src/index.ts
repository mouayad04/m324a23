import express from 'express';
import http from 'http';
import { Request, Response } from 'express';
import os from 'os';
import TelegramBot from 'node-telegram-bot-api';

// Create the express server
const app = express();
const server = http.createServer(app);

// route for / that returns a simple html page with the hostname
app.get('/', (req: Request, res: Response) => {
  res.send(`<h1>Hello World!</h1><p>Host: ${os.hostname()}</p>`);
});

app.get('/log/time', (req: Request, res: Response) => {
  const currentTime = new Date();
  console.log(
    `Current time is: ${
      currentTime.toLocaleDateString() + ' ' + currentTime.toLocaleTimeString()
    }`,
  );
  res.send('Current time logged to console!');
});

app.get('/healthcheck', (req: Request, res: Response) => {
  res.sendStatus(200);
});

const telegramToken = '6164202112:AAH8DVsABokEbGQH-eMhw_gmqRY8-JWsifw';
const chatId = '1663801970';
const bot = new TelegramBot(telegramToken, { polling: false });

function sendTelegramNotification() {
  const message = `ALERT: Server is not responding!`;
  bot.sendMessage(chatId, message);
}

const healthCheckInterval = 5 * 60 * 1000;
setInterval(() => {
  http
    .get(`http://localhost:${serverPort}/healthcheck`, (res) => {
      if (res.statusCode !== 200) {
        sendTelegramNotification();
      }
    })
    .on('error', () => {
      sendTelegramNotification();
    });
}, healthCheckInterval);

const serverPort = process.env.PORT || 3000;
server.listen(serverPort, () => {
  console.log(`Express Server started on port ${serverPort}`);
});
