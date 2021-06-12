
const { Pool } = require('pg');

// const db = new Pool({
//   user: `${process.env.PGUSER}`,
//   host: `${process.env.PGHOST}`,
//   database: `${process.env.PGDATABASE}`,
//   password: `${process.env.PGPASSWORD}`,
//   post: process.env.PGPORT
// });

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  schema: 'postgres',
  password: '',
  port: 5434
});

module.exports = db;
