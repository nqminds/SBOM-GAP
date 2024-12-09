/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */

const { Pool } = require('pg');
const { performance } = require('perf_hooks');

// PostgreSQL database connection details
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'cve_database',
  password: process.env.DB_PASSWORD || 'ionut',
  port: process.env.DB_PORT || 5432,
});

/**
 * Query CVE data by CPE.
 * @param {string} cpe - The CPE string to search for (e.g., cpe:2.3:a:solarwinds:serv-u:*:*:*:*:*:*:*:*).
 * @returns {Promise<{ matches: number, data: object[] }>} - A promise that resolves to the match count and matching CVEs.
 */
async function getCVEsByCPE(cpe) {
  try {
    const query = `
      SELECT cve_id, cve_data, COUNT(*) OVER () AS total_matches
      FROM cve
      WHERE cpe_id LIKE $1
    `;
    const values = [`${cpe}%`];

    // Execute the query
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return { matches: 0, data: [] };
    }

    // Total matches are the same for all rows due to `COUNT(*) OVER ()`
    const matches = rows[0].total_matches;

    return { matches, data: rows };
  } catch (err) {
    return Promise.reject(`Database query failed: ${err.message}`);
  }
}

// // Usage example
// (async () => {
//   const cpe = 'cpe:2.3:a:solarwinds:serv-u:*:*:*:*:*:*:*:*';

//   try {
//     const startTime = performance.now(); // Record start time

//     const { matches, data } = await getCVEsByCPE(cpe);

//     const endTime = performance.now(); // Record end time
//     const timeTaken = (endTime - startTime).toFixed(2); // Calculate time taken in milliseconds

//     console.log(`Query completed in ${timeTaken} ms`);
//     console.log(`Total matches found: ${matches}`);

//     if (matches === 0) {
//       console.log('No matching CVEs found for the given CPE.');
//     } else {
//       console.log('Matching CVEs:');
//       data.forEach((result) => {
//         console.log(result);
//       });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     // Close the PostgreSQL pool
//     await pool.end();
//   }
// })();

module.exports = {
  getCVEsByCPE,
};
