const express = require('express');
const path = require('path');
const app = express();

// First, serve any static files
app.use(express.static(path.join(__dirname, 'build')));

// Then, handle ALL routes by serving index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`)); 