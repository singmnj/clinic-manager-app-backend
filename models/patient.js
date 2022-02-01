const oracledb = require('oracledb');
const { v4: uuidv4 } = require('uuid');

const getAllPatients = async() => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const patientCollection = await soda.openCollection('patients');
		let docs = await patientCollection.find().getDocuments();
		return docs.map(doc => doc.getContent());
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
		if(doc && 'key' in doc){
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
	getAllPatients,
	addPatient,
	deletePatient,
	updatePatient
};