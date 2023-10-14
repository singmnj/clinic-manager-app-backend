const express = require('express');
const consultationController = require('../controllers/consultationController');

const router = express.Router();

router.get('/api/patients/:pid/consultations', consultationController.getConsultationsForPatient);
router.post('/api/patients/:pid/consultations', consultationController.createConsultationForPatient);
router.delete('/api/patients/consultations/:cid', consultationController.deleteConsultation);
router.put('/api/patients/consultations/:cid', consultationController.updateConsultation);

module.exports = router;