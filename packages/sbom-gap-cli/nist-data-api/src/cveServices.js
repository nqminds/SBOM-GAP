/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
const sqlite3 = require('sqlite3').verbose();

/**
 * Query CVE data by CPE.
 * @param {string} cpe - The CPE string to search for (e.g., cpe:2.3:a:solarwinds:serv-u:*:*:*:*:*:*:*:*).
 * @param {string} dbPath - Path to the SQLite database file.
 * @returns {Promise<object[]>} - A promise that resolves to an array of matching CVEs.
 */
function getCVEsByCPE(cpe, dbPath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        return reject(`Failed to open database: ${err.message}`);
      }
    });

    const query = 'SELECT * FROM cve WHERE cpe_id LIKE ?';

    db.all(query, [`${cpe}%`], (err, rows) => {
      db.close();

      if (err) {
        return reject(`Database query failed: ${err.message}`);
      }

      if (rows.length === 0) {
        return resolve([]); // No matches
      }

      resolve(rows);
    });
  });
}

// Usage example
(async () => {
  const cpe = 'cpe:2.3:a:busybox:busybox:1.33.2:*:*:*:*:*:*:*';
  const dbPath = '../data/cve_database.db';

  try {
    const results = await getCVEsByCPE(cpe, dbPath);
    if (results.length === 0) {
      console.log('No matching CVEs found for the given CPE.');
    } else {
      console.log('Matching CVEs:', results);
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();
