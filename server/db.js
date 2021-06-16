
const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  schema: 'postgres',
  password: '',
  port: 5434
});

module.exports = db;
