/* eslint-disable import/extensions */
/* eslint-disable no-console */

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const { getCVEsByCPE, getCPEVersions } = require('./src/cpeServices');
const { getCVEById } = require('./src/cveServices');

dotenv.config();

const app = express();
const { PORT } = process.env;

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

app.post('/api/cpe-versions', async (req, res) => {
  const { cpe } = req.body;

  if (!cpe) {
    return res.status(400).json({ error: 'CPE is required' });
  }

  try {
    const result = await getCPEVersions(cpe);
    return res.status(200).json({
      message: 'CPE versions fetched successfully',
      matches: result.matches,
      cpes: result.cpes,
    });
  } catch (err) {
    console.error('Error fetching CPE versions:', err);
    return res.status(500).json({ error: 'Failed to fetch CPE versions' });
  }
});

app.post('/api/cve-id', async (req, res) => {
  const { cveId } = req.body;

  if (!cveId) {
    return res.status(400).json({ error: 'CVE ID is required' });
  }

  try {
    const cveData = await getCVEById(cveId);

    if (!cveData) {
      return res.status(404).json({ error: `CVE ${cveId} not found` });
    }

    return res.status(200).json({
      message: `CVE ${cveId} fetched successfully`,
      data: cveData,
    });
  } catch (err) {
    console.error('Error fetching CVE by ID:', err);
    return res.status(500).json({ error: 'Failed to fetch CVE data' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
