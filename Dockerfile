# Use a Node.js LTS (Long Term Support) version as the base image
FROM node:lts-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the app's dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 5000 for the app
EXPOSE 5000

# Set the command to start the app
CMD ["npm", "start"]
