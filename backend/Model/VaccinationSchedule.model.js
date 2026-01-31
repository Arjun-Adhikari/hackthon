import mongoose from 'mongoose'
const vaccinationItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ageInMonths: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedDate: {
        type: Date,
        default: null
    },
    administeredBy: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    },
    batchNumber: {
        type: String,
        default: null
    },
    notes: {
        type: String,
        default: null
    },
    nextDueDate: {
        type: Date,
        default: null
    }
});

const vaccinationScheduleSchema = new mongoose.Schema({
    vaccinations: [vaccinationItemSchema]
});


const VaccinationSchedule = mongoose.model('VaccinationSchedule', vaccinationScheduleSchema);
export default VaccinationSchedule;