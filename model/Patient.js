const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
	opd: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	phone: String,
	address: String,
	city: String,
	notes: String,
	gender: {
		type: String,
		required: true,
	},
	dob: {
		type: Date,
		required: true,
	},
});

module.exports = mongoose.model("Patient", patientSchema);
