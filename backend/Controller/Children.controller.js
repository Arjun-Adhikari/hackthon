import Child from '../Model/Children.model.js';
import VaccinationSchedule from '../Model/VaccinationSchedule.model.js';
import { standardVaccinationSchedule } from '../utils/vaccinationData.js';

// Calculate next due date based on date of birth and age in months
const calculateNextDueDate = (dateOfBirth, ageInMonths) => {
    const dob = new Date(dateOfBirth);
    const dueDate = new Date(dob);
    dueDate.setMonth(dueDate.getMonth() + ageInMonths);
    return dueDate;
};

// Get all children for logged-in user
export const getChildren = async (req, res) => {
    try {
        const children = await Child.find({ user: req.user.id })
            .populate('vaccinationSchedule')
            .sort({ dateOfBirth: -1 });

        console.log('Children fetched:', JSON.stringify(children, null, 2));

        res.status(200).json({
            success: true,
            count: children.length,
            data: children
        });
    } catch (error) {
        console.error('Get children error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching children',
            error: error.message
        });
    }
};

// Get single child
export const getChild = async (req, res) => {
    try {
        const child = await Child.findById(req.params.id)
            .populate('vaccinationSchedule');

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        // Check if child belongs to the user
        if (child.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this child'
            });
        }

        res.status(200).json({
            success: true,
            data: child
        });
    } catch (error) {
        console.error('Get child error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching child',
            error: error.message
        });
    }
};

// Add new child
export const addChild = async (req, res) => {
    try {
        const { name, dateOfBirth, gender, bloodGroup, allergies, medicalConditions } = req.body;

        // 1. Check if the user is verified (Premium)
        // Note: req.user should be populated by your auth middleware
        const isVerified = req.user.isVerified;

        // 2. Count existing children for this user
        const childCount = await Child.countDocuments({ user: req.user.id });

        // 3. Enforce limit: Non-verified users can only have 2 children
        if (!isVerified && childCount >= 2) {
            return res.status(403).json({
                success: false,
                message: 'Limit reached. Non-verified accounts can only add up to 2 children. Please upgrade to Premium to add more.'
            });
        }

        // Validate required fields
        if (!name || !dateOfBirth || !gender) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, date of birth, and gender'
            });
        }

        // Create vaccination schedule with calculated due dates
        const vaccinations = standardVaccinationSchedule.map(vaccine => ({
            ...vaccine,
            isCompleted: false,
            completedDate: null,
            administeredBy: null,
            location: null,
            batchNumber: null,
            notes: null,
            nextDueDate: calculateNextDueDate(dateOfBirth, vaccine.ageInMonths)
        }));

        console.log('Creating vaccination schedule with', vaccinations.length, 'vaccines');

        const vaccinationSchedule = await VaccinationSchedule.create({
            vaccinations
        });

        console.log('Vaccination schedule created:', vaccinationSchedule._id);

        // Create child
        const child = await Child.create({
            user: req.user.id,
            name,
            dateOfBirth,
            gender,
            bloodGroup: bloodGroup || '',
            allergies: allergies || '',
            medicalConditions: medicalConditions || '',
            vaccinationSchedule: vaccinationSchedule._id
        });

        console.log('Child created with vaccination schedule:', child.vaccinationSchedule);

        // Populate vaccination schedule before sending response
        await child.populate('vaccinationSchedule');

        res.status(201).json({
            success: true,
            data: child
        });
    } catch (error) {
        console.error('Add child error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding child',
            error: error.message
        });
    }
};

// Update child information
export const updateChild = async (req, res) => {
    try {
        const { name, gender, bloodGroup, allergies, medicalConditions } = req.body;

        let child = await Child.findById(req.params.id);

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        // Check if child belongs to the user
        if (child.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this child'
            });
        }

        // Update fields
        if (name) child.name = name;
        if (gender) child.gender = gender;
        if (bloodGroup !== undefined) child.bloodGroup = bloodGroup;
        if (allergies !== undefined) child.allergies = allergies;
        if (medicalConditions !== undefined) child.medicalConditions = medicalConditions;

        await child.save();
        await child.populate('vaccinationSchedule');

        res.status(200).json({
            success: true,
            data: child
        });
    } catch (error) {
        console.error('Update child error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating child',
            error: error.message
        });
    }
};

// Delete child
export const deleteChild = async (req, res) => {
    try {
        const child = await Child.findById(req.params.id);

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        // Check if child belongs to the user
        if (child.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this child'
            });
        }

        // Delete vaccination schedule
        if (child.vaccinationSchedule) {
            await VaccinationSchedule.findByIdAndDelete(child.vaccinationSchedule);
        }

        // Delete child
        await Child.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: {},
            message: 'Child deleted successfully'
        });
    } catch (error) {
        console.error('Delete child error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting child',
            error: error.message
        });
    }
};

// Update vaccination status
export const updateVaccination = async (req, res) => {
    try {
        const { childId, vaccinationId } = req.params;
        const { isCompleted, completedDate, administeredBy, location, batchNumber, notes } = req.body;

        const child = await Child.findById(childId).populate('vaccinationSchedule');

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        // Check if child belongs to the user
        if (child.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this vaccination'
            });
        }

        // Find and update the vaccination
        const vaccinationSchedule = child.vaccinationSchedule;

        // Try to find by _id first, then by name
        let vaccination = vaccinationSchedule.vaccinations.id(vaccinationId);

        if (!vaccination) {
            // If not found by ID, search by name
            vaccination = vaccinationSchedule.vaccinations.find(v => v.name === vaccinationId);
        }

        if (!vaccination) {
            return res.status(404).json({
                success: false,
                message: 'Vaccination not found'
            });
        }

        // Prevent unchecking - once a vaccination is completed, it cannot be changed
        if (vaccination.isCompleted && !isCompleted) {
            return res.status(400).json({
                success: false,
                message: 'Completed vaccinations cannot be unchecked'
            });
        }

        // Update vaccination fields
        vaccination.isCompleted = isCompleted !== undefined ? isCompleted : vaccination.isCompleted;
        vaccination.completedDate = isCompleted ? (completedDate || new Date()) : null;
        vaccination.administeredBy = administeredBy || vaccination.administeredBy;
        vaccination.location = location || vaccination.location;
        vaccination.batchNumber = batchNumber || vaccination.batchNumber;
        vaccination.notes = notes || vaccination.notes;

        await vaccinationSchedule.save();
        await child.populate('vaccinationSchedule');

        res.status(200).json({
            success: true,
            data: child
        });
    } catch (error) {
        console.error('Update vaccination error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating vaccination',
            error: error.message
        });
    }
};

// Bulk update vaccinations
export const bulkUpdateVaccinations = async (req, res) => {
    try {
        const { childId } = req.params;
        const { vaccinations } = req.body;

        const child = await Child.findById(childId).populate('vaccinationSchedule');

        if (!child) {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        // Check if child belongs to the user
        if (child.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update vaccinations'
            });
        }

        const vaccinationSchedule = child.vaccinationSchedule;

        // Update each vaccination
        vaccinations.forEach(updateData => {
            const vaccination = vaccinationSchedule.vaccinations.find(
                v => v.name === updateData.name
            );

            if (vaccination) {
                vaccination.isCompleted = updateData.isCompleted;
                vaccination.completedDate = updateData.isCompleted
                    ? (updateData.completedDate || new Date())
                    : null;
            }
        });

        await vaccinationSchedule.save();
        await child.populate('vaccinationSchedule');

        res.status(200).json({
            success: true,
            data: child
        });
    } catch (error) {
        console.error('Bulk update vaccinations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating vaccinations',
            error: error.message
        });
    }
};