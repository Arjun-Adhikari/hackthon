import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatInput from '../components/ChatInput';
import MessageList from '../components/MessageList';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async () => {
        if (!input.trim() || loading) {
            return;
        }

        const userText = input.trim();
        setInput('');

        const newUserMsg = {
            role: 'user',
            parts: [{ text: userText }]
        };
        setMessages(prev => [...prev, newUserMsg]);
        setLoading(true);

        try {
            console.log(userText);
            
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: userText
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: response.data.reply }]
            }]);

        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: "Connection failed. Please try again." }]
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <MessageList messages={messages} loading={loading} messagesEndRef={messagesEndRef} />
            <ChatInput
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                handleKeyPress={handleKeyPress}
                loading={loading}
            />
        </div>
    );
}