# Use the official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all your project files (including server.js, public/, and db/)
COPY . .

# Your app runs on port 3000
EXPOSE 3001

CMD [ "npm", "start" ]