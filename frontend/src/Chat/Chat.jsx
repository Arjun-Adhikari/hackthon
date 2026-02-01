import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import ChatInput from '../components/ChatInput';
import MessageList from '../components/MessageList';
import { childrenAPI } from '../services/api';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [loadingChildren, setLoadingChildren] = useState(false);
    const messagesEndRef = useRef(null);
    const [lat, setlat] = useState()
    const [long, setlong] = useState()

    // Fetch user's children on component mount
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                setLoadingChildren(true);
                const response = await childrenAPI.getAll();
                setChildren(response.data);
                if (response.data.length > 0) {
                    setSelectedChild(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching children:', error);
            } finally {
                setLoadingChildren(false);
            }
        };
        fetchChildren();
    }, []);

    useEffect(() => {
        function getCoords() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    const { latitude, longitude } = pos.coords;
                    setlat(latitude)
                    setlong(longitude)
                }, (err) => {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                });
            }
        }
        getCoords();
    }, [])


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

            const chatPayload = {
                message: userText,
                childData: selectedChild || null,
                lat: lat,
                long: long,
            };

            console.log(chatPayload);
            

            const response = await axios.post('http://localhost:5000/api/chat', chatPayload, {
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