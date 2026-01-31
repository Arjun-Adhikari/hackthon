import React from "react";
import { useNavigate } from "react-router-dom";

const Failure = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-red-500">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed!</h1>
                <p className="text-gray-600 mb-8">
                    Something went wrong with your transaction. Please check your balance or try again.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition duration-200"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default Failure;