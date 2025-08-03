#!/bin/bash

echo "🚀 Настройка Discord Bot для Railway"
echo "=================================="

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js версии 18 или выше."
    exit 1
fi

echo "✅ Node.js найден: $(node --version)"

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Зависимости установлены успешно"
else
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "📝 Создание .env файла..."
    cp env.example .env
    echo "✅ Файл .env создан. Отредактируйте его с вашими токенами."
else
    echo "✅ Файл .env уже существует"
fi

echo ""
echo "🎯 Следующие шаги:"
echo "1. Отредактируйте файл .env с вашими токенами"
echo "2. Создайте репозиторий на GitHub"
echo "3. Выполните: git remote add origin https://github.com/YOUR_USERNAME/discord-bot.git"
echo "4. Выполните: git push -u origin main"
echo "5. Настройте проект на Railway"
echo ""
echo "📖 Подробные инструкции в файле DEPLOYMENT.md" 