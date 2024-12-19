const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = process.env;
// PostgreSQL database connection details
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

/**
 * Search the database for a specific CVE ID and return its data.
 *
 * @param {string} cveId - The CVE ID to search for (e.g., "CVE-2022-48174").
 * @returns {object|null} - The CVE data if found, or null if not found.
 */
async function getCVEById(cveId) {
  try {
    const query = `
      SELECT cve_id, cve_data
      FROM cve
      WHERE cve_id = $1
    `;
    const values = [cveId];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (err) {
    throw new Error(`Database query failed: ${err.message}`);
  }
}

module.exports = {
  getCVEById,
};
