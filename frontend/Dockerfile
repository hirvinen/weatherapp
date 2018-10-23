# Start from the slimmer alpine variant of node
FROM node:alpine

# Cache node_modules as long as package.json is unchanged
WORKDIR /tmp
COPY package.json /tmp/
RUN npm install && mkdir /app && cp -a /tmp/node_modules /app/

WORKDIR /app

COPY . /app

#RUN npm install
CMD npm run start
