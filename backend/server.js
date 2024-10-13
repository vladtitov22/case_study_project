const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Initialisierung von dotenv und express
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Konfiguration des Zugriffs auf statische Dateien
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Konfiguration von multer für die Arbeit mit Dateien
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images'); // Pfad zum Ordner, in dem die Bilder gespeichert werden
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Dateiname: aktuelle Zeit + ursprünglicher Dateiname
  },
});

// Einschränkung der Dateitypen und -größe
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Nicht unterstützter Dateityp. Nur JPEG und PNG sind erlaubt.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit 5MB
  },
  fileFilter: fileFilter,
});

// Registrierung des Editors
app.post('/api/register', async (req, res) => {
  const { email_or_username, password } = req.body;

  if (!email_or_username || !password) {
    return res.status(400).send('E-Mail/Benutzername und Passwort sind erforderlich');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO editors (email_or_username, password) VALUES (?, ?)';
    db.query(query, [email_or_username, hashedPassword], (err, _) => {
      if (err) {
        console.error('Fehler beim Hinzufügen des Editors:', err);
        return res.status(500).send('Serverfehler');
      }
      res.status(201).send('Editor erfolgreich registriert');
    });
  } catch (error) {
    console.error('Fehler beim Hashen des Passworts:', error);
    res.status(500).send('Serverfehler');
  }
});

// Login des Editors
app.post('/api/login', async (req, res) => {
  const { email_or_username, password } = req.body;

  if (!email_or_username || !password) {
    return res.status(400).send('E-Mail/Benutzername und Passwort sind erforderlich');
  }

  try {
    const query = 'SELECT password FROM editors WHERE email_or_username = ?';
    db.query(query, [email_or_username], async (err, results) => {
      if (err) {
        console.error('Fehler beim Login des Editors:', err);
        return res.status(500).send('Serverfehler');
      }
      if (results.length === 0) {
        return res.status(404).send('Anmeldeinformationen sind ungültig');
      }
      const storedHashedPassword = results[0].password;
      const passwordMatch = await bcrypt.compare(password, storedHashedPassword);
      if (!passwordMatch) {
        return res.status(401).send('Anmeldeinformationen sind ungültig');
      }
      res.status(200).send('Login erfolgreich');
    });
  } catch (error) {
    console.error('Fehler beim Verarbeiten des Logins:', error);
    res.status(500).send('Serverfehler');
  }
});

// CRUD-Operationen für Clients

// Client erstellen
app.post('/api/clients', upload.single('logo'), (req, res) => {
  const { name, status } = req.body;
  const filepath = req.file ? req.file.path : '';
  // console.log(req.body, req.file);
  if (!name) {
    return res.status(400).send('Der Name des Clients ist erforderlich');
  }

  const query = 'INSERT INTO clients (name, logo, status) VALUES (?, ?, ?)';
  db.query(query, [name, filepath, status || 'active'], (err, _) => {
    if (err) {
      console.error('Fehler beim Hinzufügen des Clients:', err);
      return res.status(500).send('Serverfehler');
    }
    res.status(201).send('Client erfolgreich hinzugefügt');
  });
});

// Alle Clients abrufen
app.get('/api/clients', (req, res) => {
  const query = 'SELECT * FROM clients';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der Clients:', err);
      return res.status(500).send('Serverfehler');
    }
    res.status(200).json(results);
  });
});

// Client aktualisieren
app.put('/api/clients/:id', upload.single('logo'), (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const filepath = req.file ? req.file.path : '';

  if (!name) {
    return res.status(400).send('Der Name des Clients ist erforderlich');
  }

  const query = 'UPDATE clients SET name = ?, logo = ?, status = ? WHERE id = ?';

  db.query(query, [name, filepath, status, id], (err, _) => {
    if (err) {
      console.error('Fehler beim Aktualisieren des Clients:', err);
      return res.status(500).send('Serverfehler');
    }
    res.status(200).send('Client erfolgreich aktualisiert');
  });
});

// Client löschen
app.delete('/api/clients/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM clients WHERE id = ?';
  db.query(query, [id], (err, _) => {
    if (err) {
      console.error('Fehler beim Löschen des Clients:', err);
      return res.status(500).send('Serverfehler');
    }
    res.status(200).send('Client erfolgreich gelöscht');
  });
});

// CRUD für Case Studies

// Hinzufügen einer neuen Case Study
app.post('/api/case-studies', upload.single('image'), (req, res) => {
  const { title, description, customer_id } = req.body;

  if (!title || !customer_id) {
    return res.status(400).send('Titel und Kunden-ID sind erforderlich.');
  }

  const imagePath = req.file ? req.file.path : ''; // Speichern des Bildpfads, falls hochgeladen

  const query = 'INSERT INTO case_studies (title, description, image, customer_id) VALUES (?, ?, ?, ?)';
  db.query(query, [title, description, imagePath, customer_id], (err, _) => {
    if (err) {
      console.error('Fehler beim Hinzufügen der Case Study:', err);
      return res.status(500).send('Serverfehler');
    }
    res.status(201).send('Case Study erfolgreich hinzugefügt');
  });
});

// Alle Case Studies abrufen
app.get('/api/case-studies', (req, res) => {
  const query = 'SELECT * FROM case_studies';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen der Case Studies:', err);
      return res.status(500).send('Serverfehler');
    }
    res.status(200).json(results);
  });
});

// Case Study aktualisieren
app.put('/api/case-studies/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, description, customer_id } = req.body;
  const imagePath = req.file ? req.file.path : '';

  const query = 'UPDATE case_studies SET title = ?, description = ?, image = ?, customer_id = ? WHERE id = ?';
  db.query(query, [title, description, imagePath, customer_id, id], (err, _) => {
    if (err) {
      console.error('Fehler beim Aktualisieren der Case Study:', err);
      return res.status(500).send('Serverfehler');
    }
    res.status(200).send('Case Study erfolgreich aktualisiert');
  });
});

// Case Study löschen
app.delete('/api/case-studies/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM case_studies WHERE id = ?';
  db.query(query, [id], (err, _) => {
    if (err) {
      console.error('Fehler beim Löschen der Case Study:', err);
      return res.status(500).send('Serverfehler');
    }
    res.status(200).send('Case Study erfolgreich gelöscht');
  });
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
