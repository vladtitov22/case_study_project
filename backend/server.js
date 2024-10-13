const express = require('express');
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

 // Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});