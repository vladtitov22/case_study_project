const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const authRouter = require('./routes/authRoutes');
const caseStudyRoutes = require('./routes/caseStudyRoutes');
const clientRoutes = require('./routes/clientRoutes'); 

// Initialisierung von dotenv und express
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Konfiguration des Zugriffs auf statische Dateien
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRouter );
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/clients', clientRoutes);

// Verbindung zur Datenbank herstellen
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

// Einschränkung der Dateitypen und -größe
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Nicht unterstützter Dateityp. Nur JPEG und PNG sind erlaubt.'), false);
  }
};

 // Server starten
 const PORT = process.env.PORT || 3000;
 router.listen(PORT, () => {
   console.log(`Server läuft auf Port ${PORT}`);
  });