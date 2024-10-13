const db = require('../db/db');

const register =  async (req, res) => {
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
};

const login = async (req, res) => {
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
};

module.exports = { login, register }
