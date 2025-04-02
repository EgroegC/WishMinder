require("dotenv").config();
const fs = require("fs");
const pool = require('../../config/db')();
const path = require("path");

// Function to update special namedays
async function updateSpecialNamedays() {
  try {
    const filePath = path.resolve(__dirname, "relative_to_easter.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const specialData = JSON.parse(rawData);
    const currentYear = new Date().getFullYear();
    const easterDate = getOrthodoxEaster(currentYear);

    for (const entry of specialData.special) {
      const namedayDate = new Date(easterDate);
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

        // Insert the nameday date for this name
        await pool.query(
          "INSERT INTO namedays (name_id, nameday_date) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [nameId, formattedDate]
        );
      }
    }

    console.log("Special namedays updated successfully!");
  } catch (err) {
    console.error("Error updating special namedays:", err);
  }
}

// Function to calculate Orthodox Easter date
function getOrthodoxEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    
    return new Date(year, month - 1, day); // Returns a Date object
}

// Run the function once a year
updateSpecialNamedays();
