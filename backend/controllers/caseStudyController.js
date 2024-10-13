const createCase = (req, res) => {
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
  };

  const getCase =  (req, res) => {
    const query = 'SELECT * FROM case_studies';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Fehler beim Abrufen der Case Studies:', err);
        return res.status(500).send('Serverfehler');
      }
      res.status(200).json(results);
    });
  };



  const updateCase = (req, res) => {
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
  };

  

  const deleteCase =  (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM case_studies WHERE id = ?';
    db.query(query, [id], (err, _) => {
      if (err) {
        console.error('Fehler beim Löschen der Case Study:', err);
        return res.status(500).send('Serverfehler');
      }
      res.status(200).send('Case Study erfolgreich gelöscht');
    });
  };

  module.exports = {createCase, getCase, updateCase, deleteCase};