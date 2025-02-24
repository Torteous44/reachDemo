const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static('build'));

// Handle ALL requests
app.get('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port); 