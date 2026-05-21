FROM node:18-alpine

# Install wget for health checks
RUN apk add --no-cache wget

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000
CMD ["node", "src/server.js"]
