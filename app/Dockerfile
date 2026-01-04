FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps


FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build


FROM node:22-alpine AS prod-dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps


FROM node:22-alpine AS development
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY --from=dependencies /app/package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start:dev"]


FROM node:22-alpine AS production
RUN apk add --no-cache dumb-init curl
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001
WORKDIR /app
COPY --from=build --chown=nestjs:nodejs /app/package*.json ./
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=prod-dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules
RUN chown -R nestjs:nodejs /app
USER nestjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/external/consumers/NestAPI/main"]
