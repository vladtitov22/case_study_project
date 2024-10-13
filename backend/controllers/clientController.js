
const db = require('../databaseconfig/db');

const createClient =   (req, res) => {
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
};

const checkClient =  (req, res) => {
    const query = 'SELECT * FROM clients';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Fehler beim Abrufen der Clients:', err);
        return res.status(500).send('Serverfehler');
      }
      res.status(200).json(results);
    });
};

const updateClient =  (req, res) => {
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
};

const deleteClient =  (req, res) => {
   const { id } = req.params;
  
   const query = 'DELETE FROM clients WHERE id = ?';
   db.query(query, [id], (err, _) => {
     if (err) {
       console.error('Fehler beim Löschen des Clients:', err);
       return res.status(500).send('Serverfehler');
     }
     res.status(200).send('Client erfolgreich gelöscht');
   });
};

  module.exports = {createClient, checkClient, updateClient, deleteClient};