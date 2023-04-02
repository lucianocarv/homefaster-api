FROM node:18
WORKDIR /app
COPY /dist ./
COPY .env ./
COPY package*.json ./
RUN npm install --omit=dev
COPY ./node_modules/.prisma ./node_modules/.prisma
COPY ./node_modules/@prisma/client ./node_modules/@prisma/client
EXPOSE 3000
EXPOSE 50021
ENTRYPOINT npm start


























