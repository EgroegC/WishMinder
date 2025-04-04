require("dotenv").config();
const fs = require("fs");
const pool = require('../../config/db')();
const path = require("path");
const getOrthodoxEaster = require('./utils');

// Function to update special namedays
async function updateSpecialNamedays() {
  try {
    const filePath = path.resolve(__dirname, "relative_to_easter.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const specialData = JSON.parse(rawData);
    const currentYear = new Date().getFullYear();
    const easterDate = getOrthodoxEaster(currentYear);

    for (const entry of specialData.special) {
      const namedayDate = easterDate;
      namedayDate.setDate(namedayDate.getDate() + entry.toEaster);

      // Convert date to 'YYYY-MM-DD' format
      const formattedDate = namedayDate.toISOString().split("T")[0];

      for (const name of entry.variations) {
        // Insert name if it doesn't exist
        const nameResult = await pool.query(
          "INSERT INTO names (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id",
          [name]
        );

        let nameId;
        if (nameResult.rows.length > 0) {
          nameId = nameResult.rows[0].id; // Get the new ID
        } else {
          // If the name already exists, fetch its ID
          const existingName = await pool.query("SELECT id FROM names WHERE name = $1", [name]);
          nameId = existingName.rows[0].id;
        }

        await pool.query(
          "DELETE FROM namedays WHERE name_id = $1",
          [nameId]
        );
        
        await pool.query(
          "INSERT INTO namedays (name_id, nameday_date) VALUES ($1, $2)",
          [nameId, formattedDate]
        );
      }
    }
  } catch (err) {
    console.error("Error updating special namedays:", err);
  }
  console.log("Special namedays updated successfully!");
}

updateSpecialNamedays();
