const oracledb = require('oracledb');
const { getAllPatients } = require('./patient');

const getStats = async() => {
	let connection;
	try {
		connection = await oracledb.getConnection();
		const soda = connection.getSodaDatabase();
		const consultationCollection = await soda.openCollection('consultations');
		const last7DaysConsultations = [];
		let consultationNums;
		for(let i = 6; i >= 0; i--){
			let date = new Date();
			date.setDate(date.getDate() - i);
			consultationNums = await consultationCollection.find().filter({ 'date': date.toISOString().split('T')[0] }).count();
			last7DaysConsultations.push(consultationNums.count);
		}
		const last6MonthsEarnings = [];
		let startDate, endDate;
		for(let i = 5; i >= 0; i--){
			let date = new Date();
			endDate = new Date(date.getFullYear(), date.getMonth() - i + 1, 1).toISOString().split('T')[0];
			date = new Date();
			startDate = new Date(date.getFullYear(), date.getMonth() - i, 2).toISOString().split('T')[0];
			let cDocs = await consultationCollection.find().filter({
				'date': { '$gte': startDate, '$lte': endDate }
			}).getDocuments();
			let earnings = cDocs.map(c => c.getContent()).reduce((acc, c) => acc + c.amountReceived, 0);
			last6MonthsEarnings.push(earnings);
		}
		const patients = await getAllPatients();
		let stats = {
			'totalUniquePatients' : 0,
			'patientsWithDues': 0,
			'totalDues': 0,
			'topPatientsWithDues': [],
			'last7DaysConsultations': [],
			'last6MonthsEarnings': []
		};
		stats.totalUniquePatients = patients.length;
		stats.patientsWithDues = patients.filter(p => p.due > 0).length;
		stats.totalDues = patients.reduce((acc,p) => acc + p.due, 0);
		stats.topPatientsWithDues = patients.sort((p1, p2) => p2.due - p1.due).slice(0, 5);
		stats.last7DaysConsultations = last7DaysConsultations;
		stats.last6MonthsEarnings = last6MonthsEarnings;
		return stats;
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
	getStats
};