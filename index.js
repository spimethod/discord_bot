const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const http = require('http');
require('dotenv').config();

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ] 
});

console.log('🔧 Настроенные интенты:', [
  'Guilds',
  'GuildMessages', 
  'MessageContent'
].join(', '));

// Конфигурация из переменных окружения
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const CHANNEL_ID = process.env.CHANNEL_ID || 'ID_КАНАЛА_new-polymarkets';
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Список разрешенных ботов (опционально, оставьте пустым для всех ботов)
const ALLOWED_BOTS = process.env.ALLOWED_BOTS ? process.env.ALLOWED_BOTS.split(',') : [];

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

// Keep-alive механизм для Railway
let keepAliveInterval;
const startKeepAlive = () => {
  keepAliveInterval = setInterval(() => {
    console.log('🔄 Keep-alive: бот работает...', new Date().toLocaleString('ru-RU'));
  }, 300000); // Каждые 5 минут
};

const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    console.log('Keep-alive остановлен');
  }
};

// Простой HTTP сервер для health check
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Discord Bot is running!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP сервер запущен на порту ${PORT}`);
});

// Функция для получения последних сообщений через Discord API
const getRecentMessages = async () => {
  try {
    // Получаем последние сообщения из канала напрямую через API
    const messages = await axios.get(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=10`, {
      headers: {
        'Authorization': `Bot ${DISCORD_TOKEN}`
      }
    });
    
    console.log(`📨 Получено ${messages.data.length} последних сообщений из канала ${CHANNEL_ID}`);
    
    // Обрабатываем сообщения
    for (const message of messages.data.reverse()) {
      if (message.author.username === 'PolyAlert БОТ' && message.content.includes('New Market:')) {
        console.log(`🎯 Найдено сообщение от PolyAlert БОТ: ${message.content.substring(0, 100)}...`);
        
        const text = `🔔 Новое сообщение от БОТ ${message.author.username}:\n${message.content}`;
        
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML'
        });
        
        console.log('✅ Сообщение отправлено в Telegram');
      }
    }
  } catch (error) {
    console.error('❌ Ошибка при получении сообщений через API:', error.message);
  }
};

// Обработчик новых сообщений
client.on('messageCreate', async (message) => {
  try {
    console.log(`📨 Получено сообщение: канал=${message.channelId}, автор=${message.author.username}, бот=${message.author.bot}`);
    
    // Проверяем, что сообщение из нужного канала
    if (message.channelId === CHANNEL_ID) {
      console.log(`✅ Сообщение из отслеживаемого канала!`);
      
      const authorType = message.author.bot ? 'БОТ' : 'ПОЛЬЗОВАТЕЛЬ';
      
      // Если указан список разрешенных ботов, проверяем автора
      if (message.author.bot && ALLOWED_BOTS.length > 0) {
        if (!ALLOWED_BOTS.includes(message.author.username)) {
          console.log(`❌ Сообщение от бота ${message.author.username} пропущено (не в списке разрешенных)`);
          return;
        }
      }
      
      console.log(`🎯 Обрабатываем сообщение от ${authorType} ${message.author.username}: ${message.content.substring(0, 100)}...`);
      
      const text = `🔔 Новое сообщение от ${authorType} ${message.author.username}:\n${message.content}`;
      
      // Отправляем сообщение в Telegram
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML'
      });
      
      console.log('✅ Сообщение успешно отправлено в Telegram');
    } else {
      console.log(`❌ Сообщение не из отслеживаемого канала (ожидали: ${CHANNEL_ID}, получили: ${message.channelId})`);
    }
  } catch (error) {
    console.error('❌ Ошибка при обработке сообщения:', error.message);
  }
});

// Альтернативный обработчик для всех сообщений (если основной не работает)
client.on('messageCreate', async (message) => {
  try {
    // Проверяем, что это сообщение от PolyAlert БОТ в любом канале
    if (message.author.username === 'PolyAlert БОТ' && message.content.includes('New Market:')) {
      console.log(`🎯 Найдено сообщение от PolyAlert БОТ в канале ${message.channelId}: ${message.content.substring(0, 100)}...`);
      
      const text = `🔔 Новое сообщение от БОТ ${message.author.username}:\n${message.content}`;
      
      // Отправляем сообщение в Telegram
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML'
      });
      
      console.log('✅ Сообщение от PolyAlert БОТ отправлено в Telegram');
    }
  } catch (error) {
    console.error('❌ Ошибка при обработке альтернативного сообщения:', error.message);
  }
});

