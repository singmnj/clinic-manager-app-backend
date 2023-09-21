const Patient = require('../model/Patient');
const Consultation = require('../model/Consultation');

let getStats = async(_request, response) => {

	let stats = {
		'totalUniquePatients' : 0,
		'patientsWithDues': 0,
		'totalDues': 0,
		'topPatientsWithDues': [],
		'lastNDaysConsultations': [],
		'lastNMonthsEarnings': []
	};

	//Calculate Last N days number of consultations each day
	const lastNDaysConsultations = [];
	let numConsultations, strDate;
	let DAYS_CONSULTATIONS = 7;
	for(let i = DAYS_CONSULTATIONS - 1; i >= 0; i--){
		let date = new Date();
		date.setDate(date.getDate() - i);
		strDate = date.toISOString().split('T')[0];
		numConsultations = await Consultation.count({ 'date': strDate }).exec();
		lastNDaysConsultations.push({date: strDate, consultations: numConsultations});
	}
	stats.lastNDaysConsultations = lastNDaysConsultations;

	//Calculate last N months earnings
	const lastNMonthsEarnings = [];
	let startDate, endDate, earnings, month;
	let date = new Date();
	let MONTHS_EARNINGS = 6;
	for(let i = MONTHS_EARNINGS - 1; i >= 0; i--){
		endDate = new Date(date.getFullYear(), date.getMonth() - i + 1, 1);
		startDate = new Date(date.getFullYear(), date.getMonth() - i, 2);
		let consultationDocs = await Consultation.find({
			'date': { '$gte': startDate.toISOString().split('T')[0], '$lte': endDate.toISOString().split('T')[0] }
		}).exec();
		month = startDate.toLocaleString('default', { month: 'long' });
		earnings = consultationDocs.reduce((acc, c) => acc + c.amountReceived, 0);
		lastNMonthsEarnings.push({month, earnings});
	}
	stats.lastNMonthsEarnings = lastNMonthsEarnings;

	//Calculate total patients
	stats.totalUniquePatients = await Patient.count({}).exec();

	//Calculate Dues for each patient and store them in descending order of due amount
	let patientsWithDues =  await Consultation.aggregate().group(
		{
			_id: "$patientId", 
			totalDues: { 
				$sum : { $subtract: ["$amountCharged", "$amountReceived"] } 
			}
		})
		.match({ totalDues: { $gt: 0 } })
		.lookup({ 
			from: 'patients', 
			localField: '_id', 
			foreignField: '_id', 
			as: 'patient_info' 
		})
		.unwind('$patient_info')
		.project({
			_id: 0, 
			totalDues: 1, 
			fullName: {$concat: [ "$patient_info.firstName", " ", "$patient_info.lastName"]}
		})
		.sort({ totalDues: -1 });
	console.log(patientsWithDues);

	//Number of patients with dues
	stats.patientsWithDues = patientsWithDues.length;

	//Total Dues
	stats.totalDues = patientsWithDues.reduce((acc, p) => acc + p.totalDues, 0);

	//Top 5 Patients with most Dues
	stats.topPatientsWithDues = patientsWithDues.slice(0, 5);

	response.json(stats);
};

module.exports = {
	getStats
};