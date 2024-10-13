const multer = require('multer');

// Konfiguration von multer für die Arbeit mit Dateien
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images'); // Pfad zum Ordner, in dem die Bilder gespeichert werden
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); // Dateiname: aktuelle Zeit + ursprünglicher Dateiname
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // Limit 5MB
    },
    fileFilter: fileFilter,
  });