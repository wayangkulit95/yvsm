#!/bin/bash

# Update package list
echo "Updating package list..."
sudo apt-get update

# Install Node.js and npm if not already installed
echo "Installing Node.js and npm..."
sudo apt-get install -y nodejs npm

# Install yt-dlp (for video streaming)
echo "Installing yt-dlp..."
sudo apt-get install -y yt-dlp

# Install SQLite3 if not already installed
echo "Installing SQLite3..."
sudo apt-get install -y sqlite3

# Install project dependencies
echo "Installing Node.js dependencies..."
npm install

# Set up the SQLite3 database
echo "Setting up the SQLite database..."
if [ ! -f ./videos.db ]; then
  sqlite3 videos.db "CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY, video_id TEXT, title TEXT, stream_url TEXT);"
  echo "Database created successfully."
else
  echo "Database already exists."
fi

# Start the server
echo "Starting the server..."
npm start

echo "Setup completed successfully."
