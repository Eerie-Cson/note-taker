# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 3200

CMD ["npm", "run", "start"]
