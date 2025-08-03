const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ] 
});

// Конфигурация из переменных окружения
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const CHANNEL_ID = process.env.CHANNEL_ID || 'ID_КАНАЛА_new-polymarkets';

// Проверка наличия необходимых переменных окружения
if (!DISCORD_TOKEN) {
  console.error('Ошибка: DISCORD_TOKEN не установлен в переменных окружения');
  process.exit(1);
}

if (!TELEGRAM_BOT_TOKEN) {
  console.error('Ошибка: TELEGRAM_BOT_TOKEN не установлен в переменных окружения');
  process.exit(1);
}

if (!TELEGRAM_CHAT_ID) {
  console.error('Ошибка: TELEGRAM_CHAT_ID не установлен в переменных окружения');
  process.exit(1);
}

console.log('Discord бот запускается...');

// Обработчик новых сообщений
client.on('messageCreate', async (message) => {
  try {
    // Проверяем, что сообщение из нужного канала и не от бота
    if (message.channelId === CHANNEL_ID && !message.author.bot) {
      console.log(`Новое сообщение от ${message.author.username}: ${message.content}`);
      
      const text = `🔔 Новое сообщение:\n${message.content}`;
      
      // Отправляем сообщение в Telegram
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML'
      });
      
      console.log('Сообщение успешно отправлено в Telegram');
    }
  } catch (error) {
    console.error('Ошибка при обработке сообщения:', error.message);
  }
});

// Обработчик готовности бота
client.on('ready', () => {
  console.log(`Бот ${client.user.tag} успешно запущен!`);
  console.log(`Отслеживаемый канал: ${CHANNEL_ID}`);
});

// Обработчик ошибок
client.on('error', (error) => {
  console.error('Ошибка Discord клиента:', error);
});

// Обработчик завершения процесса
process.on('SIGINT', () => {
  console.log('Завершение работы бота...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Завершение работы бота...');
  client.destroy();
  process.exit(0);
});

// Подключение к Discord
client.login(DISCORD_TOKEN).catch((error) => {
  console.error('Ошибка при подключении к Discord:', error);
  process.exit(1);
}); 