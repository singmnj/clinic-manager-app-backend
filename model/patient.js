const oracledb = require('oracledb');
const { v4: uuidv4 } = require('uuid');

const getPatient = async(patientId) => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const patientCollection = await soda.openCollection('patients');
		let doc = await patientCollection.find().filter({ 'id' : patientId }).getOne();
		if(doc?.key)
			return doc.getContent();
		return null;
	}
	catch(err) {
		console.log(err);
	}
	finally {
		if(connection)
			await connection.close();
	}
};

const getAllPatients = async() => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const patientCollection = await soda.openCollection('patients');
		const consultationCollection = await soda.openCollection('consultations');
		let patientDocs = await patientCollection.find().getDocuments();
		let patients = patientDocs.map(doc => doc.getContent());
		let today = new Date();
		patients.map(async p => {
			p.due = 0;
			p.consultationIds?.forEach(async(consultationId) => {
				let c = (await consultationCollection.find().filter({ 'id' : consultationId }).getOne()).getContent();
				p.due += c.amountCharged - c.amountReceived;
			});
			p.age = today.getFullYear() - new Date(p.dob).getFullYear();
		});
		return patients;
	}
	catch(err) {
		console.log(err);
	}
	finally {
		if(connection)
			await connection.close();
	}
};

const addPatient = async(patient) => {
	let newId = uuidv4();
	patient.id = newId;
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const patientCollection = await soda.openCollection('patients');
		await patientCollection.insertOneAndGet(patient);
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

const deletePatient = async(patientId) => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const patientCollection = await soda.openCollection('patients');
		const consultationCollection = await soda.openCollection('consultations');
		//first delete all consultations related to this patient
		let patientDoc = await patientCollection.find().filter({ 'id': patientId }).getOne();
		if(patientDoc?.key) {
			patientDoc.getContent().consultationIds?.forEach(async (consultationId) => {
				await consultationCollection.find().filter({ 'id': consultationId }).remove();
			});
		}
		let result = await patientCollection.find().filter({ 'id' : patientId }).remove();
		return result.count === 1 ? true : false;
	}
	catch(err) {
		console.log(err);
	}
	finally {
		if(connection)
			await connection.close();
	}
};

const updatePatient = async(patientId, patient) => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const patientCollection = await soda.openCollection('patients');
		let doc = await patientCollection.find().filter({ 'id' : patientId }).getOne();
		if(doc?.key){
			await patientCollection.find().key(doc.key).replaceOneAndGet(patient);
			return true;
		}
		else
			return false;
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
	getPatient,
	getAllPatients,
	addPatient,
	deletePatient,
	updatePatient
};