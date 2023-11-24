import { connectToDatabase, closeDatabase } from "./database.mjs";

/**
 * Initialise the database if it doesn't exist
 *
 * @param {string} databasePath - path to data.db
 */
export function initialiseCveDatabase(databasePath) {
  return new Promise((resolve, reject) => {
    const db = connectToDatabase(databasePath);

    db.run(
      `
              CREATE TABLE IF NOT EXISTS cve_cache (
              cve TEXT PRIMARY KEY,
              description TEXT,
              classification TEXT,
              last_updated INTEGER
              )
          `,
      (err) => {
        if (err) {
          reject(new Error(`Error creating table: ${err.message}`));
          return;
        }

        db.close((closeErr) => {
          if (closeErr) {
            reject(
              new Error(`Error closing the database: ${closeErr.message}`)
            );
            return;
          }
          resolve();
        });
      }
    );
  });
}

/**
 * Insert or update the database
 *
 * @param {string} cve - cve
 * @param {string} description - cve description
 * @param {string} classification - type
 * @param {string} databasePath - path to database
 *
 */
export async function insertOrUpdateCVEData(
  cve,
  description,
  classification,
  databasePath
) {
  const db = connectToDatabase(databasePath);
  try {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO cve_cache (cve, description, classification, last_updated) VALUES (?, ?, ?, ?)`,
        [cve, description, classification, Date.now()],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  } finally {
    closeDatabase(db);
  }
}

/**
 * Get data from database where cpe matches
 *
 * @param {string} cve - cve
 * @param {string} databasePath - path to sqlite database
 * @returns {Promise} - All cve data
 */
export function getCVEData(cve, databasePath) {
  const db = connectToDatabase(databasePath);
  const threeMonthsAgo = Date.now() - 3 * 30 * 24 * 60 * 60 * 1000; // ~ 3 months in milliseconds

  try {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM cve_cache WHERE cve = ? AND last_updated > ?",
        [cve, threeMonthsAgo],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  } finally {
    closeDatabase(db);
  }
}
