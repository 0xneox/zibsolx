const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Jupiter API proxy
app.get('/api/jupiter/*', async (req, res) => {
  try {
    const jupiterUrl = `https://price.jup.ag/v4${req.path.replace('/api/jupiter', '')}`;
    const response = await axios.get(jupiterUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Jupiter API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Birdeye API proxy
app.get('/api/birdeye/*', async (req, res) => {
  try {
    const birdeyeUrl = `https://public-api.birdeye.so${req.path.replace('/api/birdeye', '')}`;
    const response = await axios.get(birdeyeUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Birdeye API error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
