FROM node:18-alpine3.18
RUN apk update && apk add --no-cache build-base libtool autoconf automake
WORKDIR /usr/app
COPY package*.json ./
RUN npm install 
COPY . ./
CMD ["npm", "run", "dev"]