const { getPool } = require('../../src/config/db');
const pool = getPool();

async function insertTestNameday(name, date) {
  const nameResult = await pool.query(
    `INSERT INTO names (name) VALUES ($1) RETURNING id`,
    [name]
  );

  const nameId = nameResult.rows[0].id;

  const namedayResult = await pool.query(
    `INSERT INTO namedays (name_id, nameday_date) VALUES ($1, $2) RETURNING *`,
    [nameId, date]
  );

  return namedayResult.rows[0];
}

async function clearNamedaysAndNames() {
  await pool.query(`DELETE FROM namedays`);
  await pool.query(`DELETE FROM names`);
}

module.exports = {
  insertTestNameday,
  clearNamedaysAndNames
};
