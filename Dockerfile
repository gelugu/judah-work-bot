FROM node:fermium-buster-slim as Builder

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build

ENTRYPOINT [ "npm", "start" ]
