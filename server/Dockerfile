@ -0,0 +1,19 @@
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

RUN npm run build

CMD ["npm", "run", "initialize-db"]

EXPOSE 5000

CMD ["npm", "start"]