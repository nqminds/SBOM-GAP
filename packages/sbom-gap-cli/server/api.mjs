import express from "express";
import multer from "multer";
import config from "./config.json" assert { type: "json" };
import fs from "fs";
import { fetchCVEsWithRateLimit } from "../src/list-vulnerabilities.mjs";
import { calculateAverageBaseScore } from "../src/utils.mjs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const { port } = config;

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/sbomRiskAverage", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded.");
    }

    const filePath = req.file.path;
    let cvesData = await fetchCVEsWithRateLimit(filePath);
    const averageBaseScore = await calculateAverageBaseScore(cvesData);

    // delete the file after processing
    fs.unlinkSync(filePath, (err) => {
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
