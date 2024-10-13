const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
  
db.connect((err) => {
if (err) {
    console.error('Fehler beim Verbinden mit der Datenbank:', err);
    process.exit(1);
} else {
    console.log('Erfolgreich mit der Datenbank verbunden');
}
});

module.exports = db;