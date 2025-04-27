# Stage 1: Build the Angular application
# Use a specific Node version matching your development environment if possible
# Check your Node version with `node -v`
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
# Use --legacy-peer-deps if you encounter peer dependency issues
RUN npm install

# Copy the rest of the application code
# This uses the .dockerignore file to exclude unnecessary files
COPY . .

# Build the application for production
# The output will be in /app/dist/resuvia based on angular.json
RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
# Use a lightweight Nginx image
FROM nginx:stable-alpine

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Remove default Nginx configuration and create necessary directories
# Ensure Nginx log/cache directories exist and are writable by the appuser
# The base nginx:alpine image might already set up some of these with appropriate permissions,
# but explicitly setting ownership is safer.
RUN rm /etc/nginx/conf.d/default.conf && \
    mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chmod -R 755 /var/cache/nginx /var/log/nginx # Ensure group can write if needed, adjust perms as necessary

# Copy the custom Nginx configuration file created earlier
# Ensure the copied config file is readable by the appuser (should be by default, but explicit ownership is safer)
COPY --chown=appuser:appgroup nginx.conf /etc/nginx/conf.d/nginx.conf

# Copy the built Angular application from the 'build' stage
# The source path matches the outputPath in angular.json
COPY --from=build /app/dist/resuvia /usr/share/nginx/html

# Change ownership of the web root directory to the non-root user
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html # Ensure files are readable

# Switch to the non-root user
USER appuser

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx when the container launches
# The 'daemon off;' directive keeps Nginx running in the foreground, which is standard for containers
CMD ["nginx", "-g", "daemon off;"]
