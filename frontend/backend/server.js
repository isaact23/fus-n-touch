const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;
  try {
    const response = await fetch(imageUrl);
    const imageBuffer = await response.buffer();
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (err) {
    res.status(500).send('Error fetching image');
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on port 3001');
});
