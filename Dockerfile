FROM node:18

WORKDIR /app
COPY /build ./
COPY .env .
COPY package*.json ./
RUN yarn
COPY ./node_modules/.prisma ./node_modules/.prisma
COPY ./node_modules/@prisma ./node_modules/@prisma
EXPOSE 3000
ENTRYPOINT yarn start



















