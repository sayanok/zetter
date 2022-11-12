FROM node:16.13.0-alpine3.12
WORKDIR /api

COPY package*.json /api
RUN npm install

COPY prisma /api/prisma
RUN npx prisma generate

COPY ./ /api

EXPOSE 5000
CMD ["npx", "tsnd", "--exit-child","app.ts"]