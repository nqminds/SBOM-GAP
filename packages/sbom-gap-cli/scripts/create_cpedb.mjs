/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import fs from 'fs';
import csvParser from 'csv-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { cleanCpe } from '../src/get-syft-cpes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function openDb() {
  return open({
    filename: path.resolve(__dirname, '../data/cpe_2_3.db'),
    driver: sqlite3.Database
  });
}

async function processAndStoreCpeNames(csvFilePath) {
  const db = await openDb();
  await db.exec(
    'CREATE TABLE IF NOT EXISTS cpe_names (id INTEGER PRIMARY KEY AUTOINCREMENT, cpe_name TEXT)',
  );

  const cpeNames = [];

  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) => {
      const cpe_name = row.cpe_name;
      if (cpe_name) {
        cpeNames.push(cpe_name);
      }
    })
    .on('end', async () => {
      for (const cpe_name of cpeNames) {
        const cleanedCpe = await cleanCpe(cpe_name);
        await db.run('INSERT INTO cpe_names (cpe_name) VALUES (?)', cleanedCpe);
      }
      console.log('Finished processing CVE file and storing CPE names in the database.');
      db.close();
    })
    .on('error', (error) => {
      console.error('Error processing the CVE file:', error);
    });
}

const csvFilePath = path.resolve(__dirname, '../vulnerability-reports/cpe_data.csv');
processAndStoreCpeNames(csvFilePath)
  .then(() => console.log('All CPE names processed and stored.'))
  .catch(console.error);
