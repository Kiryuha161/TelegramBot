FROM node:20.14-slim

WORKDIR /app

COPY package.json .
RUN npm install express

COPY . .

EXPOSE 3050

CMD ["node", "handle.js"]