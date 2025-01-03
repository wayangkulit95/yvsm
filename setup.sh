#!/bin/bash

# Ensure the script is being run as a non-root user with sudo access
if [ "$(id -u)" -eq 0 ]; then
    echo "This script should not be run as root. Please run it as a regular user."
    exit 1
fi

# Update package list
echo "Updating package list..."
sudo apt-get update -y

# Install Node.js and npm (if not already installed)
echo "Checking for Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Node.js not found, installing Node.js and npm..."
    # Install Node.js (LTS version recommended)
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed."
fi

# Install FFmpeg (required for stream conversion)
echo "Checking for FFmpeg installation..."
if ! command -v ffmpeg &> /dev/null; then
    echo "FFmpeg not found, installing FFmpeg..."
    sudo apt-get install -y ffmpeg
else
    echo "FFmpeg is already installed."
fi

# Install dependencies for the Node.js project
echo "Installing Node.js dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Node.js dependencies are already installed."
fi

# Check if the `streams` directory exists, if not, create it
if [ ! -d "streams" ]; then
    echo "Creating 'streams' directory to store live streams..."
    mkdir streams
else
    echo "'streams' directory already exists."
fi

# Install http-proxy-middleware (if it's not already installed)
echo "Ensuring http-proxy-middleware is installed..."
npm install http-proxy-middleware

# Success message
echo "Setup is complete! You can now start the server with 'node app.js'."

# Display instructions for starting the server
echo ""
echo "To start the server:"
echo "1. Run: node app.js"
echo "2. Open your browser and go to http://localhost:3000 to manage streams."
