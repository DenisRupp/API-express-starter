# our base image
FROM node:12.13-alpine

# specify the port number the container should expose
EXPOSE 8000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
RUN npm install pm2 -g
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile
ADD . /app
RUN cp /app/.env.example /app/.env
RUN cp /app/src/database/config.example.js  /app/src/database/config.js

# run the application
CMD ["pm2-runtime", "start", "ecosystem.config.js --env=development"]
