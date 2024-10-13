const multer = require('multer');

// Konfiguration von multer für die Arbeit mit Dateien
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images'); 
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); 
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

module.exports = upload;