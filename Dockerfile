FROM node:14-alpine as build

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build

ENTRYPOINT [ "npm", "start" ]
