const express = require('express');
const patientController = require('../controllers/patientController');

var patientRouter = express.Router();

patientRouter.get('/api/patients', patientController.getAllPatients);
patientRouter.post('/api/patients', patientController.addPatient);
patientRouter.delete('/api/patients/:pid', patientController.deletePatient);
patientRouter.put('/api/patients/:pid', patientController.updatePatient);

module.exports = patientRouter;