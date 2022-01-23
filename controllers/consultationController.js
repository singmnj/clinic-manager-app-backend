const consultation = require('../models/consultation.js');

const getConsultationsForPatient = async (request, response) => {
	let consultations = await consultation.getConsultations(request.params.pid);
	response.json(consultations);
};

const createConsultationForPatient = async (request, response) => {
	let newConsultationId = await consultation.createConsultation(request.params.pid, request.body);
	response.json( { 'id' : newConsultationId } );
};

const updateConsultation = async (request, response) => {
	let isUpdated = await consultation.updateConsultation(request.params.cid, request.body);
	if (isUpdated)
		response.status(200).send('Updated Consultation Successfully.');
	else
		response.status(404).send();
};

const deleteConsultationForPatient = async (request, response) => {
	let pid = request.params.pid;
	let cid = request.params.cid;
	let isDeleted = await consultation.deleteConsultation(pid, cid);
	if (isDeleted)
		response.status(200).send('Deleted Consultation Successfully.');
	else
		response.status(404).send();
};

module.exports = {
	getConsultationsForPatient,
	createConsultationForPatient,
	updateConsultation,
	deleteConsultationForPatient
};