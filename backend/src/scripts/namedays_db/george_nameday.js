require("dotenv").config();
const fs = require("fs");
const pool = require('../../config/db')();
const path = require("path");

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

// Function to determine George's nameday
function getGeorgeNameday(year) {
    const easterDate = getOrthodoxEaster(year);
    const april23 = new Date(year, 3, 23); // April is month 3 (0-based index)

    if (april23 < easterDate) {
        // If April 23 is before Easter, nameday is on Easter Monday
        const easterMonday = new Date(easterDate);
        easterMonday.setDate(easterMonday.getDate() + 1);
        return easterMonday.toISOString().split("T")[0];
    } else {
        // Otherwise, nameday stays on April 23
        return april23.toISOString().split("T")[0];
    }
}

// Function to insert/update George's nameday
async function updateGeorgeNameday() {
    try {
        const currentYear = new Date().getFullYear();
        const georgeNameday = getGeorgeNameday(currentYear);

        const georgeVariations = ["Γιώργος", "Γεώργιος", "Γεωργία", "Γεωργούλα", "Γιώργης", "Γιωργής"];

        for (const name of georgeVariations) {
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
                "INSERT INTO namedays (name_id, nameday_date) VALUES ($1, $2) ON CONFLICT (name_id, nameday_date) DO NOTHING",
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
