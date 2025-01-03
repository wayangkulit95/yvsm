#!/bin/bash

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

# Check if package.json exists, if not, create it with default values
if [ ! -f "package.json" ]; then
    echo "Creating package.json file..."
    npm init -y
else
    echo "package.json already exists."
fi

# Install required Node.js dependencies
echo "Installing required Node.js dependencies..."
npm install express http-proxy-middleware

# Check if the `streams` directory exists, if not, create it
if [ ! -d "streams" ]; then
    echo "Creating 'streams' directory to store live streams..."
    mkdir streams
else
    echo "'streams' directory already exists."
fi

# Success message
echo "Setup is complete! You can now start the server with 'node app.js'."

# Display instructions for starting the server
echo ""
echo "To start the server:"
echo "1. Run: node app.js"
echo "2. Open your browser and go to http://localhost:3000 to manage streams."
