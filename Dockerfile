# Install dependencies only when needed
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*
WORKDIR /app
COPY package.json yarn.lock ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN yarn install --frozen-lockfile

# If using npm with a `package-lock.json` comment out above and use below instead
# COPY package.json package-lock.json ./ 
# RUN npm ci

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV production

RUN apk update \
  && apk add openssl-dev --no-cache \
  && apk --no-cache add curl \
  && apk --no-cache add chromium

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "start"]
