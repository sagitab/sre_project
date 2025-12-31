# Use a slim version of Node.js
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Use environment variables for flexibility
ENV KAFKA_BROKER=kafka-broker:29092

# Start the consumer
CMD ["node", "consumer.js"]