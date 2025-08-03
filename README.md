# Discord Bot для мониторинга канала

Этот Discord бот отслеживает сообщения в определенном канале и пересылает их в Telegram.

## Функциональность

- Отслеживает сообщения в указанном Discord канале
- Пересылает новые сообщения в Telegram чат
- Обрабатывает ошибки и логирует события
- Готов к развертыванию на Railway

## Настройка

### 1. Создание Discord бота

1. Перейдите на [Discord Developer Portal](https://discord.com/developers/applications)
2. Создайте новое приложение
3. Перейдите в раздел "Bot"
4. Создайте бота и скопируйте токен
5. Включите следующие интенты:
   - Server Members Intent
   - Message Content Intent
6. Добавьте бота на ваш сервер с правами на чтение сообщений

### 2. Создание Telegram бота

1. Найдите @BotFather в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям и получите токен бота
4. Добавьте бота в нужный чат
5. Получите Chat ID (можно использовать @userinfobot)

### 3. Получение ID Discord канала

1. Включите режим разработчика в Discord (Настройки → Расширенные → Developer Mode)
2. Правой кнопкой мыши нажмите на нужный канал
3. Выберите "Copy ID"

## Переменные окружения

Создайте файл `.env` на основе `env.example`:

```env
DISCORD_TOKEN=your_discord_bot_token_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
CHANNEL_ID=your_discord_channel_id_here
```

## Локальная разработка

1. Установите зависимости:

```bash
npm install
```

2. Создайте файл `.env` с вашими токенами

3. Запустите бота:

```bash
npm start
```

Для разработки с автоматической перезагрузкой:

```bash
npm run dev
```

## Развертывание на Railway

### 1. Подготовка репозитория

1. Создайте репозиторий на GitHub
2. Загрузите код в репозиторий:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/discord-bot.git
git push -u origin main
```

### 2. Настройка Railway

1. Перейдите на [Railway](https://railway.app/)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите "Deploy from GitHub repo"
5. Выберите ваш репозиторий
6. Railway автоматически определит Node.js проект

### 3. Настройка переменных окружения

1. В проекте Railway перейдите в раздел "Variables"
2. Добавьте все необходимые переменные окружения:
   - `DISCORD_TOKEN`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `CHANNEL_ID`

### 4. Деплой

Railway автоматически развернет приложение при каждом push в main ветку.

## Мониторинг

Бот логирует следующие события:

- Запуск и подключение к Discord
- Получение новых сообщений
- Успешная отправка в Telegram
- Ошибки при обработке

Логи можно просматривать в Railway Dashboard в разделе "Deployments".

## Структура проекта

```
discord-bot/
├── index.js          # Основной файл бота
├── package.json      # Зависимости и скрипты
├── env.example       # Пример переменных окружения
├── .gitignore        # Исключения для Git
└── README.md         # Документация
```

## Устранение неполадок

### Бот не отвечает на сообщения

- Проверьте, что бот добавлен на сервер
- Убедитесь, что включены правильные интенты
- Проверьте ID канала

### Сообщения не отправляются в Telegram

- Проверьте токен Telegram бота
- Убедитесь, что бот добавлен в чат
- Проверьте Chat ID

### Ошибки при деплое

- Проверьте все переменные окружения в Railway
- Убедитесь, что Node.js версия >= 18.0.0
- Проверьте логи в Railway Dashboard
