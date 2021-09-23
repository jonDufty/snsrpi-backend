FROM node:14-alpine
WORKDIR /app
COPY ./app/package*.json ./
RUN npm install

COPY /app .
EXPOSE 8000
# ENV NODE_ENV=production
CMD ["npm", "start"]