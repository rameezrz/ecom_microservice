FROM node:16.9.0-alpine
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm i -g nodemon
CMD [ "nodemon", "main.js" ]