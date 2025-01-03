# YouTube Video Stream Manager

This is a simple web application for managing and streaming YouTube videos (live streams). It allows you to add YouTube video IDs and stream them using `yt-dlp` for extraction and streaming in M3U8 format.

## Prerequisites

Before you begin, ensure that you have the following installed on your machine:

- **Node.js** (version 14.x or later)
- **npm** (Node Package Manager)
- **yt-dlp** (for fetching YouTube live stream URLs)
- **SQLite3** (for database storage)

## Installation

### 1. Clone the repository:

     curl -O https://raw.githubusercontent.com/wayangkulit95/yvsm/refs/heads/main/setup.sh



## 2. Run the setup script:
The setup.sh script will install all the necessary dependencies and set up the environment for you. It will also create the SQLite3 database.

    ```
chmod +x setup.sh
./setup.sh
 
This will do the following:

- Install required packages like nodejs, npm, yt-dlp, and sqlite3.
- Install project dependencies using npm install.
- Set up the SQLite3 database.
- Start the server.

### 3. Running the server
Once the setup is complete, the server will automatically start. You can access the web panel at:

    ```
http://localhost:8080

# Usage
# Adding a Video
To add a YouTube live stream, simply go to the home page and enter the Video ID (the unique part after https://www.youtube.com/live/).

Example:

- YouTube live stream URL: https://www.youtube.com/live/JDfOCmvaO6k
- Enter JDfOCmvaO6k as the Video ID.
# Streaming a Video
- Once a video is added, you can stream it by clicking the Stream button next to the video. This will open a stream player in your browser.

# Deleting a Video
You can also delete any video by clicking the Delete button next to the video.

# Development
To develop or modify the application, you can make changes to the following files:

- app.js: Main application logic (Express routes, SQLite3 integration).
- views/index.ejs: Front-end HTML structure (view template).
- public/: Static files such as CSS and client-side JS.
- After making changes, you can restart the server with:
  ```
npm start

# License
This project is licensed under the MIT License 


















