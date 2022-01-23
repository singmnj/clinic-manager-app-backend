const express = require('express');
const consultationController = require('../controllers/consultationController');

var consultationRouter = express.Router();

consultationRouter.get('/patient/:pid/consultation', consultationController.getConsultationsForPatient);
consultationRouter.post('/patient/:pid/consultation', consultationController.createConsultationForPatient);
consultationRouter.delete('/patient/:pid/consultation/:cid', consultationController.deleteConsultationForPatient);
consultationRouter.put('/patient/:pid/consultation/:cid', consultationController.updateConsultation);

module.exports = consultationRouter;