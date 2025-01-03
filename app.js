const express = require('express');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();

// Setup SQLite3 database
const db = new sqlite3.Database('./videos.db');

// Middleware to parse JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up EJS view engine
app.set('view engine', 'ejs');

// Serve static files like CSS, JS
app.use(express.static(path.join(__dirname, 'public')));

// Ensure the database and table exist
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS videos (id INTEGER PRIMARY KEY, video_id TEXT, title TEXT, stream_url TEXT)");
});

// Route for Home page
app.get('/', (req, res) => {
  db.all("SELECT * FROM videos", (err, rows) => {
    if (err) {
      console.error('Error retrieving videos:', err);
      return res.status(500).send('Internal server error');
    }
    res.render('index', { videos: rows });
  });
});

// Route for adding a new video
app.post('/add', (req, res) => {
  const { video_id, title } = req.body;
  const videoUrl = `https://www.youtube.com/live/${video_id}`;  // Updated YouTube live URL format

  exec(`yt-dlp -f bestvideo+bestaudio --get-url ${videoUrl}`, (err, stdout, stderr) => {
    if (err) {
      console.error('Error fetching stream URL:', err);
      return res.status(500).send('Error fetching stream URL');
    }

    const streamUrl = stdout.trim();
    db.run("INSERT INTO videos (video_id, title, stream_url) VALUES (?, ?, ?)", [video_id, title, streamUrl], (err) => {
      if (err) {
        console.error('Error inserting video:', err);
        return res.status(500).send('Error adding video');
      }
      res.redirect('/');
    });
  });
});

// Route for streaming the video
app.get('/:videoId.m3u8', (req, res) => {
  const videoId = req.params.videoId;
  
  db.get("SELECT stream_url FROM videos WHERE video_id = ?", [videoId], (err, row) => {
    if (err || !row) {
      return res.status(404).send('Video not found');
    }

    const streamUrl = row.stream_url;
    
    // Proxy the HLS stream
    exec(`curl -s ${streamUrl}`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error fetching stream:', err);
        return res.status(500).send('Error streaming video');
      }
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.send(stdout);
    });
  });
});

// Route for deleting a video
app.get('/delete/:videoId', (req, res) => {
  const videoId = req.params.videoId;
  db.run("DELETE FROM videos WHERE video_id = ?", [videoId], (err) => {
    if (err) {
      console.error('Error deleting video:', err);
      return res.status(500).send('Error deleting video');
    }
    res.redirect('/');
  });
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Embed HTML (index.ejs)
app.get('/index', (req, res) => {
  res.render('index');
});

// EJS Template for Web Panel (HTML and CSS)
app.set('views', path.join(__dirname, 'views'));
app.get('/views/index.ejs', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>YouTube Video Stream Manager</title>
      <style>
      /* General Reset */
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
      }
      /* Basic Body and Layout Styles */
      body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          color: #333;
      }
      header {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 20px;
      }
      h1 {
          font-size: 2em;
      }
      /* Main Section Styling */
      main {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
      }
      /* Form Section */
      .form-section {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .form-section h2 {
          font-size: 1.5em;
          margin-bottom: 10px;
      }
      input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
      }
      button {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          font-size: 1em;
      }
      button:hover {
          background-color: #45a049;
      }
      /* Video Table Section */
      .videos-section {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .videos-section h2 {
          font-size: 1.5em;
          margin-bottom: 10px;
      }
      table {
          width: 100%;
          border-collapse: collapse;
      }
      th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
      }
      th {
          background-color: #f2f2f2;
      }
      tr:hover {
          background-color: #f1f1f1;
      }
      .action-btn {
          background-color: #4CAF50;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          text-decoration: none;
          margin-right: 10px;
      }
      .action-btn:hover {
          background-color: #45a049;
      }
      .delete-btn {
          background-color: #f44336;
      }
      .delete-btn:hover {
          background-color: #e53935;
      }
      /* Footer Section */
      footer {
          background-color: #333;
          color: white;
          text-align: center;
          padding: 15px;
          position: fixed;
          bottom: 0;
          width: 100%;
          font-size: 0.9em;
      }
      /* Media Queries for Responsiveness */
      @media (max-width: 768px) {
          main {
              padding: 15px;
          }
          .form-section, .videos-section {
              padding: 15px;
          }
          input, button {
              font-size: 0.9em;
          }
          table {
              font-size: 0.9em;
          }
          footer {
              font-size: 0.8em;
          }
      }
      </style>
  </head>
  <body>
      <header>
          <h1>YouTube Video Stream Manager</h1>
      </header>
  
      <main>
          <!-- Form to Add Video -->
          <section class="form-section">
              <h2>Add New Video</h2>
              <form action="/add" method="POST">
                  <label for="video_id">YouTube Video ID:</label>
                  <input type="text" id="video_id" name="video_id" placeholder="Enter YouTube Video ID" required>
  
                  <label for="title">Video Title:</label>
                  <input type="text" id="title" name="title" placeholder="Enter Video Title" required>
  
                  <button type="submit">Add Video</button>
              </form>
          </section>
  
          <!-- List of Videos -->
          <section class="videos-section">
              <h2>Video Library</h2>
              <table>
                  <thead>
                      <tr>
                          <th>Title</th>
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      <% videos.forEach(video => { %>
                      <tr>
                          <td><%= video.title %></td>
                          <td>
                              <a href="/<%= video.video_id %>.m3u8" class="action-btn">Stream</a>
                              <a href="/delete/<%= video.video_id %>" class="action-btn delete-btn">Delete</a>
                          </td>
                      </tr>
                      <% }); %>
                  </tbody>
              </table>
          </section>
      </main>
  
      <footer>
          <p>&copy; 2025 Video Stream Manager | All rights reserved.</p>
      </footer>
  </body>
  </html>
  `);
});
