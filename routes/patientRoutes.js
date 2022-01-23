const express = require('express');
const patientController = require('../controllers/patientController');

var patientRouter = express.Router();

patientRouter.get('/patient', patientController.getAllPatients);
patientRouter.post('/patient', patientController.addPatient);
patientRouter.delete('/patient/:pid', patientController.deletePatient);
patientRouter.put('/patient/:pid', patientController.updatePatient);

module.exports = patientRouter;