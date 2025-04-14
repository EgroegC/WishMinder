const pool = require("../config/db")();

class Nameday {
  constructor(id, name, nameday_date) {
    this.id = id;
    this.name = name;
    this.nameday_date = nameday_date;
  }

  static async getUpcomingNamedays() {
    try {
      const today = new Date().toISOString().split("T")[0];

      const query = `
        SELECT nd.id, n.name, nd.nameday_date
        FROM namedays nd
        JOIN names n ON nd.name_id = n.id
        WHERE nd.nameday_date >= $1
        ORDER BY nd.nameday_date
      `;

      const result = await pool.query(query, [today]);

      return result.rows.map(row => new Nameday(row.id, row.name, row.nameday_date));
    } catch (error) {
      console.error("❌ Error fetching upcoming namedays:", error);
      throw error;
    }
  }

  static async getContactsWithUpcomingNamedays(contacts) {
    try {
      const upcomingNamedays = await this.getUpcomingNamedays();
  
      const namedayMap = new Map(upcomingNamedays.map(nd => [nd.name, nd.namedayDate]));
  
      const contactsWithNamedays = contacts
        .filter(contact => namedayMap.has(contact.name))
        .map(contact => ({
          contactId: contact.id,
          name: contact.name,
          phone: contact.phone,
          namedayDate: namedayMap.get(contact.name),
        }));
  
      return contactsWithNamedays;
    } catch (error) {
      console.error("❌ Error fetching contacts with namedays:", error);
      throw error;
    }
  } 
}

module.exports = Nameday;
