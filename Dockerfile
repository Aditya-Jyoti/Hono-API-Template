# Base image
FROM node:20-slim

# Install PostgreSQL
RUN apt-get update && apt-get install -y postgresql && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy app files
COPY . .

# Install app dependencies
RUN pnpm install

# Set ARG variables for build-time injection
ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB

# Set ENV variables to use these arguments at runtime
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}

# Expose necessary ports
EXPOSE 3000 5432

# Initialize PostgreSQL database and start services
CMD bash -c "\
    service postgresql start && \
    su - postgres -c \"psql -c 'CREATE DATABASE ${POSTGRES_DB}'\" && \
    su - postgres -c \"psql -c \\\"CREATE USER ${POSTGRES_USER} WITH ENCRYPTED PASSWORD '${POSTGRES_PASSWORD}'\\\"\" && \
    su - postgres -c \"psql -c 'GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER}'\" && \
    pnpm run dev"
