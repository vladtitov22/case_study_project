const express = require('express');
const router = express.Router();
const {createCase, getCase, updateCase, deleteCase} = require('../controllers/caseStudyController');
const upload = require('../middleware/upload-file');


router.post('/', upload.single('image'), createCase);
router.get('/', getCase);
router.put('/:id', upload.single('image'), updateCase );
router.delete('/:id', deleteCase);

module.exports = router;