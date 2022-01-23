// DB Configuration

module.exports = {
	user          : process.env.ORACLE_DB_USER,
	password      : process.env.ORACLE_DB_PASSWORD,
	connectString : process.env.ORACLE_DB_TNS_ENTRY_KEY
};