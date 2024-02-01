import express from 'express';
import multer from 'multer';
import config from "./config.json" assert { type: "json" };
import fs from 'fs';
import { fetchCVEsWithRateLimit } from '../src/list-vulnerabilities.mjs';
import { calculateAverageBaseScore } from '../src/utils.mjs';

const app = express();
const { port } = config;

const upload = multer({ dest: 'uploads/' });

app.post('/sbomRiskAverage', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }

    const filePath = req.file.path;
    const cvesData = await fetchCVEsWithRateLimit(filePath);
    const averageBaseScore = calculateAverageBaseScore(cvesData);

    // delete the file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    res.json(averageBaseScore);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port:${port}`);
});
