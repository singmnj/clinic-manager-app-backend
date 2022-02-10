const express = require('express');
const consultationController = require('../controllers/consultationController');

var router = express.Router();

router.get('/api/patients/:pid/consultations', consultationController.getConsultationsForPatient);
router.post('/api/patients/:pid/consultations', consultationController.createConsultationForPatient);
router.delete('/api/patients/:pid/consultations/:cid', consultationController.deleteConsultationForPatient);
router.put('/api/patients/:pid/consultations/:cid', consultationController.updateConsultation);

module.exports = router;