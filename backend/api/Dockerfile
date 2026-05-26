FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

COPY app.js lib/ config/ ./

EXPOSE 4000

CMD ["node", "app.js"]
