const express = require('express');
const router = express.Router();
const {createCase, getCase, updateCase, deleteCase} = require('../controllers/caseStudyController');


router.post('/api/case-studies', upload.single('image'), createCase);
  
  
router.get('/api/case-studies', getCase);
 

router.put('/api/case-studies/:id', upload.single('image'), updateCase );
  
  
  router.delete('/api/case-studies/:id', deleteCase);

module.exports = router;