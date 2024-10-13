const express = require('express');
const router = express.Router();
const {login, register} = require('../controllers/authController');



router.post('/api/register', register);
  

router.post('/api/login', login);

module.exports = router;


