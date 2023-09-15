const MYSQL = require('mysql')
const DB = MYSQL.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'mall',
})
module.exports = DB
