const Patient = require('../model/Patient');
const Consultation = require('../model/Consultation');


let getPatient = async(request, response) => {
	let patientId = request.params.pid;
	let patientDoc = await Patient.findById(patientId).exec();
	if(!patientDoc)
		response.sendStatus(404);
	response.json(patientDoc);
};

let getAllPatients = async(_request, response) => {
	let patientDocs = await Patient.find({}).exec();
	response.json(patientDocs);
};

let addPatient = async(request, response) => {
	let newPatientDoc = await Patient.create(request.body);
	response.json(newPatientDoc);
};

let deletePatient = async(request, response) => {
	let patientId = request.params.pid;
	let deletedPatientDoc = await Patient.findByIdAndDelete(patientId).exec();
	if (deletedPatientDoc) {
		await Consultation.deleteMany({ 'patientId': deletedPatientDoc.id }).exec();
		response.json({ message: 'Deleted Patient Successfully.' });
	}
	else
		response.sendStatus(404);
};

let updatePatient = async(request, response) => {
	let patientId = request.params.pid;
	let updatedPatientDoc = await Patient.findByIdAndUpdate(patientId, request.body).exec();
	if (updatedPatientDoc)
		response.json({ message: 'Updated Patient Successfully.' });
	else
		response.sendStatus(404);
};


module.exports = {
	getPatient,
	getAllPatients,
	addPatient,
	deletePatient,
	updatePatient
};