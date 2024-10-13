# Используем официальный образ Node.js
FROM node:14

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

RUN mkdir -p /app/uploads/images

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

RUN npm install bcryptjs

RUN npm install multer

RUN npm install sequelize sequelize-cli mysql2

# Копируем все остальные файлы проекта в контейнер
COPY . .

# Открываем порт для приложения
EXPOSE 3000

# Запускаем сервер приложения
CMD ["node", "server.js"]

