const express = require('express');
const router = express.Router();

const {createClient, checkClient, updateClient, deleteClient} = require('../controllers/clientController');
const upload = require('../middleware/upload-file');

router.post('/',upload.single('logo'), createClient);
router.get('/', checkClient);
router.put('/:id', upload.single('logo'), updateClient);
router.delete('/:id', deleteClient);

module.exports = router;