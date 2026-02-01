import React, { useState } from 'react';
import axios from 'axios';

function Notify() {
    const [formData, setFormData] = useState({
        to: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const response = await axios.post('http://localhost:5000/api/sms/send', formData);

            if (response.data.status === 'success') {
                setStatus(`✅ Success! Message ID: ${response.data.data.message_id}`);
                setFormData({ to: '', message: '' }); 
            } else {
                setStatus(`Error: ${response.data.message}`);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to connect to the server.';
            setStatus(` Error: ${errorMsg}`);
            console.error("SMS Error:", error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto', fontFamily: 'Arial, sans-serif', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>WebPal SMS Notification</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>To (Phone Number):</label>
                    <input
                        type="text"
                        placeholder="98XXXXXXXX"
                        value={formData.to}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                        required
                    />
                    <small style={{ color: '#666' }}>Format: 9841234567</small>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Message:</label>
                    <textarea
                        value={formData.message}
                        rows="4"
                        placeholder="Type your message here..."
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'Sending...'}
                    style={{
                        width: '100%',
                        padding: '12px',
                        cursor: status === 'Sending...' ? 'not-allowed' : 'pointer',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    {status === 'Sending...' ? 'Sending...' : 'Send SMS'}
                </button>
            </form>

            {status && (
                <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    background: status.includes('✅') ? '#e6fffa' : '#fff5f5',
                    color: status.includes('✅') ? '#276749' : '#c53030',
                    border: `1px solid ${status.includes('✅') ? '#38a169' : '#e53e3e'}`
                }}>
                    {status}
                </div>
            )}
        </div>
    );
}

export default Notify;