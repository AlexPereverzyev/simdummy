FROM node:10-alpine3.9

WORKDIR /simdummy

COPY . .

RUN npm install

EXPOSE 9999

CMD ["npm", "start"]
