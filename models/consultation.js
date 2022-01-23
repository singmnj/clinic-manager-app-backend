const oracledb = require('oracledb');
const { v4: uuidv4 } = require('uuid');

const getConsultations = async(patientId) => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const patient_collection = await soda.openCollection('patients');
		let patientDoc = await patient_collection.find().filter({ 'id' : patientId }).getOne();
		let consultationIds = patientDoc.getContent().consultationIds;
		const consultation_collection = await soda.openCollection('consultations');
		let consultations = [];
		let consultationDoc;
		consultationIds.forEach(async(consultationId) => {
			consultationDoc = await consultation_collection.find().filter({ 'id' : consultationId }).getOne();
			consultations.push(consultationDoc.getContent());
		});
		return consultations;
	}
	catch(err) {
		console.log(err);
	}
	finally {
		if(connection)
			await connection.close();
	}
};

const createConsultation = async(patientId, consultation) => {
	let newId = uuidv4();
	consultation.id = newId;
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const patientCollection = await soda.openCollection('patients');
		const consultationCollection = await soda.openCollection('consultations');
		await consultationCollection.insertOneAndGet(consultation);
		let patientDoc = await patientCollection.find().filter({ 'id' : patientId }).getOne();
		let updatedPatient = patientDoc.getContent();
		updatedPatient.consultationIds.push(newId.toString());
		await patientCollection.find().key(patientDoc.key).replaceOneAndGet(updatedPatient);
		return newId;
	}
	catch(err) {
		console.log(err);
	}
	finally {
		if(connection)
			await connection.close();
	}
};

const deleteConsultation = async(patientId, consultationId) => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const patientCollection = await soda.openCollection('patients');
		const consultationCollection = await soda.openCollection('consultations');
		let result = await consultationCollection.find().filter({ 'id' : consultationId }).remove();
		if(result.count !== 1)
			return false;
		let patientDoc = await patientCollection.find().filter({ 'id' : patientId }).getOne();
		if(!patientDoc.key)
			return false;
		let updatedPatient = patientDoc.getContent();
		updatedPatient.consultationIds = updatedPatient.consultationIds.filter(id => id !== consultationId.toString());
		await patientCollection.find().key(patientDoc.key).replaceOneAndGet(updatedPatient);
		return true;
	}
	catch(err) {
		console.log(err);
	}
	finally {
		if(connection)
			await connection.close();
	}
};

const updateConsultation = async(consultationId, consultation) => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const consultationCollection = await soda.openCollection('consultations');
		console.log(consultationId);
		console.log(consultation);
		let consultationDoc = await consultationCollection.find().filter({ 'id' : consultationId }).getOne();
		if(!consultationDoc.key)
			return false;
		console.log(consultationDoc);
		await consultationCollection.find().key(consultationDoc.key).replaceOneAndGet(consultation);
		return true;
	}
	catch(err) {
		console.log(err);
	}
	finally {
		if(connection)
			await connection.close();
	}
};

module.exports = {
	getConsultations,
	createConsultation,
	updateConsultation,
	deleteConsultation
};

