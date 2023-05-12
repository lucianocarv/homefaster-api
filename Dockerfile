FROM node:18

WORKDIR /app
# COPY .env .
COPY ./src ./src
COPY ./prisma ./prisma
COPY ./tsconfig.json ./
COPY package*.json ./
RUN yarn
RUN yarn prisma generate
RUN yarn build
RUN ls
# COPY ./node_modules/.prisma ./node_modules/.prisma
# COPY ./node_modules/@prisma ./node_modules/@prisma
EXPOSE 3000
ENTRYPOINT yarn start:docker



















