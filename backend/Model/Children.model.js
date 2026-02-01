import mongoose from 'mongoose';
const childSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide child name'],
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please provide date of birth']
    },
    gender: {
        type: String,
        required: [true, 'Please provide gender'],
        enum: ['male', 'female', 'other']
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
        default: ''
    },
    allergies: {
        type: String,
        default: ''
    },
    medicalConditions: {
        type: String,
        default: ''
    },
    vaccinationSchedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VaccinationSchedule'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

childSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

const Children = mongoose.model('Child', childSchema);
export default Children