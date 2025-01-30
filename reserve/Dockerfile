FROM node:latest

# Метаданные
LABEL version="1.0"

# Папка приложения
ARG APP_DIR=app 
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование файлов проекта
COPY . .

#Настройка для вмонтирования ссылки на папку из тома
#VOLUME [ "/volume-name:/data" ]

EXPOSE 6002

# Пермеменные окружения
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}

# Запуск проекта
CMD ["npm", "run","start"]