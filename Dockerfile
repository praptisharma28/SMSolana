FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache \
    curl \
    bash \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN addgroup -g 1001 -S nodejs && \
    adduser -S smsbot -u 1001 -G nodejs
RUN chown -R smsbot:nodejs /app
USER smsbot
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
