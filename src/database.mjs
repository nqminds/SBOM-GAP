import sqlite3 from 'sqlite3';

/**
 * Connects to sqlite3 database
 *
 * @param {string} databasePath - Path to sqlite database.db
 * @returns {sqlite3.Database} - an instance of a SQLite3 database connection.
 */
export function connectToDatabase(databasePath) {
  return new sqlite3.Database(
    databasePath,
    // eslint-disable-next-line no-bitwise
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        throw new Error('Error connecting to the database:', err);
      }
    },
  );
}

/**
 * Close a database
 *
 *@param {sqlite3.Database} db -  Path to sqlite database.db
 */
export function closeDatabase(db) {
  // Close the database connection
  db.close((closeErr) => {
    if (closeErr) {
      throw new Error('Error closing the database:', closeErr.message);
    }
  });
}
/**
 * Initialise the database if it doesn't exist
 *
 * @param {string} databasePath - path to data.db
 */
export function initialiseDatabase(databasePath) {
  return new Promise((resolve, reject) => {
    // Connect to the database using the provided path
    const db = connectToDatabase(databasePath);

    // Create the table if it doesn't exist
    db.run(
      `
            CREATE TABLE IF NOT EXISTS cpe_cache (
            cpe TEXT PRIMARY KEY,
            name TEXT,
            version TEXT,
            cves TEXT,
            last_updated INTEGER
            )
        `,
      (err) => {
        if (err) {
          reject(new Error(`Error creating table: ${err.message}`));
          return;
        }

        // Close the database connection
        db.close((closeErr) => {
          if (closeErr) {
            reject(
              new Error(`Error closing the database: ${closeErr.message}`),
            );
            return;
          }
          resolve();
        });
      },
    );
  });
}

/**
 * Insert or update the database
 *
 * @param {string} cpe - cpe
 * @param {string} name - library name
 * @param {string} version - version
 * @param {object} cvesJSON - cve data
 * @param {string} databasePath - path to sqlite database
 *
 */
export async function insertOrUpdateCPEData(
  cpe,
  name,
  version,
  cvesJSON,
  databasePath,
) {
  const db = connectToDatabase(databasePath);
  try {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT OR REPLACE INTO cpe_cache (cpe, name, version, cves, last_updated) VALUES (?, ?, ?, ?, ?)',
        [cpe, name, version, cvesJSON, Date.now()],
        (err) => {
          if (err) reject(err);
          resolve();
        },
      );
    });
  } finally {
    // Close the database connection
    closeDatabase(db);
  }
}

/**
 * Get data from database where cpe matches
 *
 * @param {string} cpe - cpe
 * @param {string} databasePath - path to sqlite database
 * @returns {Promise} - All cpe data
 */
export function getCPEData(cpe, databasePath) {
  const db = connectToDatabase(databasePath);
  // update the data if is older than 3 months
  const threeMonthsAgo = Date.now() - 3 * 30 * 24 * 60 * 60 * 1000; // ~ 3 months in milliseconds

  try {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM cpe_cache WHERE cpe = ? AND last_updated > ?',
        [cpe, threeMonthsAgo],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        },
      );
    });
  } finally {
    // Close the database connection
    closeDatabase(db);
  }
}
