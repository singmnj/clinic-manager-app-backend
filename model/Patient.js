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
	city: {
		type: String,
		required: true,
	},
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

patientSchema.set("toJSON", {
	virtuals: true,
	transform: (doc, converted) => {
		delete converted._id;
		delete converted.__v;
		converted.dob = doc.dob.toISOString().substring(0, 10);
	},
});

module.exports = mongoose.model("Patient", patientSchema);
