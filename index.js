require('dotenv').config();

const express = require('express');
const cors = require('cors');
var morgan = require('morgan');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
const app = express();
const patientRouter = require('./routes/patientRoutes');
const consultationRouter = require('./routes/consultationRoutes');

app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (request, response) => {
	response.send('<h1>CMA API</h1>');
});

app.use(patientRouter);
app.use(consultationRouter);

oracledb.initOracleClient({ libDir: process.env.ORACLE_LIBDIR });
oracledb.autoCommit = true;

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, async() => {
	try {
		console.log('Create Connection pool');
		await oracledb.createPool(dbConfig);
		console.log('Created Connection pool');
		const connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		await soda.createCollection('patients');
		await soda.createCollection('consultations');
		console.log('Created Collections');
		connection.close();
		console.log(`Server running on port ${PORT}`);
	}
	catch(err) {
		console.error(err);
	}
});

process.on('SIGINT', () => {
	server.close(async() => {
		console.log('Process terminated\nclosing connection pool');
		try {
			await oracledb.getPool().close(10);
			console.log('Pool closed');
		} catch(err) {
			console.error(err);
		}
	});
});