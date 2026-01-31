import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatInput from '../components/ChatInput';
import MessageList from '../components/MessageList';
import { getUserLocation } from '../services/locationService';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [userCoords, setUserCoords] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleStartSession = async () => {
        console.log("🚀 Starting session...");
        
        // Try to unlock audio context
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') await audioCtx.resume();
            console.log("✅ Audio context ready");
        } catch (err) {
            console.warn("⚠️ Audio context setup failed:", err);
        }

        // Try to get location (but don't block if it fails)
        try {
            const coords = await getUserLocation();
            setUserCoords(coords);
            console.log("✅ Location obtained:", coords);
        } catch (err) {
            console.warn("⚠️ Location denied or unavailable:", err);
            // Set default/null coords - app will work without location
            setUserCoords(null);
        }

        // Try to request mic permission early (optional)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Release immediately
            console.log("✅ Microphone permission granted");
        } catch (err) {
            console.warn("⚠️ Microphone permission not granted yet:", err);
        }

        // Always initialize - don't block on errors
        setIsInitialized(true);
        console.log("✅ Session initialized");
    };

    const startRecording = async () => {
        console.log("🎤 startRecording called");
        try {
            console.log("Requesting microphone access...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("✅ Microphone access granted");
            
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                console.log("📦 Audio data chunk received:", e.data.size, "bytes");
                audioChunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                console.log("⏹️ Recording stopped");
                const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                console.log("🎵 Audio blob created:", audioBlob.size, "bytes, type:", mimeType);
                
                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => {
                    console.log("Stopping track:", track.label);
                    track.stop();
                });
                
                // Send the audio
                console.log("📤 Sending audio...");
                await handleSubmit(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            console.log("✅ Recording started successfully");
        } catch (err) {
            console.error("❌ Microphone error:", err);
            alert("Please enable microphone access to record audio.");
        }
    };

    const stopRecording = () => {
        console.log("⏹️ stopRecording called");
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log("✅ Recording stopped");
        }
    };

    const handleSubmit = async (audioBlob = null) => {
        console.log("📨 handleSubmit called");
        
        if ((!input.trim() && !audioBlob) || loading) {
            console.log("❌ Submit blocked");
            return;
        }

        const userText = input.trim();
        setInput('');

        const newUserMsg = {
            role: 'user',
            parts: [{ text: audioBlob ? "🎤 Audio Note Sent" : userText }]
        };
        setMessages(prev => [...prev, newUserMsg]);
        setLoading(true);

        try {
            const formData = new FormData();
            
            // Try to get location, but use null if unavailable
            let finalCoords = userCoords;
            if (!finalCoords) {
                try {
                    finalCoords = await getUserLocation();
                } catch (err) {
                    console.warn("Location unavailable, sending without it");
                    finalCoords = null;
                }
            }
            
            if (finalCoords) {
                formData.append('location', JSON.stringify(finalCoords));
            }

            if (audioBlob) {
                console.log("Adding audio to FormData");
                formData.append('audio', audioBlob, 'recording.webm');
            } else {
                console.log("Adding text to FormData");
                formData.append('message', userText);
            }

            console.log("📡 Sending request...");
            const response = await axios.post('http://localhost:5000/api/chat', formData);
            console.log("✅ Response received");

            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: response.data.reply }]
            }]);

        } catch (error) {
            console.error('❌ Error:', error);
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

    if (!isInitialized) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-indigo-900 text-white">
                <h1 className="text-3xl font-bold mb-4">Vaccination Assistant</h1>
                <p className="mb-8 text-indigo-200">
                    Optional: Enable location and audio for enhanced features.
                </p>
                <button
                    onClick={handleStartSession}
                    className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-100 transition-colors shadow-xl"
                >
                    🚀 Start Chatting
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <MessageList messages={messages} loading={loading} messagesEndRef={messagesEndRef} />
            <ChatInput
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                handleKeyPress={handleKeyPress}
                loading={loading}
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
            />
        </div>
    );
}