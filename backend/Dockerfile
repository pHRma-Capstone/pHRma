FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
