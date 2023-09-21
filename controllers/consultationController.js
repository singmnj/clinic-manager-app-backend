const Consultation = require('../model/Consultation');
const Patient = require('../model/Patient');


const getConsultationsForPatient = async (request, response) => {
	let patientId = request.params.pid;
	let consultationDocs = await Consultation.find({'patientId': patientId}).exec();
	response.json(consultationDocs);
};

const createConsultationForPatient = async (request, response) => {
	let patientId = request.params.pid;
	let patientDoc = await Patient.exists({_id: patientId});
	if(patientDoc){
		let newConsultationDoc = await Consultation.create({...request.body, 'patientId': patientId});
		response.json(newConsultationDoc);
	}
	else
		response.sendStatus(404);
};

const updateConsultation = async (request, response) => {
	let consultationId = request.params.cid;
	let updatedConsultationDoc = await Consultation.findByIdAndUpdate(consultationId, request.body).exec();
	if (updatedConsultationDoc)
		response.json({message: 'Updated Consultation Successfully.'});
	else
		response.sendStatus(404);
};

const deleteConsultation = async (request, response) => {
	let consultationId = request.params.cid;
	let deletedConsultationDoc = await Consultation.findByIdAndDelete(consultationId).exec();
	if (deletedConsultationDoc)
		response.json({message: 'Deleted Consultation Successfully.'});
	else
		response.sendStatus(404);
};


module.exports = {
	getConsultationsForPatient,
	createConsultationForPatient,
	updateConsultation,
	deleteConsultation
};