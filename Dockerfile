# FROM node:14.10.1 As development
FROM node:14.10.1 As development

WORKDIR /app

# Used only by streamer
# RUN apt-get update && apt-get install -y ffmpeg

COPY *.json /app/
RUN npm install

COPY src /app/src
COPY public /app/public
COPY *.json /app/
COPY *.js /app/

RUN npm run build

CMD ["npm", "run", "start"]

# CMD ["npm", "run", "dev"]
