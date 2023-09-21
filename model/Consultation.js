const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
	notes: String,
    medicines: String,
    days: Number,
    amountCharged: Number,
    amountReceived: Number,
    maramTherapyDone: {
        type: Boolean,
        required: true
    },
    patientId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Patient' 
    }
});

module.exports = mongoose.model('Consultation', consultationSchema);