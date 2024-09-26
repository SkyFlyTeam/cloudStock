FROM node:18-alpine3.19

WORKDIR /dist

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]