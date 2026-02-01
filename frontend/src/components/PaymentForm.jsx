import React, { useState } from "react";
import axios from "axios";

const PaymentComponent = () => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/payment/initiate-payment", {
                amount: 500,
                productId: "ORDER_" + Date.now(), 
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                alert("Failed to get payment URL from backend");
            }
        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Error connecting to server. Is your backend running?");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-10">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-green-600 text-2xl font-bold">Rs.</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">eSewa Payment</h1>
                    <p className="text-gray-500 mt-2">Safe & Secure Transaction</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Amount to Pay (NPR)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            min="1"
                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-lg font-medium"
                            placeholder="Enter amount (e.g. 500)"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#60bb46] hover:bg-[#52a63b] text-white font-bold py-4 px-4 rounded-xl transition duration-300 transform active:scale-95 shadow-lg flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : null}
                        {loading ? "Processing..." : "Pay with eSewa"}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6 uppercase tracking-widest">
                    Secure Payment Powered by eSewa
                </p>
            </div>
        </div>
    );
};

export default PaymentComponent;