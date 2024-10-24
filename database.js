const knex = require("knex");
const knexfile = require("../knexfile");
const db = knex(knexfile.development); // Connects to the database using the development configuration
module.exports = db;
