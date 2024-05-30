FROM node:16.20.2

WORKDIR /app

COPY package.json .
RUN npm install express

COPY . .

EXPOSE 3000

CMD ["node", "handle.js"]