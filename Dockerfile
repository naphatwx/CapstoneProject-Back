# Use the official Node.js 22 image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker's layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including development dependencies for building the app)
RUN npm install

# Copy the rest of the application files into the container (including the 'start/' directory)
COPY . .

# Run the AdonisJS build step to generate the 'build' folder
RUN npm run build

# Ensure the '.env' file is copied into the container
COPY .env build/

# Copy the startup script to the build directory
COPY start.sh build/
RUN chmod +x build/start.sh

WORKDIR /app/build

RUN npm ci --omit="dev"

# Expose the port that the API will run on (AdonisJS defaults to port 3333)
EXPOSE 3333

# Start the application using the compiled server.js from the build directory
# CMD ["node", "bin/server.js"]

# Use the startup script to run both the scheduler and server
CMD ["./start.sh"]
