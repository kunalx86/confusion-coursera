# Stage one, building the app (TS -> JS)
FROM node:14.17.0

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

# Stage Two, actually running the code
FROM node:14.17.0

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

COPY env ./env

RUN yarn --production

COPY --from=0 /usr/src/app/dist ./dist

EXPOSE 8080

CMD yarn start