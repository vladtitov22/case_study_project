const express = require('express');
const router = express.Router();
const {createClient, checkClient, updateClient, deleteClient} = require('../controllers/clientController');



router.post('/api/clients',upload.single('logo'), createClient);
  

  router.get('/api/clients', checkClient);
  

  router.put('/api/clients/:id', upload.single('logo'), updateClient);
  

  router.delete('/api/clients/:id', deleteClient);

module.exports = router;