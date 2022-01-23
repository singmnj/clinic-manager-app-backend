const patient = require('../models/patient.js');

let getAllPatients = async(request, response) => {
	let patients = await patient.getAllPatients();
	response.json(patients);
};

let addPatient = async(request, response) => {
	let newPatientId = await patient.addPatient(request.body);
	response.json({ 'id': newPatientId });
};

let deletePatient = async(request, response) => {
	let patientId = request.params.pid;
	let isDeleted = await patient.deletePatient(patientId);
	if (isDeleted)
		response.status(200).send('Deleted Patient Successfully.');
	else
		response.status(404).send();
};

let updatePatient = async(request, response) => {
	let isUpdated = await patient.updatePatient(request.params.pid, request.body);
	if (isUpdated)
		response.status(200).send('Updated Patient Successfully.');
	else
		response.status(404).send();
};


module.exports = {
	getAllPatients,
	addPatient,
	deletePatient,
	updatePatient
};