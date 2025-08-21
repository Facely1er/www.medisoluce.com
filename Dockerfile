# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Production stage
FROM nginx:1.27-alpine AS runner
# Configure nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html
# Ensure non-root usage (nginx runs as nginx user in alpine image)
EXPOSE 8080
CMD ["/bin/sh", "-c", "sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]