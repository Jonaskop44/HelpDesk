# Install dependencies only when needed
# Stage 0
FROM node:26-alpine AS deps
WORKDIR /app

COPY package.json ./
COPY prisma ./prisma
COPY prisma7.config.ts ./prisma7.config.ts

RUN npm install
#############################################

# Rebuild the source code only when needed
# Stage 1
FROM node:26-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npx prisma generate
RUN npm run build
#############################################

# Production image, copy only production files
# Stage 2
FROM node:26-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma7.config.ts ./prisma7.config.ts

COPY wait-for-db.sh ./wait-for-db.sh
RUN chmod +x ./wait-for-db.sh

EXPOSE 4000

CMD ["./wait-for-db.sh", "helpdesk-db", "sh", "-c", "npx prisma migrate deploy && npm run start:prod"]