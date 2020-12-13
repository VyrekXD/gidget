FROM node:15-alpine
WORKDIR /home/gidget
ENV CHROME_BIN="/usr/bin/chromium-browser"
ENV NODE_ENV="production"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
# See below
RUN apk add --no-cache curl bash
# Commands => qr, record
RUN apk add --no-cache libqrencode lame
# Build C++/Python addons (Canvas, gifsicle, @discordjs/opus)
RUN apk add --no-cache build-base g++ autoconf automake libtool
# Any Canvas command (only node.js versions where binary Canvas is not available)
RUN apk add --no-cache libpng libpng-dev jpeg-dev pango-dev cairo-dev giflib-dev
# screenshot command
RUN set -x \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium
# Making free space
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
# Installing project dependencies
COPY package.json .
RUN npm i -g npm@6.14.8
RUN npm install --only=production
# Free space
RUN /usr/local/bin/node-prune
RUN apk del --no-cache build-base autoconf automake libtool make gcc g++ python binutils-gold gnupg libstdc++ curl bash libpng libpng-dev jpeg-dev pango-dev cairo-dev \
    && rm -rf /usr/include \
    && rm -rf /var/cache/apk/* /usr/share/man /tmp/*
# Copying bot code
COPY . .
# Exposing private API
ENV PORT=8080
EXPOSE 8080
# CMD ["node", "--experimental-json-modules", "."]
CMD ["npm", "start"]
