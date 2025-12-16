# Stage 1: Build the application
FROM node:lts-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# --- NEW SECTION STARTS ---

# 1. Declare the Argument (passed from GitHub Actions)
ARG VITE_TURNSTILE_SITE_KEY
# 2. Set it as an Environment Variable so Vite can see it during build
ENV VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY

# (Optional: If you want to make API URL dynamic too)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# --- NEW SECTION ENDS ---

# Build the application
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1
CMD ["nginx", "-g", "daemon off;"]