const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_3' });

oracledb.autoCommit = true;

const getConnection = async() => {

	const connection = await oracledb.getConnection(
		{
			user          : 'admin',
			password      : 'IilCeA3yb0jl5n9YQQwM',
			connectString : 'cmadb_high'
		}
	);
	return connection;
};

getConnection();
