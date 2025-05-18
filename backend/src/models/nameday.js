const pool = require("../config/db")();

class Nameday {
  constructor(id, name, nameday_date) {
    this.id = id;
    this.name = name;
    this.nameday_date = nameday_date;
  }
}

module.exports = Nameday;
