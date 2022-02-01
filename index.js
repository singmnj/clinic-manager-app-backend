
if (process.env.NODE_ENV !== 'production') {
	// Load environment variables from .env file in non prod environments
	require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
var morgan = require('morgan');
const oracledb = require('oracledb');
const dbConfig = require('./dbconfig.js');
const app = express();
const patientRouter = require('./routes/patientRoutes');
const consultationRouter = require('./routes/consultationRoutes');
const authRouter = require('./routes/authRoutes');
const passport = require('passport');
const session = require('express-session');

app.use(express.static('build'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use(
	cors({
		origin: 'http://localhost:3000', // <-- location of the react app we're connecting to
		credentials: true,
	})
);
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
require('./strategies/localStrategy')(passport);

app.get('/', (request, response) => {
	response.send('<h1>CMA API</h1>');
});

app.use(patientRouter);
app.use(consultationRouter);
app.use(authRouter);

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
		await soda.createCollection('users');
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