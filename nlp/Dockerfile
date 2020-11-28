FROM node:12
RUN apt-get update && apt-get install -y graphicsmagick
ENV DB_HOST="${DB_HOST}"
ENV	DB_NAME="${DB_NAME}"
ENV	DB_USER="${DB_USER}"
ENV	DB_PASSWORD="${DB_PASSWORD}"
ENV	PORT="${PORT}"
ENV TZ=Europe/Moscow
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install nodemon -g
RUN npm install
COPY . .
EXPOSE ${PORT}
CMD [ "npm", "start" ]