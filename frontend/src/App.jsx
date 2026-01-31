// import { useState, useRef, useEffect } from 'react';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import Header from './components/Header';
// import MessageList from './components/MessageList';
// import ChatInput from './components/ChatInput'

// const API_KEY = "AIzaSyAkBOySw2Qt2bkoDNgeMP6kNd_59R2iwAA";
// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// export default function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = async () => {
//     if (!input.trim() || loading) return;

//     const userText = input.trim();
//     setInput('');
//     const newUserMsg = { role: 'user', parts: [{ text: userText }] };
//     setMessages(prev => [...prev, newUserMsg]);
//     setLoading(true);

//     try {
//       const chat = model.startChat({ history: messages });
//       const result = await chat.sendMessage(userText);
//       const response = await result.response;
//       const botText = response.text();

//       setMessages(prev => [...prev, { role: 'model', parts: [{ text: botText }] }]);
//     } catch (error) {
//       console.error('Gemini Error:', error);
//       setMessages(prev => [...prev, { 
//         role: 'model', 
//         parts: [{ text: 'Error: Failed to connect to Google AI.' }] 
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <Header />
//       <MessageList messages={messages} loading={loading} messagesEndRef={messagesEndRef} />
//       <ChatInput 
//         input={input} 
//         setInput={setInput} 
//         handleSubmit={handleSubmit} 
//         handleKeyPress={handleKeyPress} 
//         loading={loading} 
//       />
//     </div>
//   );
// }


import { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // 1. Import axios
import Header from './components/Header';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

export default function App() {
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
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    
    const newUserMsg = { role: 'user', parts: [{ text: userText }] };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    try {
      // 2. Use Axios to call your backend
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userText // Axios automatically converts this to JSON
      });

      // 3. Axios puts the actual data inside a .data property
      const botText = response.data;

      setMessages(prev => [...prev, { role: 'model', parts: [{ text: botText }] }]);
    } catch (error) {
      console.error('Axios Error:', error);
      
      // Axios errors contain more detail, we check for response from server
      const errorMessage = error.response?.data?.error || 'Error: Connection failed.';
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: errorMessage }] 
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
      <Header />
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