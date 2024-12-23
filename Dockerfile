# Base image
FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy app files
COPY . .

# Install app dependencies
RUN pnpm install

# Build the app (using TypeScript compiler)
RUN pnpm run build

# Expose necessary ports
EXPOSE 3000

# Command to run the app in production mode
CMD ["pnpm", "run", "start"]
