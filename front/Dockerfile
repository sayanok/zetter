FROM node:16.13.0-alpine3.12
WORKDIR /front

COPY package*.json /front

RUN npm install

COPY ./ /front

EXPOSE 3000
CMD ["npm", "start"] 
