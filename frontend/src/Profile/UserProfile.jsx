import React, { useState, useEffect } from 'react';
import { childrenAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


export default function UserProfile() {
    const { isVerified, user } = useAuth();
    const [children, setChildren] = useState([]);
    const [showAddChildForm, setShowAddChildForm] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [updatingVaccination, setUpdatingVaccination] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [childToDelete, setChildToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    console.log(user);
    const canAddChild = isVerified || children.length < 2;


    const [childFormData, setChildFormData] = useState({
        name: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        allergies: '',
        medicalConditions: ''
    });

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const response = await childrenAPI.getAll();
            const childrenData = response.data.data || [];

            setChildren(childrenData);

            if (childrenData.length > 0 && !selectedChild) {
                setSelectedChild(childrenData[0]);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
            setChildren([]);
        }
    };

    const calculateAgeInMonths = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        const months = (today.getFullYear() - birthDate.getFullYear()) * 12 +
            (today.getMonth() - birthDate.getMonth());
        return months;
    };

    const calculateVaccinationDate = (dob, ageInMonths) => {
        const birthDate = new Date(dob);
        const vaccinationDate = new Date(birthDate);
        vaccinationDate.setMonth(vaccinationDate.getMonth() + ageInMonths);
        return vaccinationDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (dob, ageInMonths, isCompleted) => {
        if (isCompleted) return false;
        const currentAgeInMonths = calculateAgeInMonths(dob);
        return currentAgeInMonths > ageInMonths;
    };

    const isUpcoming = (dob, ageInMonths, isCompleted) => {
        if (isCompleted) return false;
        const currentAgeInMonths = calculateAgeInMonths(dob);
        return ageInMonths > currentAgeInMonths && ageInMonths <= currentAgeInMonths + 1;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setChildFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateChildForm = () => {
        const newErrors = {};
        if (!childFormData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!childFormData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        }
        if (!childFormData.gender) {
            newErrors.gender = 'Gender is required';
        }
        return newErrors;
    };

    const handleSubmitChild = async (e) => {
        e.preventDefault();

        // 1. Final Premium/Limit Check
        const canAddChild = user?.isVerified || children.length < 2;

        if (!canAddChild) {
            setErrors({
                general: 'Limit reached. Please upgrade to Premium to add more than 2 children.'
            });
            return;
        }

        // 2. Existing Validation
        const validationErrors = validateChildForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await childrenAPI.create(childFormData);

            await fetchChildren();
            setShowAddChildForm(false);
            setChildFormData({
                name: '',
                dateOfBirth: '',
                gender: '',
                bloodGroup: '',
                allergies: '',
                medicalConditions: ''
            });
            setErrors({});
        } catch (error) {
            console.error('Error adding child:', error);
            // This will now also catch the 403 error sent from the backend we set up earlier
            setErrors({
                general: error.response?.data?.message || 'Failed to add child. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (child, e) => {
        e.stopPropagation();
        setChildToDelete(child);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!childToDelete) return;

        setDeleting(true);
        try {
            await childrenAPI.delete(childToDelete._id);

            if (selectedChild?._id === childToDelete._id) {
                setSelectedChild(null);
            }

            await fetchChildren();

            setShowDeleteModal(false);
            setChildToDelete(null);
        } catch (error) {
            console.error('Error deleting child:', error);
            alert(error.response?.data?.message || 'Failed to delete child. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setChildToDelete(null);
    };

    const handleVaccinationClick = async (vaccination, index, event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!selectedChild) return;

        if (vaccination.isCompleted || updatingVaccination === index) return;

        setUpdatingVaccination(index);

        const vaccinationId = vaccination._id || vaccination.name;
        const completedDate = new Date().toISOString();

        try {
            const response = await childrenAPI.updateVaccination(
                selectedChild._id,
                vaccinationId,
                {
                    isCompleted: true,
                    completedDate: completedDate
                }
            );

            if (response.data.success) {
                const updatedChild = response.data.data;
                setSelectedChild(updatedChild);

                setChildren(prev =>
                    prev.map(c => c._id === updatedChild._id ? updatedChild : c)
                );
            }
        } catch (error) {
            console.error('Error updating vaccination:', error);
            alert('Failed to update vaccination. Please try again.');
        } finally {
            setUpdatingVaccination(null);
        }
    };

    const getVaccinationProgress = (child) => {
        if (!child.vaccinationSchedule?.vaccinations) return 0;
        const vaccinations = child.vaccinationSchedule.vaccinations;
        const completed = vaccinations.filter(v => v.isCompleted).length;
        return Math.round((completed / vaccinations.length) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Child Health Profile
                    </h1>
                    <p className="text-gray-600">Manage your children's health records and vaccination schedules</p>
                    {(!user.isVerified) && (
                        <div className='flex justify-center items-center'><p>Get Premiumn to unlock all features</p>
                            <Link to='/payment'><button className='p-2 border-0 bg-green-600 mx-2 rounded-2xl cursor-pointer'>Buy With Esewa</button></Link></div>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Children List Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Children</h2>
                                <button
                                    onClick={() => setShowAddChildForm(true)}
                                    className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>

                            {children.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <p className="text-gray-500 text-sm">No children added yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {children.map((child) => (
                                        <div
                                            key={child._id}
                                            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${selectedChild?._id === child._id
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="flex-1 flex items-center gap-3"
                                                    onClick={() => setSelectedChild(child)}
                                                >
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${selectedChild?._id === child._id
                                                        ? 'bg-white/20'
                                                        : 'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {child.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold truncate">{child.name}</h3>
                                                        <p className={`text-sm ${selectedChild?._id === child._id ? 'text-white/80' : 'text-gray-500'
                                                            }`}>
                                                            {calculateAgeInMonths(child.dateOfBirth)} months old
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Progress and Delete Section */}
                                                <div className="flex items-center gap-2">
                                                    <div className="text-right">
                                                        <div className={`text-xs font-semibold ${selectedChild?._id === child._id ? 'text-white' : 'text-blue-600'
                                                            }`}>
                                                            {getVaccinationProgress(child)}%
                                                        </div>
                                                        <div className="w-16 h-1.5 bg-white/30 rounded-full mt-1">
                                                            <div
                                                                className={`h-full rounded-full ${selectedChild?._id === child._id ? 'bg-white' : 'bg-blue-600'
                                                                    }`}
                                                                style={{ width: `${getVaccinationProgress(child)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* DELETE BUTTON - ALWAYS VISIBLE */}
                                                    <button
                                                        onClick={(e) => handleDeleteClick(child, e)}
                                                        className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${selectedChild?._id === child._id
                                                            ? 'bg-white/20 hover:bg-white/30 text-white'
                                                            : 'bg-red-50 hover:bg-red-100 text-red-600'
                                                            }`}
                                                        title="Delete child"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {showAddChildForm ? (
                            /* Add Child Form */
                            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Add New Child</h2>
                                    <button
                                        onClick={() => {
                                            setShowAddChildForm(false);
                                            setErrors({});
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {errors.general && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                        {errors.general}
                                    </div>
                                )}

                                <form onSubmit={handleSubmitChild} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter child's name"
                                                value={childFormData.name}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.name
                                                    ? 'border-red-300 focus:ring-red-200'
                                                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                                                    }`}
                                            />
                                            {errors.name && (
                                                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Date of Birth *
                                            </label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={childFormData.dateOfBirth}
                                                onChange={handleInputChange}
                                                max={new Date().toISOString().split('T')[0]}
                                                className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.dateOfBirth
                                                    ? 'border-red-300 focus:ring-red-200'
                                                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                                                    }`}
                                            />
                                            {errors.dateOfBirth && (
                                                <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Gender *
                                            </label>
                                            <select
                                                name="gender"
                                                value={childFormData.gender}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white border rounded-xl text-gray-900 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.gender
                                                    ? 'border-red-300 focus:ring-red-200'
                                                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                                                    }`}
                                            >
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.gender && (
                                                <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Blood Group
                                            </label>
                                            <select
                                                name="bloodGroup"
                                                value={childFormData.bloodGroup}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                                            >
                                                <option value="">Select blood group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Allergies
                                            </label>
                                            <textarea
                                                name="allergies"
                                                placeholder="List any known allergies"
                                                value={childFormData.allergies}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Medical Conditions
                                            </label>
                                            <textarea
                                                name="medicalConditions"
                                                placeholder="List any medical conditions"
                                                value={childFormData.medicalConditions}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddChildForm(false);
                                                setErrors({});
                                            }}
                                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50"
                                        >
                                            {loading ? 'Adding...' : 'Add Child'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : selectedChild ? (
                            /* Child Details and Vaccinations */
                            <div className="space-y-6">
                                {/* Child Info Card */}
                                <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-xl">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedChild.name}</h2>
                                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Born: {new Date(selectedChild.dateOfBirth).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Age: {calculateAgeInMonths(selectedChild.dateOfBirth)} months
                                                </span>
                                                {selectedChild.bloodGroup && (
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                        </svg>
                                                        Blood: {selectedChild.bloodGroup}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-blue-600 mb-1">
                                                {getVaccinationProgress(selectedChild)}%
                                            </div>
                                            <div className="text-xs text-gray-500">Vaccination Complete</div>
                                        </div>
                                    </div>

                                    {selectedChild.allergies && (
                                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Allergies:</p>
                                            <p className="text-sm text-yellow-700">{selectedChild.allergies}</p>
                                        </div>
                                    )}

                                    {selectedChild.medicalConditions && (
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm font-semibold text-blue-800 mb-1">📋 Medical Conditions:</p>
                                            <p className="text-sm text-blue-700">{selectedChild.medicalConditions}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Vaccination Schedule */}
                                <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-xl">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Vaccination Schedule</h3>
                                        <p className="text-sm text-gray-600">Track your child's immunization progress</p>
                                    </div>

                                    <div className="space-y-3">
                                        {selectedChild.vaccinationSchedule?.vaccinations?.map((vaccine, index) => {
                                            const isCompleted = vaccine.isCompleted;
                                            const estimatedDate = calculateVaccinationDate(selectedChild.dateOfBirth, vaccine.ageInMonths);
                                            const overdue = isOverdue(selectedChild.dateOfBirth, vaccine.ageInMonths, isCompleted);
                                            const upcoming = isUpcoming(selectedChild.dateOfBirth, vaccine.ageInMonths, isCompleted);
                                            const isUpdating = updatingVaccination === index;

                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${isCompleted
                                                        ? 'bg-green-50 border-green-200'
                                                        : overdue
                                                            ? 'bg-red-50 border-red-200'
                                                            : upcoming
                                                                ? 'bg-yellow-50 border-yellow-200'
                                                                : 'bg-gray-50 border-gray-200'
                                                        } ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div
                                                            className="flex-shrink-0 pt-1 cursor-pointer"
                                                            onClick={(e) => handleVaccinationClick(vaccine, index, e)}
                                                        >
                                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isCompleted
                                                                ? 'bg-green-500 border-green-500'
                                                                : 'bg-white border-gray-300 hover:border-blue-500'
                                                                } ${isCompleted || isUpdating ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                                                {isCompleted && (
                                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                                {isUpdating && (
                                                                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <h4 className={`font-semibold ${isCompleted ? 'text-green-800 line-through' : 'text-gray-800'
                                                                        }`}>
                                                                        {vaccine.name}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 mt-0.5">{vaccine.description}</p>
                                                                    <div className="flex items-center gap-4 mt-2 text-xs">
                                                                        <span className={`font-medium ${isCompleted ? 'text-green-600' : 'text-gray-600'
                                                                            }`}>
                                                                            Age: {vaccine.ageInMonths === 0 ? 'At birth' : `${vaccine.ageInMonths} months`}
                                                                        </span>
                                                                        <span className={`px-2 py-1 rounded-full ${isCompleted
                                                                            ? 'bg-green-200 text-green-800'
                                                                            : overdue
                                                                                ? 'bg-red-200 text-red-800'
                                                                                : upcoming
                                                                                    ? 'bg-yellow-200 text-yellow-800'
                                                                                    : 'bg-gray-200 text-gray-800'
                                                                            }`}>
                                                                            {isCompleted
                                                                                ? `✓ Completed ${vaccine.completedDate ? new Date(vaccine.completedDate).toLocaleDateString() : ''}`
                                                                                : overdue
                                                                                    ? '⚠️ Overdue'
                                                                                    : upcoming
                                                                                        ? '📅 Upcoming'
                                                                                        : `📅 ${estimatedDate}`
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* No Child Selected */
                            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-12 shadow-xl text-center">
                                <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No Child Selected</h3>
                                <p className="text-gray-500 mb-6">Add a child to start tracking their health records</p>
                                <button
                                    onClick={() => setShowAddChildForm(true)}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                                >
                                    Add Child
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            Delete Child Profile?
                        </h3>

                        <p className="text-gray-600 text-center mb-2">
                            Are you sure you want to delete <span className="font-semibold text-gray-900">{childToDelete?.name}</span>'s profile?
                        </p>

                        <p className="text-sm text-red-600 text-center mb-6">
                            This will permanently delete all health records and vaccination history. This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={cancelDelete}
                                disabled={deleting}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}