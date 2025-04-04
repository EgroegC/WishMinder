require("dotenv").config();
const fs = require("fs");
const pool = require('../../config/db')();
const path = require("path");
const getOrthodoxEaster = require('./utils');

// Function to determine George's nameday
function getGeorgeNameday(year) {
    const easterDate = getOrthodoxEaster(year);
    const april23 = new Date(year, 3, 23); // April is month 3 (0-based index)

    if (april23 < new Date (easterDate)) {
        // If April 23 is before Easter, nameday is on Easter Monday
        const easterMonday = new Date(easterDate);
        easterMonday.setDate(easterMonday.getDate() + 1);
        return easterMonday.toLocaleDateString("en-CA");
    } else {
        // Otherwise, nameday stays on April 23
        return april23.toLocaleDateString("en-CA");
    }
}

// Function to insert/update George's nameday
async function updateGeorgeNameday() {
    try {
        const currentYear = new Date().getFullYear();
        const georgeNameday = getGeorgeNameday(currentYear);
        console.log('Nameday Date ', georgeNameday);

        const georgeVariations = ["Γιώργος", "Γεώργιος", "Γεωργία", "Γεωργούλα", "Γιώργης", "Γιωργής"];

        for (const name of georgeVariations) {
            // Insert name if it doesn't exist
            const nameResult = await pool.query(
                "INSERT INTO names (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id",
                [name]
            );

            let nameId;
            if (nameResult.rows.length > 0) {
                nameId = nameResult.rows[0].id;
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
                [nameId, georgeNameday]
            );
        }

        console.log("George's nameday updated successfully!");
    } catch (err) {
        console.error("Error updating George's nameday:", err);
    }
}

// Run the functions once a year
(async () => {
    await updateGeorgeNameday();
})();
