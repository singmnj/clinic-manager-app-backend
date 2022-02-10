const express = require('express');
const patientController = require('../controllers/patientController');

var router = express.Router();

router.get('/api/patients', patientController.getAllPatients);
router.post('/api/patients', patientController.addPatient);
router.delete('/api/patients/:pid', patientController.deletePatient);
router.put('/api/patients/:pid', patientController.updatePatient);

module.exports = router;