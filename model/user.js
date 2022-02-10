const oracledb = require('oracledb');
const { v4: uuidv4 } = require('uuid');

const addUser = async(user) => {
	let newId = uuidv4();
	user.id = newId;
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const userCollection = await soda.openCollection('users');
		await userCollection.insertOneAndGet(user);
	}
	catch(err) {
		console.log(err);
		throw err;
	}
	finally {
		if(connection)
			await connection.close();
	}
};

const searchUser = async(searchObject) => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const userCollection = await soda.openCollection('users');
		let doc = await userCollection.find().filter(searchObject).getOne();
		return doc ? doc.getContent() : undefined;
	}
	catch(err) {
		console.log(err);
	}
	finally {
		if(connection)
			await connection.close();
	}
};

const updateUser = async(user) => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const userCollection = await soda.openCollection('users');
		let doc = await userCollection.find().filter({ 'username': user.username }).getOne();
		if(doc?.key){
			await userCollection.find().key(doc.key).replaceOneAndGet(user);
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
	addUser,
	searchUser,
	updateUser
};