// Обработчик готовности бота
client.on('ready', async () => {
  console.log(`Бот ${client.user.tag} успешно запущен!`);
  console.log(`Отслеживаемый канал: ${CHANNEL_ID}`);
  
  // Проверяем доступ к каналу
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (channel) {
      console.log(`✅ Канал найден: ${channel.name} (${channel.type})`);
      console.log(`📊 Права бота в канале: ${channel.permissionsFor(client.user).toArray().join(', ')}`);
    } else {
      console.log(`❌ Канал с ID ${CHANNEL_ID} не найден`);
    }
  } catch (error) {
    console.error(`❌ Ошибка при проверке канала: ${error.message}`);
    console.log(`⚠️ Бот будет продолжать работу, но может не получать сообщения из канала ${CHANNEL_ID}`);
    console.log(`🔧 Убедитесь, что бот добавлен на сервер и имеет права на чтение канала`);
  }
  
  // Запускаем keep-alive механизм
  startKeepAlive();
  console.log('Keep-alive механизм запущен');
  
  // Запускаем мониторинг через Discord API
  console.log('🔄 Запуск мониторинга через Discord API...');
  getRecentMessages();
  
  // Проверяем новые сообщения каждые 30 секунд
  setInterval(getRecentMessages, 30000);
  console.log('✅ Мониторинг через Discord API запущен (проверка каждые 30 секунд)');
  
  // Отправляем уведомление в Telegram о запуске бота
  try {
    const startupMessage = `🚀 Discord бот успешно запущен!\n\n📋 Информация:\n• Бот: ${client.user.tag}\n• Канал: ${CHANNEL_ID}\n• Время запуска: ${new Date().toLocaleString('ru-RU')}\n\n✅ Бот готов к работе и отслеживает сообщения!`;
    
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: startupMessage,
      parse_mode: 'HTML'
    });
    
    console.log('Уведомление о запуске отправлено в Telegram');
  } catch (error) {
    console.error('Ошибка при отправке уведомления о запуске в Telegram:', error.message);
  }
});

// Обработчик ошибок
client.on('error', (error) => {
  console.error('Ошибка Discord клиента:', error);
});

// Обработчик переподключения
client.on('reconnecting', () => {
  console.log('Переподключение к Discord...');
});

// Обработчик восстановления соединения
client.on('resume', async (replayed) => {
  console.log(`Соединение восстановлено. Переиграно ${replayed} событий.`);
  
  // Отправляем уведомление о восстановлении соединения
  try {
    const reconnectMessage = `🔄 Соединение с Discord восстановлено!\n\n⏰ Время: ${new Date().toLocaleString('ru-RU')}\n📊 Переиграно событий: ${replayed}\n\n✅ Бот снова работает!`;
    
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: reconnectMessage,
      parse_mode: 'HTML'
    });
    
    console.log('Уведомление о восстановлении соединения отправлено в Telegram');
  } catch (error) {
    console.error('Ошибка при отправке уведомления о восстановлении в Telegram:', error.message);
  }
});

// Обработчик всех событий для диагностики
client.on('raw', (packet) => {
  if (packet.t === 'MESSAGE_CREATE') {
    console.log(`🔍 Raw MESSAGE_CREATE событие получено: канал=${packet.d.channel_id}`);
  }
});

// Обработчик подключения к серверу
client.on('guildCreate', (guild) => {
  console.log(`📥 Бот добавлен на сервер: ${guild.name} (${guild.id})`);
});

// Обработчик удаления с сервера
client.on('guildDelete', (guild) => {
  console.log(`📤 Бот удален с сервера: ${guild.name} (${guild.id})`);
});

// Обработчик завершения процесса
process.on('SIGINT', async () => {
  console.log('Получен сигнал SIGINT, завершение работы бота...');
  stopKeepAlive();
  try {
    await client.destroy();
    console.log('Бот успешно отключен');
  } catch (error) {
    console.error('Ошибка при отключении бота:', error);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Получен сигнал SIGTERM, завершение работы бота...');
  stopKeepAlive();
  try {
    await client.destroy();
    console.log('Бот успешно отключен');
  } catch (error) {
    console.error('Ошибка при отключении бота:', error);
  }
  process.exit(0);
});

// Обработчик необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('Необработанное исключение:', error);
  // Не завершаем процесс, даем возможность восстановиться
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Необработанное отклонение промиса:', reason);
  // Не завершаем процесс, даем возможность восстановиться
});

// Подключение к Discord
client.login(DISCORD_TOKEN).catch((error) => {
  console.error('Ошибка при подключении к Discord:', error);
  process.exit(1);
}); 