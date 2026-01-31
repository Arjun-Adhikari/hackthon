import mongoose from 'mongoose'

const ChildSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String },
    allergies: { type: String, default: 'None' },
    medicalConditions: { type: String, default: 'None' },

}, { timestamps: true });

const Children = mongoose.model('Child', ChildSchema);
export default Children
