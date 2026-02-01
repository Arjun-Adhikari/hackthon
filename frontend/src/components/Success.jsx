import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useEffect } from "react";
import axios from "axios";



const Success = () => {
    const { user } = useAuth();

    const handleVerify = async () => {
        try {
            const response = await axios.put('http://localhost:5000/api/user/verify',{"userId":user.id})
            console.log(response.data);
        } catch (error) {
            console.error("Error verifying email:", error);
        }
    };

    handleVerify();


    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-xl text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">
                    Thank you for your payment. Your transaction has been processed successfully.
                </p>
                <button
                    onClick={() => {
                        handleVerify();
                        navigate("/");
                    }}
                    className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition duration-200"
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    );
};

export default Success;