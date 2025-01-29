FROM node:18 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY credentials.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/credentials.json ./ 

CMD ["node", "dist/main.js"]