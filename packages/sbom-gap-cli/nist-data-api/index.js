/* eslint-disable import/extensions */
/* eslint-disable no-console */

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const { getCVEsByCPE } = require('./src/cpeServices');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());

app.post('/api/cve', async (req, res) => {
  const { cpe } = req.body;

  if (!cpe) {
    return res.status(400).json({ error: 'CPE is required' });
  }

  try {
    const result = await getCVEsByCPE(cpe);
    return res.status(200).json({
      message: 'CVE data fetched successfully',
      matches: result.matches,
      data: result.data,
    });
  } catch (err) {
    console.error('Error fetching CVEs:', err);
    return res.status(500).json({ error: 'Failed to fetch CVE data' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
