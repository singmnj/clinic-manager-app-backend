
if (process.env.NODE_ENV !== 'production') {
	// Load environment variables from .env file in non prod environments
	require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
var morgan = require('morgan');
const oracledb = require('oracledb');
const cookieParser = require('cookie-parser');

const dbConfig = require('./config/dbconfig');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');

const app = express();

// logger middleware
app.use(morgan('tiny'));

//Handle options credentials check - before CORS
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use(express.static('build'));

app.get('/', (request, response) => {
	response.send('<h1>CMA API</h1>');
});

app.use(require('./routes/register'));
app.use(require('./routes/auth'));
app.use(require('./routes/refresh'));
app.use(require('./routes/logout'));
app.use(verifyJWT);
app.use(require('./routes/stats'));
app.use(require('./routes/patient'));
app.use(require('./routes/consultation'));

app.use(errorHandler);

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