FROM node:16-slim

WORKDIR /src

COPY package.json package-lock.json  yarn.lock /src/

RUN  npm ci --silent; npm install

COPY . .

CMD npm run start