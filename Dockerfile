FROM node:19 AS builder
WORKDIR /app
COPY .env .
COPY . .
RUN yarn
RUN yarn prisma migrate dev
RUN yarn prisma generate
RUN yarn build

FROM node:19 
WORKDIR /app
COPY .env .

COPY ./package*.json ./
RUN yarn --production

COPY --from=builder /app/build ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
ENTRYPOINT yarn start




















