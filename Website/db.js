const sql = require('mssql');

// Create a connection to the database
const config = {
  user: 'NicolaJ_SQLLogin_1',
  password: 'mrubs9xwhz',
  server: 'ArduinoToNodeJsWebsite.mssql.somee.com',
  database: 'ArduinoToNodeJsWebsite',
  options: {
    encrypt: false // use SSL encryption
  }
};

sql.connect(config).then(() => {
  console.log('Connected to the database.');
}).catch((err) => {
  console.error('Error connecting to the database:', err);
});


// Close the database connection when Node.js process ends
process.on('SIGINT', () => {
  sql.close().then(() => {
    console.log('Database connection closed.');
  });
});

module.exports = sql;