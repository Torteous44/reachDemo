const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static('build'));

// IMPORTANT: This route needs to be last
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port); 