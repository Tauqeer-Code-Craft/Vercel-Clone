FROM node:20-slim

WORKDIR /app

# Install Git
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Use non-root user (optional for security)
RUN useradd -m appuser
USER appuser
