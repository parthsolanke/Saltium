FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN mkdir -p logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

CMD ["npm", "start"]
