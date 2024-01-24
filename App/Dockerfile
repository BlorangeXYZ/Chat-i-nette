# Install dependencies only when needed
FROM node:16-alpine AS builder
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat make g++ python3
RUN ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Copy all files
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create nextjs user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change to non-root privilege
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app ./

CMD ["yarn", "start"]