import { useState } from 'react';
import axios from 'axios';

const Verify = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        specialization: '',
        licenseNumber: '',
        yearsOfExperience: '',
        hospital: '',
        qualification: '',
        address: ''
    });

    const [documents, setDocuments] = useState({
        medicalLicense: null,
        degree: null,
        idProof: null
    });

    const [previews, setPreviews] = useState({
        medicalLicense: null,
        degree: null,
        idProof: null
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file upload
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size should not exceed 5MB' });
                return;
            }

            // Validate file type
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setMessage({ type: 'error', text: 'Only PDF, JPEG, JPG, and PNG files are allowed' });
                return;
            }

            setDocuments(prev => ({
                ...prev,
                [name]: file
            }));

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => ({
                        ...prev,
                        [name]: reader.result
                    }));
                };
                reader.readAsDataURL(file);
            } else {
                setPreviews(prev => ({
                    ...prev,
                    [name]: 'pdf'
                }));
            }
        }
    };

    // Remove uploaded file
    const removeFile = (fieldName) => {
        setDocuments(prev => ({
            ...prev,
            [fieldName]: null
        }));
        setPreviews(prev => ({
            ...prev,
            [fieldName]: null
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        if (!documents.medicalLicense || !documents.degree || !documents.idProof) {
            setMessage({ type: 'error', text: 'Please upload all required documents' });
            return;
        }

        setLoading(true);

        try {
            // Create FormData object
            const submitData = new FormData();

            // Append form fields
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            // Append files
            submitData.append('medicalLicense', documents.medicalLicense);
            submitData.append('degree', documents.degree);
            submitData.append('idProof', documents.idProof);

            // Make API call
            const response = await axios.post('/api/doctor/verify', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage({ type: 'success', text: 'Verification request submitted successfully! We will review your documents and get back to you soon.' });

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                specialization: '',
                licenseNumber: '',
                yearsOfExperience: '',
                hospital: '',
                qualification: '',
                address: ''
            });
            setDocuments({
                medicalLicense: null,
                degree: null,
                idProof: null
            });
            setPreviews({
                medicalLicense: null,
                degree: null,
                idProof: null
            });

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to submit verification request. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Doctor Verification</h2>
                        <p className="mt-2 text-gray-600">
                            Please provide your details and upload required documents for verification
                        </p>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            <p className="text-sm font-medium">{message.text}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Dr. John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="doctor@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                                        Specialization *
                                    </label>
                                    <input
                                        type="text"
                                        id="specialization"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Cardiology, Neurology, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Information Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        Medical License Number *
                                    </label>
                                    <input
                                        type="text"
                                        id="licenseNumber"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="MED-123456"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-2">
                                        Years of Experience *
                                    </label>
                                    <input
                                        type="number"
                                        id="yearsOfExperience"
                                        name="yearsOfExperience"
                                        value={formData.yearsOfExperience}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="5"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-2">
                                        Highest Qualification *
                                    </label>
                                    <input
                                        type="text"
                                        id="qualification"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="MBBS, MD, etc."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Hospital/Clinic *
                                    </label>
                                    <input
                                        type="text"
                                        id="hospital"
                                        name="hospital"
                                        value={formData.hospital}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="City Hospital"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                        Practice Address *
                                    </label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your complete practice address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Document Upload Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                All documents are required. Accepted formats: PDF, JPEG, JPG, PNG (Max 5MB each)
                            </p>

                            <div className="space-y-4">
                                {/* Medical License */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Medical License *
                                    </label>
                                    {!documents.medicalLicense ? (
                                        <div>
                                            <input
                                                type="file"
                                                id="medicalLicense"
                                                name="medicalLicense"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="medicalLicense"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-sm text-blue-600 hover:text-blue-700">
                                                    Click to upload medical license
                                                </span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                            <div className="flex items-center space-x-3">
                                                {previews.medicalLicense === 'pdf' ? (
                                                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                    </svg>
                                                ) : (
                                                    <img src={previews.medicalLicense} alt="Preview" className="w-16 h-16 object-cover rounded" />
                                                )}
                                                <span className="text-sm text-gray-700">{documents.medicalLicense.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile('medicalLicense')}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Degree Certificate */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Degree Certificate *
                                    </label>
                                    {!documents.degree ? (
                                        <div>
                                            <input
                                                type="file"
                                                id="degree"
                                                name="degree"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="degree"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-sm text-blue-600 hover:text-blue-700">
                                                    Click to upload degree certificate
                                                </span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                            <div className="flex items-center space-x-3">
                                                {previews.degree === 'pdf' ? (
                                                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                    </svg>
                                                ) : (
                                                    <img src={previews.degree} alt="Preview" className="w-16 h-16 object-cover rounded" />
                                                )}
                                                <span className="text-sm text-gray-700">{documents.degree.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile('degree')}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* ID Proof */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Government ID Proof *
                                    </label>
                                    {!documents.idProof ? (
                                        <div>
                                            <input
                                                type="file"
                                                id="idProof"
                                                name="idProof"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="idProof"
                                                className="cursor-pointer flex flex-col items-center"
                                            >
                                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <span className="text-sm text-blue-600 hover:text-blue-700">
                                                    Click to upload ID proof
                                                </span>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                            <div className="flex items-center space-x-3">
                                                {previews.idProof === 'pdf' ? (
                                                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                    </svg>
                                                ) : (
                                                    <img src={previews.idProof} alt="Preview" className="w-16 h-16 object-cover rounded" />
                                                )}
                                                <span className="text-sm text-gray-700">{documents.idProof.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile('idProof')}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-md text-white font-medium ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    'Submit for Verification'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 p-4 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> All information provided will be kept confidential and used only for verification purposes.
                            You will receive an email confirmation once your verification is complete.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;