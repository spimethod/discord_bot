# Инструкции по развертыванию

## Шаг 1: Создание GitHub репозитория

1. Перейдите на [GitHub](https://github.com)
2. Нажмите "New repository"
3. Назовите репозиторий `discord-bot`
4. Выберите "Public"
5. НЕ ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license"
6. Нажмите "Create repository"

## Шаг 2: Загрузка кода в GitHub

После создания репозитория, выполните следующие команды в терминале:

```bash
# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваше имя пользователя)
git remote add origin https://github.com/YOUR_USERNAME/discord-bot.git

# Загрузите код
git push -u origin main
```

## Шаг 3: Настройка Railway

1. Перейдите на [Railway](https://railway.app/)
2. Войдите через GitHub аккаунт
3. Нажмите "New Project"
4. Выберите "Deploy from GitHub repo"
5. Найдите и выберите ваш репозиторий `discord-bot`
6. Railway автоматически определит Node.js проект и начнет деплой

## Шаг 4: Настройка переменных окружения в Railway

1. В проекте Railway перейдите в раздел "Variables"
2. Добавьте следующие переменные окружения:

```
DISCORD_TOKEN=ваш_discord_токен
TELEGRAM_BOT_TOKEN=ваш_telegram_токен
TELEGRAM_CHAT_ID=ваш_chat_id
CHANNEL_ID=id_канала_new_polymarkets
```

3. Нажмите "Save" для каждой переменной

## Шаг 5: Получение токенов

### Discord Bot Token:

1. Перейдите на [Discord Developer Portal](https://discord.com/developers/applications)
2. Создайте новое приложение
3. Перейдите в раздел "Bot"
4. Создайте бота и скопируйте токен
5. Включите интенты:
   - Server Members Intent
   - Message Content Intent
6. Добавьте бота на сервер с правами на чтение сообщений

### Telegram Bot Token:

1. Найдите @BotFather в Telegram
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте полученный токен
5. Добавьте бота в нужный чат

### Telegram Chat ID:

1. Найдите @userinfobot в Telegram
2. Отправьте любое сообщение
3. Скопируйте ваш Chat ID

### Discord Channel ID:

1. Включите Developer Mode в Discord (Настройки → Расширенные)
2. Правой кнопкой на канал → Copy ID

## Шаг 6: Проверка работы

1. После настройки всех переменных, Railway автоматически перезапустит приложение
2. Перейдите в раздел "Deployments" для просмотра логов
3. Отправьте тестовое сообщение в Discord канал
4. Проверьте, что сообщение пришло в Telegram

## Мониторинг и логи

- Логи можно просматривать в Railway Dashboard в разделе "Deployments"
- Бот логирует все события: подключение, получение сообщений, ошибки
- При ошибках проверьте все переменные окружения

## Обновление кода

Для обновления кода:

```bash
# Внесите изменения в код
git add .
git commit -m "Update description"
git push origin main
```

Railway автоматически развернет новую версию при push в main ветку.
