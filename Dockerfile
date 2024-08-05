# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application’s code to the working directory
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port that your app will run on
EXPOSE 3200

# Define the command to run your app
CMD ["npm", "run", "start:prod"]
