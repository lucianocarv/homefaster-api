FROM node:18

WORKDIR /app
COPY /build ./
COPY .env .env
COPY package*.json ./
RUN yarn
COPY prisma prisma
RUN npx prisma migrate dev
COPY ./node_modules/.prisma ./node_modules/.prisma
COPY ./node_modules/@prisma/client ./node_modules/@prisma/client
EXPOSE 3000
ENTRYPOINT yarn start


























