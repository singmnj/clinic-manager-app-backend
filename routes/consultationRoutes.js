const express = require('express');
const consultationController = require('../controllers/consultationController');

var consultationRouter = express.Router();

consultationRouter.get('/api/patients/:pid/consultations', consultationController.getConsultationsForPatient);
consultationRouter.post('/api/patients/:pid/consultations', consultationController.createConsultationForPatient);
consultationRouter.delete('/api/patients/:pid/consultations/:cid', consultationController.deleteConsultationForPatient);
consultationRouter.put('/api/patients/:pid/consultations/:cid', consultationController.updateConsultation);

module.exports = consultationRouter;